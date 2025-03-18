import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import AddTaskButton from "./AddTaskButton";

const TodoList = ({ userId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener las tareas desde Firestore
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksCollection = collection(db, "todos");
                const q = query(tasksCollection, where("user_uid", "==", userId)); // Filtra por user_uid
                const querySnapshot = await getDocs(q);

                const fetchedTasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setTasks(fetchedTasks);
                setLoading(false);
            } catch (err) {
                setError("Hubo un problema al obtener las tareas.");
                console.log(err);

                setLoading(false);
            }
        };

        fetchTasks();
    }, [userId]);

    const columns = [
        { id: "pending", title: "Pendientes", color: "red" },
        { id: "in-progress", title: "En Progreso", color: "yellow" },
        { id: "done", title: "Completadas", color: "green" },
    ];    // Función para actualizar el status de la tarea en Firestore
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {columns.map(({ id, title, color }) => (
                    <Droppable key={id} droppableId={id}>
                        {(provided) => (
                            <div
                                className={` p-6 rounded-lg shadow-md border-2 border-dashed border-${color}-500`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h3 className={`font-bold text-2xl mb-4 text-${color}-700 text-center`}>
                                    {title}
                                </h3>
                                {tasks.filter((task) => task.status === id).length > 0 ? (
                                    tasks
                                        .filter((task) => task.status === id)
                                        .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        className={`p-4 bg-white border-l-4 border-${color}-500 mb-3 rounded-lg  text-black shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md`}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {task.activity}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                ) : (
                                    <p className="text-gray-600 text-center py-4 italic">
                                        No hay tareas, agrega alguna
                                    </p>
                                )}
                                <div className="mt-4 flex justify-center">
                                    <AddTaskButton onAddTask={(taskName) => addTask(taskName, id)} />
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TodoList;
