import { useState } from "react";

const AddTaskButton = ({ onAddTask }) => {
    const [showModal, setShowModal] = useState(false);
    const [taskName, setTaskName] = useState("");

    const handleAddClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTaskName("");  // Limpiar el campo cuando se cierra el modal
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            onAddTask(taskName);  // Llama a la función para agregar la tarea
            handleCloseModal();  // Cerrar el modal
        }
    };

    return (
        <div className="text-center mt-4">
            <button
                onClick={handleAddClick}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
                ¡Agregar tarea!
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-xl font-semibold mb-4 text-center">Nueva Tarea</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nombre de la tarea"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-200"
                                >
                                    Agregar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTaskButton;
