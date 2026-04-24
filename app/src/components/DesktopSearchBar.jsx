import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGeocodingResults } from "../services/mapService";

const SuggestionItem = ({ place, onClick }) => {
 if (place.id === "empty") {
    return (
      <li
        className="px-4 py-2 text-yellow-600 bg-yellow-50 flex items-center gap-3 rounded-lg "
        tabIndex={-1}
        aria-live="assertive"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">{place.place_name}</span>
      </li>
    );
  }
  else if (place.id === "error") {
    return (
      <li
        className="px-4 py-2 text-red-600 bg-red-50 flex items-center gap-3 rounded-lg "
        tabIndex={-1}
        aria-live="assertive"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">{place.place_name}</span>
      </li>
    );
  }

  return (
    <li
      className="px-4 my-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700 hover:text-indigo-600 
                 focus:outline-none focus:bg-gray-100 focus:text-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-lg"
      onClick={() => onClick(place)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(place);
        }
      }}
      tabIndex={0}
      aria-label={`Seleccionar ${place.place_name_es || place.place_name}`}
    >
      <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="truncate">{place.place_name_es || place.place_name}</span>
    </li>
  );
};
const DesktopSearchBar = ({ onSearch }) => {
  // Estados
  const [query, setQuery] = useState(""); // Texto visible en el input
  const [suggestions, setSuggestions] = useState([]); // Resultados del autocompletado
  const [isErrorActive, setIsErrorActive] = useState(false); // Control de error para búsqueda manual

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
        setIsErrorActive(true);
        setSuggestions([{"id": "error", "place_name": "Error al cargar sugerencias"}]);
        setTimeout(() => {
          setSuggestions([]);
          setIsErrorActive(false);
        }, 3500);
      });
  }, [debouncedQuery]);

  // Manejar la selección de una sugerencia
  const handleSuggestionClick = (place) => {
    setQuery("");
    setSuggestions([]);
    if (place.id === "empty" || place.id === "error") return;
    // console.log("Sugerencia seleccionada:", place);
    onSearch({
      name: place.place_name_es || place.place_name,
      longitude: place.center[0],
      latitude: place.center[1],
    });
  };

  // Función para manejar el clic en "Buscar"
  const handleManualSearch = () => {
    if (!query.trim()) {
      setIsErrorActive(true);
      // Ocultar el error automáticamente después de 3 segundos
        setSuggestions([{"id": "empty", "place_name": "Por favor, introduce una ubicación para buscar."}]);
        setTimeout(() => {
        setSuggestions([]);
        setIsErrorActive(false);
      }, 3500);
      return;
    }
    const firstValidSuggestion = suggestions.find(s => s.id !== "error" && s.id !== "empty");

    if (firstValidSuggestion) {
      handleSuggestionClick(firstValidSuggestion);
    } else {
      // Si no hay sugerencias cargadas aún pero hay texto, 
      // enviamos la query de texto plano como fallback
      setIsErrorActive(false);
      onSearch({ query: query.trim() });
      setSuggestions([]);
    }
  };

  return (
    <div className="hidden md:flex fixed top-4 inset-x-0 mx-auto max-w-2xl z-20 p-4">
      <div className="relative w-full">
        {/* Barra de Búsqueda Flotante */}
        <div
          className="flex items-center w-full bg-white px-2 py-1 rounded-xl 
                     shadow-2xl border border-gray-200 transition duration-300 
                     hover:shadow-3xl"
          role="search"
        >


          {/* Campo de Búsqueda */}
          <label htmlFor="search-input-desktop" className="sr-only">
            Introducir dirección para localizar aparcamiento
          </label>
          <input
            id="search-input-desktop"
            type="text"
            placeholder={
              "Introduce calle, ciudad o código postal para buscar aparcamientos..."
            }
            className="3 border-none focus:outline-none text-gray-700"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (isErrorActive) setIsErrorActive(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
          />

          {/* Botón de Acción/Ubicación (al hacer clic, solo se busca el texto actual) */}
          <button
            className="flex p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-3 focus:ring-indigo-500 disabled:opacity-50 focus:outline-none focus:bg-indigo-600 focus:ring-2"
            title="Buscar parkings en esta ubicación"
            aria-label="Ejecutar búsqueda de parkings"
            onClick={handleManualSearch}
          >
          {/* Ícono de Lupa */}
          <svg
            className="w-5 h-5 mr-1 mt-0.5"
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
            Buscar
          </button>
        </div>

        {/* Lista de Sugerencias (Lista Desplegable) */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-2 px-1  bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto z-30">
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
