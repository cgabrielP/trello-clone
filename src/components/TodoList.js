import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import AddTaskButton from "./AddTaskButton";  // Importamos el nuevo componente

const TodoList = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener las tareas desde Firestore
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksCollection = collection(db, 'todos');
                const querySnapshot = await getDocs(tasksCollection);

                const fetchedTasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTasks(fetchedTasks);
                setLoading(false);
            } catch (err) {
                setError("Hubo un problema al obtener las tareas.");
                setLoading(false);
            }
        };

        fetchTasks();
    }, []); // Puedes agregar userId como dependencia si lo necesitas para filtrar

    // Función para actualizar el status de la tarea en Firestore
    const updateTaskStatus = async (taskId, newStatus) => {
        const taskRef = doc(db, 'todos', taskId);
        await updateDoc(taskRef, {
            status: newStatus
        });
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

    // Función para agregar una nueva tarea
    const addTask = async (taskName, status) => {
        const tasksCollection = collection(db, 'todos');
        const newTask = {
            activity: taskName,
            status,
            user_uid: userId,  
        };

        const docRef = await addDoc(tasksCollection, newTask);
        setTasks([...tasks, { id: docRef.id, ...newTask }]);
    };

    if (loading) return <p className="text-center text-lg text-gray-500">Cargando tareas...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="mt-2 p-6  flex justify-between space-x-4">
                {/* Columna 1: Pendientes */}
                <Droppable droppableId="pending">
                    {(provided) => (
                        <div
                            className="w-1/3 p-4 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <div className="font-semibold text-2xl mb-4 text-indigo-600">Pendientes</div>
                            {tasks
                                .filter(task => task.status === "pending")
                                .map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="todo-item text-gray-400 p-4 bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-lg shadow-md mb-4 transition-all duration-300 hover:shadow-xl"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {task.activity}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            <AddTaskButton onAddTask={(taskName) => addTask(taskName, "pending")} status="pending" />

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Columna 2: En Progreso */}
                <Droppable droppableId="in-progress">
                    {(provided) => (
                        <div
                            className="w-1/3 p-4 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <div className="font-semibold text-2xl mb-4 text-yellow-600">En Progreso</div>
                            {tasks
                                .filter(task => task.status === "in-progress")
                                .map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="todo-item text-gray-400 p-4 bg-gradient-to-r from-green-100 to-green-300 rounded-lg shadow-md mb-4 transition-all duration-300 hover:shadow-xl"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {task.activity}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            <AddTaskButton onAddTask={(taskName) => addTask(taskName, "in-progress")} status="in-progress" />

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Columna 3: Completadas */}
                <Droppable droppableId="done">
                    {(provided) => (
                        <div
                            className="w-1/3 p-4 bg-white rounded-lg shadow-lg border-2 border-dashed border-gray-300"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <div className="font-semibold text-2xl mb-4 text-green-600">Completadas</div>
                            {tasks
                                .filter(task => task.status === "done")
                                .map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="todo-item text-gray-400 p-4 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-md mb-4 transition-all duration-300 hover:shadow-xl"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {task.activity}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            <AddTaskButton onAddTask={(taskName) => addTask(taskName, "done")} status="done" />

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default TodoList;
