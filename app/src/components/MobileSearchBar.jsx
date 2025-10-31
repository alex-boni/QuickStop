import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGeocodingResults } from "../services/mapService";
const SuggestionItem = ({ place, onClick }) => (
  <li 
    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
    onClick={() => onClick(place)}
    tabIndex={0} // WCAG: Asegura que el elemento de lista sea enfocable
    aria-label={`Seleccionar ${place.place_name_es || place.place_name}`}
  >
    {/* Ícono de Pin (o Dirección) */}
    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 p-3 bg-white shadow-lg z-40 rounded-xl pb-8 mx-0">
              {/* Lista de Sugerencias (Lista Desplegable) */}
        {( suggestions.length > 0) && (
          <ul className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto z-50">
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
