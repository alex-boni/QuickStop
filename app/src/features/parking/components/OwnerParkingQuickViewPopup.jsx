import React, { useState, useEffect } from "react";
import { Popup } from "react-map-gl/mapbox";
import { getParkingById } from "../ParkingService";

const OwnerParkingQuickViewPopup = ({
  longitude,
  latitude,
  parkingIds,
  onClose,
  onView, // Acción: Ver Detalles
  onEdit, // Acción: Editar
  onDelete, // Acción: Eliminar
  onReactivate, // Acción: Reactivar
}) => {
  // Estados para el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = parkingIds?.length || 0;
  const currentParkingId = parkingIds[currentIndex];

  // Estados para los datos del parking actual
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos cada vez que cambiamos de parking en el carrusel
  useEffect(() => {
    if (currentParkingId) {
      const fetchParking = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getParkingById(currentParkingId);
          setParking(data);
        } catch (err) {
          setError("Error al cargar el aparcamiento");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchParking();
    }
  }, [currentParkingId]);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };
  const getStatusBadge = (status) => {
    if (status === true) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Disponible
        </span>
      );
    } else if (status === false) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-red-400 rounded-full"></span>
          Inactivo
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 md:mt-0 rounded-full text-xs font-bold  bg-gray-100 text-gray-800">
          Desconocido
        </span>
      );
    }
  };

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      closeOnClick={true}
      maxWidth="320px"
      className="rounded-2xl overflow-hidden"
    >
      {/* Contenedor principal con stopPropagation para proteger los clics internos */}
      <div
        className="p-1 pb-0 relative min-w-[240px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN DE CIERRE (X) personalizado */}
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 z-50 p-2 bg-white rounded-full border border-gray-400 shadow-lg text-gray-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-colors"
          aria-label="Cerrar gestión"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Controles del Carrusel (Solo si hay varios parkings) */}
        {total > 1 && (
          <div className="absolute inset-x-0 -bottom-8 -translate-y-1/2 flex justify-between px-4 z-10 pointer-events-none">
            <button
              onClick={handlePrev}
              aria-label="Aparcamiento anterior"
              className="pointer-events-auto bg-white/90 text-indigo-600 p-4 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Siguiente aparcamiento"
              className="pointer-events-auto bg-white/90 text-indigo-600 p-4 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && parking && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Título y Estado */}
            <div className="border-b border-gray-200 pb-2 pr-6">
              <div className="flex items-center gap-2 mr-4">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {parking.name}
                </h2>
                {getStatusBadge(parking.isActive)}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  className="w-4 h-4 my-1 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {parking.address}
              </p>
            </div>

            {/* Acciones de Gestión */}
            <div className="space-y-2">
              {parking.isActive ? (
                <button
                  onClick={() => onView(currentParkingId)}
                  className="w-full py-2.5 px-4 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Ver Detalles
                </button>
              ) : (
                <button
                  onClick={() => onReactivate(currentParkingId, parking.name)}
                  className="w-full py-2.5 px-4 bg-yellow-500 text-white text-sm font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-sm"
                >
                  Reactivar
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(currentParkingId)}
                  className="flex-1 py-2 px-4 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Editar
                </button>

                <button
                  onClick={() => onDelete(currentParkingId, parking.name)}
                  className="flex-1 py-2 px-4 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Indicadores de Carrusel (Dots y contador) */}
            {total > 1 && (
              <div className="flex flex-col items-center gap-1.5 pt-1 pb-1">
                <div className="flex justify-center gap-1.5">
                  {parkingIds.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? "w-4 bg-indigo-600"
                          : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[12px] font-black text-indigo-600">
                  {currentIndex + 1} de {total}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Popup>
  );
};

export default OwnerParkingQuickViewPopup;
