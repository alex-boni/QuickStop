import React from "react";

const MobileSearchBar = ({ onSearch }) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 p-3 bg-white shadow-lg z-40 rounded-xl pb-8 mx-0">
      <div className="flex items-center space-x-3">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Barra de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar parking cerca de dirección o punto de interés en Madrid..."
          className="w-full p-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Barra de búsqueda de parkings"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(e.target.value);
            }
          }}
        />

        {/* Ícono de Ubicación Actual */}
        <button
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          aria-label="Mi ubicación actual"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileSearchBar;
