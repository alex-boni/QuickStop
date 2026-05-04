import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Popup } from "react-map-gl/mapbox";
import { getParkingById } from "../ParkingService";
import { getNextAvailable } from "../../reservation/ReservationService";

const ParkingQuickViewPopup = ({
  longitude,
  latitude,
  parkingIds,
  onClose,
}) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = parkingIds?.length || 0;
  const currentParkingId = parkingIds[currentIndex];

  const [parking, setParking] = useState(null);
  const [nextAvailable, setNextAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigation = (path) => {
    navigate(path, { state: { suggestedDate: nextAvailable } });
  };

  const handleNext = (e) => {
    e.stopPropagation(); // Evita cerrar el popup al navegar el carrusel
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); // Evita cerrar el popup al navegar el carrusel
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (currentParkingId) {
      const fetchParking = async () => {
        try {
          setLoading(true);
          setError(null);
          setNextAvailable(null);
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

  useEffect(() => {
    if (parking && parking.availableSpots === 0) {
      const fetchNextSlot = async () => {
        try {
          const nextSlot = await getNextAvailable(currentParkingId);
          setNextAvailable(new Date(nextSlot));
        } catch (err) {
          console.error("No se pudo obtener sugerencia", err);
        }
      };
      fetchNextSlot();
    }
  }, [parking, currentParkingId]);

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton={false} // Desactiva el botón de cierre por defecto para usar uno personalizado
      closeOnClick={true}  // Permite cerrar al hacer click fuera del popup
      maxWidth="320px"
      className="rounded-2xl overflow-hidden"
    >
      {/* Contenedor principal con stopPropagation para que clics internos no cierren el popup */}
      <div 
        className="p-1 pb-0 relative min-w-[240px]" 
        onClick={(e) => e.stopPropagation()} 
      >
        {/* BOTÓN DE CIERRE */}
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 z-50 p-2 bg-white rounded-full border border-gray-400 shadow-lg text-gray-600 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-colors"
          aria-label="Cerrar vista rápida"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Controles del Carrusel */}
        {total > 1 && (
          <div className="absolute inset-x-0 -bottom-8 -translate-y-1/2 flex justify-between px-4 z-10 pointer-events-none">
            <button
              onClick={handlePrev}
              className="pointer-events-auto bg-white/90 text-indigo-600 p-4 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto bg-white/90 text-indigo-600 p-4 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
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
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-gray-300 pb-2 pr-6"> {/* Espacio extra a la derecha para la X */}
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {parking.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{parking.address}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-indigo-50 rounded-lg p-2 text-center">
                <p className="text-sm text-indigo-600 font-bold">Precio</p>
                <p className="text-lg font-bold text-indigo-700">{parking.pricePerHour}€</p>
                <p className="text-sm text-indigo-500">por hora</p>
              </div>

              <div className={`rounded-lg p-2 text-center ${parking.availableSpots > 0 ? "bg-green-50" : "bg-red-50"}`}>
                <p className={`text-sm font-bold ${parking.availableSpots > 0 ? "text-green-600" : "text-red-600"}`}>
                  {parking.availableSpots > 0 ? "Disponibles" : "Lleno"}
                </p>
                <p className={`text-lg font-bold ${parking.availableSpots > 0 ? "text-green-700" : "text-red-700"}`}>
                  {parking.availableSpots}
                </p>
                <p className={`text-sm ${parking.availableSpots > 0 ? "text-green-500" : "text-red-500"}`}>plazas</p>
              </div>
            </div>

            {parking.availableSpots === 0 && nextAvailable && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 animate-pulse">
                <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-tight">Próxima plaza:</p>
                <p className="text-xs text-yellow-800">
                  {nextAvailable.toLocaleDateString()} - {nextAvailable.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}

            <button
              onClick={() => handleNavigation(`/reservation/${parking.id}`)}
              className={`w-full text-white py-2.5 px-4 rounded-xl transition-all font-bold text-lg shadow-md active:scale-95
                ${parking.availableSpots > 0 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
            >
              {parking.availableSpots > 0 ? "Reservar ahora" : "Reservar otro día"}
            </button>

            {total > 1 && (
              <div className="flex flex-col items-center gap-1.5 pt-1 mt-2.5">
                <div className="flex justify-center gap-1.5">
                  {parkingIds.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-indigo-600" : "w-1.5 bg-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-[14px] font-black text-indigo-600 text-center">
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

export default ParkingQuickViewPopup;