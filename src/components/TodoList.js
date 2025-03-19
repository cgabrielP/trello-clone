import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { collection, getDocs, doc, updateDoc, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import AddTaskButton from "./AddTaskButton";
import { Trash } from "lucide-react";

const TodoList = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener las tareas desde Firestore
    useEffect(() => {
        const tasksCollection = collection(db, "todos");
        const q = query(tasksCollection, where("user_uid", "==", userId));

        // Escucha en tiempo real los cambios en la colección
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedTasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setTasks(fetchedTasks);
            setLoading(false);
        }, (err) => {
            setError("Hubo un problema al obtener las tareas.");
            console.log(err);
            setLoading(false);
        });

        // Limpiar la suscripción al componente desmontarse
        return () => unsubscribe();
    }, [userId]);


    // Función para actualizar el status de la tarea en Firestore
    const updateTaskStatus = async (taskId, newStatus) => {
        const taskRef = doc(db, 'todos', taskId);
        await updateDoc(taskRef, {
            status: newStatus
        });
    };

    const checkTask = async (taskId) => {
        const taskRef = doc(db, "todos", taskId);
        await updateDoc(taskRef, { is_eliminated: true });
      };

      
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId !== destination.droppableId) {
            const updatedTasks = [...tasks];
            const task = updatedTasks.find((task) => task.id === result.draggableId);
            const newStatus = destination.droppableId;

            // Actualizamos el estado local
            task.status = newStatus;
            setTasks(updatedTasks);

            // Actualizamos el estado en Firestore
            updateTaskStatus(task.id, newStatus);
        }
    };

    const addTask = async (taskName, status) => {
        const tasksCollection = collection(db, 'todos');
        const newTask = {
            activity: taskName,
            status,
            is_eliminated:false,
            user_uid: userId,
        };

        const docRef = await addDoc(tasksCollection, newTask);
        setTasks([...tasks, { id: docRef.id, ...newTask }]);
    };

    if (loading) return <p className="text-center text-lg text-gray-500">Cargando tareas...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {/* Columna Pendientes */}
                <Droppable droppableId="pending">
                    {(provided) => (
                        <div
                            className="p-6 rounded-lg shadow-md border-2 border-dashed border-red-500"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h3 className="font-bold text-2xl mb-4 text-red-700 text-center">Pendientes</h3>
                            {tasks.filter((task) => task.status === "pending" && !task.is_eliminated).length > 0 ? (
                                tasks.filter((task) => task.status === "pending"&& !task.is_eliminated).map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <>
                                                <div
                                                    className="p-4 bg-white text-black border-l-4 border-red-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className="flex justify-between items-center">
                                                    <span>{task.activity}</span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={() => { checkTask(task.id); }}
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                                </div>
                                            </>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center pt-2 italic">
                                    No hay tareas, agrega alguna
                                </p>
                            )}
                            {provided.placeholder}
                            <div className="mt-4 flex justify-center">
                                <AddTaskButton onAddTask={(taskName) => addTask(taskName, "pending")} />
                            </div>
                        </div>
                    )}
                </Droppable>

                {/* Columna En Progreso */}
                <Droppable droppableId="in-progress">
                    {(provided) => (
                        <div
                            className="p-6 rounded-lg shadow-md border-2 border-dashed border-yellow-500"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h3 className="font-bold text-2xl mb-4 text-yellow-700 text-center">En Progreso</h3>
                            {tasks.filter((task) => task.status === "in-progress"&& !task.is_eliminated).length > 0 ? (
                                tasks.filter((task) => task.status === "in-progress" && !task.is_eliminated).map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="p-4 bg-white text-black border-l-4 border-yellow-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{task.activity}</span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={() => { checkTask(task.id); }}
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center pt-2 italic">
                                    No hay tareas, agrega alguna
                                </p>
                            )}
                            {provided.placeholder}
                            <div className="mt-4 flex justify-center">
                                <AddTaskButton onAddTask={(taskName) => addTask(taskName, "in-progress")} />
                            </div>
                        </div>
                    )}
                </Droppable>

                {/* Columna Completadas */}
                <Droppable droppableId="done">
                    {(provided) => (
                        <div
                            className=" p-6 rounded-lg shadow-md border-2 border-dashed border-green-500"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <h3 className="font-bold text-2xl mb-4 text-green-700 text-center">Completadas</h3>
                            {tasks.filter((task) => task.status === "done" && !task.is_eliminated).length > 0 ? (
                                tasks.filter((task) => task.status === "done" && !task.is_eliminated).map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="p-4 bg-white border-l-4 text-black border-green-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{task.activity}</span>
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={() => { checkTask(task.id); }}
                                                    >
                                                        <Trash size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p className="text-gray-600 text-center pt-2 italic">
                                    No hay tareas, agrega alguna
                                </p>
                            )}
                            {provided.placeholder}
                            <div className="mt-4 flex justify-center">
                                <AddTaskButton onAddTask={(taskName) => addTask(taskName, "done")} />
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default TodoList;
