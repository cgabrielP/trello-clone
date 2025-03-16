import { useState } from "react";
import { Plus } from "lucide-react"; // Ícono minimalista

const AddTaskButton = ({ onAddTask }) => {
    const [showModal, setShowModal] = useState(false);
    const [taskName, setTaskName] = useState("");

    const handleAddClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTaskName("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskName.trim()) {
            onAddTask(taskName);
            handleCloseModal();
        }
    };

    return (
        <div className="text-center mt-4">
            {/* Botón minimalista con solo un ícono */}
            <button
                onClick={handleAddClick}
                className="p-2 rounded-full transition-transform duration-200 hover:scale-110"
            >
                <Plus size={24} className="text-gray-700 hover:text-black" />
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-95 animate-fadeIn">
                        <h2 className="text-xl text-gray-800 font-semibold mb-4 text-center">Nueva Tarea</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nombre de la tarea"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full p-3 border border-gray-300 text-gray-900 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-red-500 transition duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
                                >
                                    Agregar
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
