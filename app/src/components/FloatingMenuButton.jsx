import React from "react";

const FloatingMenuButton = ({ onToggle }) => {
  return (
    <div className="flex fixed top-6 right-6 z-40">
      <button
        onClick={onToggle}
        className="p-6 md:p-4 md:mt-3 md:mr-2 bg-white rounded-full shadow-xl 
                   text-indigo-600 hover:bg-gray-100 transition-colors 
                   focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Mostrar menú lateral y perfil de usuario"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z"
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingMenuButton;
