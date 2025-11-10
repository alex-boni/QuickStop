import React from 'react';
import { Link } from 'react-router-dom';

const TopNav = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50">
      
      {/* Logo/Marca */}
      <div className="text-xl font-extrabold text-indigo-700 tracking-tight">
        QuickStop
      </div>
      
      {/* Enlaces de Navegación */}
      <div className="flex items-center space-x-6">
        
        {/* Enlace Home/Mapa */}
        <Link 
          to="/" 
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Mapa
        </Link>
        
        {/* Enlace Cuenta */}
        <Link 
          to="/account" 
          className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
        >
          Perfil
        </Link>
        
        {/* Enlaces de Autenticación (Botones) */}
        <Link 
          to="/register" 
          className="px-4 py-2 text-sm font-semibold rounded-lg text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          Registrarse
        </Link>
        
        <Link 
          to="/login" 
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Iniciar Sesión
        </Link>
        
      </div>
    </nav>
  );
};

export default TopNav;