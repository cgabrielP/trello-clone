import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { auth } from "@/lib/firebaseConfig";
import Board from "./Board";

const Dashboard = ({ user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white p-6 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64`}
      >
        <h2 className="text-2xl font-semibold mb-6 pt-16">Panel</h2>
        <ul>
          {[
            { label: "Inicio", link: "#" },
            { label: "Perfil", link: "#" },
            { label: "Configuración", link: "#" },
          ].map((item) => (
            <li key={item.label} className="mb-4">
              <a href={item.link} className="hover:text-gray-400">{item.label}</a>
            </li>
          ))}
          <li className="mb-4">
            <button
              className="hover:text-gray-400"
              onClick={() => auth.signOut()}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

    

      {/* Toggle Button */}
      <button
        className="lg:hidden p-4 text-white fixed top-4 left-4 z-50 bg-gray-800 rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenido, {user?.name}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Aquí puedes gestionar tus configuraciones y actividad reciente.
        </p>
        <Board userId={user.uid} />
      </div>
    </div>
  );
};

export default Dashboard;
