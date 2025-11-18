import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGeocodingResults } from "../services/mapService";
const SuggestionItem = ({ place, onClick }) => (
  <li 
    className="px-4 my-2 py-1  hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700 hover:text-indigo-600 
             focus:outline-none focus:bg-gray-100 focus:text-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-lg"
    onClick={() => onClick(place)}
    onKeyDown={(e)=>{
      if (e.key === 'Enter' || e.key === ' ') { 
        console.log("Sugerencia seleccionada (teclado):", place);
        e.preventDefault(); // Evita el comportamiento por defecto del navegador
        onClick(place); // Ejecuta la acción de selección
      }
    }}
    tabIndex={0} // WCAG: Asegura que el elemento de lista sea enfocable
    aria-label={`Seleccionar ${place.place_name_es || place.place_name}`} // WCAG: Etiqueta accesible para lectores de pantalla para cada sugerencia para mejorar la accesibilidad para usuarios con discapacidades visuales para describir la acción de seleccionar la sugerencia  
  >
    {/* Ícono de Pin (o Dirección) */}
    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" ></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
    <span className="truncate">{place.place_name_es || place.place_name}</span>
  </li>
);
const MobileSearchBar = ({ onSearch }) => {
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
  
        fetchGeocodingResults(debouncedQuery).then((results) => {
          console.log("Sugerencias de geocoding:", results);
          setSuggestions(results);
        }).catch((error) => {
          console.error("Error al obtener sugerencias de geocoding:", error);
          setSuggestions([{"id": "error", "place_name": "Error al cargar sugerencias"}]);
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
          latitude: place.center[1]
      });
  
    };
    	const getInputClass = () => {
		return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
	};
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 p-3 bg-white shadow-lg z-40 rounded-xl pb-8 mx-0">
              {/* Lista de Sugerencias (Lista Desplegable) */}
        {( suggestions.length > 0) && (
          <ul className="absolute bottom-full left-0 w-full mb-2 p-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto z-50">
            {suggestions.map((place) => (
              <SuggestionItem 
                key={place.id} 
                place={place} 
                onClick={handleSuggestionClick} 
              />
            ))}
          </ul>
        )}
      <div className="flex items-center space-x-3">
        {/* Ícono de Reloj para historial de búsqueda. No implementado aún */}
        <button           
        className="p-2 bg-indigo-600 text-white rounded-full  hover:bg-indigo-700 transition-colors 
             focus:outline-none focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-700"
          aria-label="Historial de búsquedas">
        <svg
          className="w-8 h-8"
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        </button>

        {/* Barra de Búsqueda */}
        <label htmlFor="search-input-mobile" className="sr-only">Buscar parkings por dirección</label>
        <input
          id="search-input-mobile"
          type="text"
          placeholder="Buscar parking cerca de dirección o punto de interés en Madrid..."
          className={getInputClass()}
          aria-label="Barra de búsqueda de parkings"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        

        {/* Ícono de Ubicación Actual. No implementado aún */}
        <button
          className="p-2 bg-indigo-600 text-white rounded-full  hover:bg-indigo-700 transition-colors 
             focus:outline-none focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-700"
          aria-label="Mi ubicación actual"
        >
          <svg
            className="w-8 h-8"
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
