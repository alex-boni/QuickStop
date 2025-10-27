import React from "react";

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 p-6 
                    transition-transform duration-300 ease-in-out transform
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h3 className="text-xl font-bold mb-6 text-indigo-700">
          Menú QuickStop
        </h3>

        <nav className="space-y-4">
          <a
            href="/profile"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Mi Perfil
          </a>
          <a
            href="/reservations"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Mis Reservas
          </a>
          <a
            href="/settings"
            className="block text-gray-700 hover:text-indigo-600"
          >
            Configuración
          </a>
        </nav>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
          aria-label="Cerrar menú lateral"
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default SideMenu;
