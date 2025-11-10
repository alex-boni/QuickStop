import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGeocodingResults } from "../services/mapService";

const SuggestionItem = ({ place, onClick }) => (
  <li
    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
    onClick={() => onClick(place)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        console.log("Sugerencia seleccionada (teclado):", place);
        e.preventDefault(); // Evita el comportamiento por defecto del navegador
        onClick(place); // Ejecuta la acción de selección
      }
    }}
    tabIndex={0} // WCAG: Asegura que el elemento de lista sea enfocable
    aria-label={`Seleccionar ${place.place_name_es || place.place_name}`}
  >
    {/* Ícono de Pin (o Dirección) */}
    <svg
      className="w-5 h-5 text-indigo-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
    </svg>
    <span className="truncate">{place.place_name_es || place.place_name}</span>
  </li>
);

const DesktopSearchBar = ({ onSearch }) => {
  // Estados
  const [query, setQuery] = useState(""); // Texto visible en el input
  const [suggestions, setSuggestions] = useState([]); // Resultados del autocompletado

  // Aplicar Debounce al texto de entrada (300ms de pausa)
  const debouncedQuery = useDebounce(query, 300);

  // Efecto para llamar a la API cuando el texto debounced cambia
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    fetchGeocodingResults(debouncedQuery)
      .then((results) => {
        console.log("Sugerencias de geocoding:", results);
        setSuggestions(results);
      })
      .catch((error) => {
        console.error("Error al obtener sugerencias de geocoding:", error);
      });
  }, [debouncedQuery]);

  // Manejar la selección de una sugerencia
  const handleSuggestionClick = (place) => {
    setQuery("");
    setSuggestions([]);
    // console.log("Sugerencia seleccionada:", place);
    onSearch({
      name: place.place_name_es || place.place_name,
      longitude: place.center[0],
      latitude: place.center[1],
    });
  };
  const getInputClass = () => {
    return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
  };

  return (
    <div className="hidden md:flex fixed top-4 inset-x-0 mx-auto max-w-2xl z-20 p-4">
      <div className="relative w-full">
        {/* Barra de Búsqueda Flotante */}
        <div
          className="flex items-center w-full bg-white p-3 rounded-xl 
                     shadow-2xl border border-gray-200 transition duration-300 
                     hover:shadow-3xl"
          role="search"
        >
          {/* Ícono de Lupa */}
          <svg
            className="w-8 h-8 text-indigo-500 flex-shrink-0 mx-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Campo de Búsqueda */}
          <label htmlFor="search-input-desktop" className="sr-only">
            Buscar parkings por dirección
          </label>
          <input
            id="search-input-desktop"
            type="text"
            placeholder={
              "Buscar parking cerca de dirección o punto de interés..."
            }
            className={getInputClass()}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Botón de Acción/Ubicación (al hacer clic, solo se busca el texto actual) */}
          <button
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-3 focus:ring-indigo-300 disabled:opacity-50"
            aria-label="Ejecutar búsqueda de parkings"
            onClick={() => onSearch({ query: query })}
          >
            Buscar
          </button>
        </div>

        {/* Lista de Sugerencias (Lista Desplegable) */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto z-30">
            {suggestions.map((place) => (
              <SuggestionItem
                key={place.id}
                place={place}
                onClick={handleSuggestionClick}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DesktopSearchBar;
