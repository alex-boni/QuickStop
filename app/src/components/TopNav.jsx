import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopNav = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50">
      <Link
        to="/"
        className="text-xl font-extrabold text-indigo-600 tracking-tight hover:text-indigo-700 
             focus:outline-none focus:bg-gray-100 focus:text-indigo-700 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2"
      >
        QuickStop
      </Link>

      {/* Enlaces de Navegación */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="font-semibold transition-colors text-gray-700 hover:text-indigo-600 
             focus:outline-none focus:bg-gray-100 focus:text-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2"
        >
          Mapa
        </Link>

        {isAuthenticated && (
          <Link
            to="/account"
            className=" font-semibold transition-colors text-gray-700 hover:text-indigo-600 
             focus:outline-none focus:bg-gray-100 focus:text-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-lg p-2"
          >
            Perfil
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        )}

        {!isAuthenticated && (
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-indigo-600 border border-indigo-600 hover:bg-indigo-100 transition-colors focus:text-indigo-700 focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500"
          >
            Registrarse
          </Link>
        )}

        {!isAuthenticated && (
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors 
             focus:outline-none focus:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 "
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
