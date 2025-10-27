import React from "react";

const DesktopSearchBar = ({ onSearch }) => {
  return (
    <div className="hidden md:flex fixed top-4 inset-x-0 mx-auto max-w-2xl z-20 p-4">
      <div
        className="flex items-center w-full bg-white p-3 rounded-xl 
                   shadow-2xl border border-gray-200 
                   transition duration-300 hover:shadow-3xl"
        role="search" // WCAG: Rol para indicar que es una barra de búsqueda
      >
        {/* Ícono de Lupa (Buscar) */}
        <svg
          className="w-6 h-6 text-indigo-500 flex-shrink-0 mx-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Campo de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar parking cerca de dirección o punto de interés en Madrid..."
          className="w-full text-lg focus:outline-none placeholder-gray-500 py-1"
          aria-label="Buscar parkings por dirección" // WCAG: Descripción para lectores de pantalla
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(e.target.value);
            }
          }}
        />

        {/* Botón de Acción/Ubicación */}
        <button
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Ejecutar búsqueda o ir a mi ubicación"
          onClick={() => onSearch(/* Lógica de búsqueda */)}
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default DesktopSearchBar;
