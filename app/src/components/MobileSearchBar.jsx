import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { fetchGeocodingResults } from "../services/mapService";
const SuggestionItem = ({ place, onClick }) => (
  <li
    className="px-4 my-2 py-1  hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700 hover:text-indigo-600 
             focus:outline-none focus:bg-gray-100 focus:text-indigo-600 focus:ring-2 focus:ring-indigo-500 rounded-lg"
    onClick={() => onClick(place)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        console.log("Sugerencia seleccionada (teclado):", place);
        e.preventDefault(); // Evita el comportamiento por defecto del navegador
        onClick(place); // Ejecuta la acción de selección
      }
    }}
    tabIndex={0} // WCAG: Asegura que el elemento de lista sea enfocable
    aria-label={`Seleccionar ${place.place_name_es || place.place_name}`} // WCAG: Etiqueta accesible para lectores de pantalla para cada sugerencia para mejorar la accesibilidad para usuarios con discapacidades visuales para describir la acción de seleccionar la sugerencia
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
const MobileSearchBar = ({ onSearch, onGeolocate }) => {
  // Estados
  const [query, setQuery] = useState(""); // Texto visible en el input
  const [suggestions, setSuggestions] = useState([]); // Resultados del autocompletado
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const navigate = useNavigate();

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
        setSuggestions([
          { id: "error", place_name: "Error al cargar sugerencias" },
        ]);
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
  // Icono lista (Driver)
  const DriverIcon = () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  );

  // Icono coche (Owner)
  const OwnerIcon = () => (
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1v2.9c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );

  const handleQuickAction = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "OWNER") {
      navigate("/my-parkings"); // Ruta para dueños
    } else {
      navigate("/my-reservations"); // Ruta para conductores
    }
  };

  const getInputClass = () => {
    return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
  };
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 p-3 bg-white shadow-lg z-40 rounded-xl pb-8 mx-0">
      {/* Lista de Sugerencias (Lista Desplegable) */}
      {suggestions.length > 0 && (
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
        {/* Ícono de Parkings o Reservas */}
        <button
          onClick={handleQuickAction}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700"
          title={user?.role === "OWNER" ? "Mis Parkings" : "Mis Reservas"}
          aria-label={
            user?.role === "OWNER" ? "Ir a mis parkings" : "Ir a mis reservas"
          }
        >
          {user?.role === "OWNER" ? <OwnerIcon /> : <DriverIcon />}
        </button>

        {/* Barra de Búsqueda */}
        <label htmlFor="search-input-mobile" className="sr-only">
          Buscar parkings por dirección
        </label>
        <input
          id="search-input-mobile"
          type="text"
          placeholder="¿Dónde quieres aparcar?"
          className={getInputClass()}
          aria-label="Barra de búsqueda de parkings"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Ícono de Ubicación Actual*/}
        <button
          onClick={onGeolocate}
          className="p-2 bg-indigo-600 text-white rounded-full  hover:bg-indigo-700 transition-colors 
             focus:outline-none focus:bg-indigo-700 focus:ring-2 focus:ring-indigo-700"
          aria-label="Mi ubicación actual"
          title="Ir a mi ubicación actual"
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
