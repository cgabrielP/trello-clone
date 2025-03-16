import { auth } from "@/lib/firebaseConfig";
import Board from "./Board";

const Dashboard = ({user}) => {
    
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 flex-none text-white p-6">
                <h2 className="text-2xl font-semibold mb-6">Panel </h2>
                <ul>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-400">Inicio</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-400">Perfil</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-400">Configuración</a>
                    </li>
                    <li className="mb-4">
                        <a href="#" className="hover:text-gray-400" onClick={()=>auth.signOut()}>Cerrar sesion</a>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido, {user?.name}!</h1>
                <p className="text-lg text-gray-600 mb-6">Aquí puedes gestionar tus configuraciones, ver tu actividad reciente y mucho más.</p>

                <Board userId={user.uid}/>
            </div>
        </div>
    );
};

export default Dashboard;

