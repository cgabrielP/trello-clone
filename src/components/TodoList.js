import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { collection, getDocs, doc, updateDoc, addDoc, query, where } from "firebase/firestore";
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
    }, [userId])

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
        <div className="mt-2 p-6 flex justify-between space-x-4">
          {/* Columna 1: Pendientes */}
          <Droppable droppableId="pending">
            {(provided) => (
              <div
                className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md border-2 border-dashed border-red-500"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-bold text-2xl mb-4 text-red-700 text-center">Pendientes</div>
                {tasks.filter((task) => task.status === "pending").length > 0 ? (
                  <>
                    {tasks
                      .filter((task) => task.status === "pending")
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="todo-item text-black p-4 bg-white border-l-4 border-red-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.activity}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-4 italic">No hay tareas, agrega alguna</p>
                )}
                <div className="mt-4 flex justify-center">
                  <AddTaskButton onAddTask={(taskName) => addTask(taskName, "pending")} status="pending" />
                </div>
              </div>
            )}
          </Droppable>
      
          {/* Columna 2: En Progreso */}
          <Droppable droppableId="in-progress">
            {(provided) => (
              <div
                className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md border-2 border-dashed border-yellow-500"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-bold text-2xl mb-4 text-yellow-700 text-center">En Progreso</div>
                {tasks.filter((task) => task.status === "in-progress").length > 0 ? (
                  <>
                    {tasks
                      .filter((task) => task.status === "in-progress")
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="todo-item text-black p-4 bg-white border-l-4 border-yellow-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.activity}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-4 italic">No hay tareas, agrega alguna</p>
                )}
                <div className="mt-4 flex justify-center">
                  <AddTaskButton onAddTask={(taskName) => addTask(taskName, "in-progress")} status="in-progress" />
                </div>
              </div>
            )}
          </Droppable>
      
          {/* Columna 3: Completadas */}
          <Droppable droppableId="done">
            {(provided) => (
              <div
                className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md border-2 border-dashed border-green-500"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="font-bold text-2xl mb-4 text-green-700 text-center">Completadas</div>
                {tasks.filter((task) => task.status === "done").length > 0 ? (
                  <>
                    {tasks
                      .filter((task) => task.status === "done")
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              className="todo-item text-black p-4 bg-white border-l-4 border-green-500 mb-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {task.activity}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </>
                ) : (
                  <p className="text-gray-600 text-center py-4 italic">No hay tareas, agrega alguna</p>
                )}
                <div className="mt-4 flex justify-center">
                  <AddTaskButton onAddTask={(taskName) => addTask(taskName, "done")} status="done" />
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      
    );
};

export default TodoList;
