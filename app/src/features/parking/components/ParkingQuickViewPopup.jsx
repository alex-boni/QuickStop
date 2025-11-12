import React, { useState, useEffect } from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { getParkingById } from '../ParkingService';

const ParkingQuickViewPopup = ({ longitude, latitude, parkingId, onClose }) => {
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parkingId) {
      const fetchParking = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getParkingById(parkingId);
          setParking(data);
        } catch (err) {
          setError('Error al cargar el parking');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchParking();
    }
  }, [parkingId]);

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton={false}
      closeOnClick={true}
      maxWidth="320px"
      className="parking-popup"
    >
      <div className="p-1">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-2">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && parking && (
          <div className="space-y-3">
            <div className="border-b pb-2">
              <h3 className="text-lg font-bold text-gray-900">{parking.name}</h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center truncate">
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{parking.address}</span>
              </p>
            </div>

            {/*Info para el popup*/}
            <div className="grid grid-cols-2 gap-2">
              {/*precioo*/}
              <div className="bg-indigo-50 rounded-lg p-2 text-center">
                <p className="text-xs text-indigo-600 font-medium">Precio</p>
                <p className="text-xl font-bold text-indigo-700">{parking.pricePerHour}€</p>
                <p className="text-xs text-indigo-500">por hora</p>
              </div>

              {/*plazasdispo */}
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-xs text-green-600 font-medium">Disponibles</p>
                <p className="text-xl font-bold text-green-700">{parking.availableSpots}</p>
                <p className="text-xs text-green-500">plazas</p>
              </div>
            </div>

            {/*estado */}
            <div className="flex items-center justify-center">
              {parking.isActive ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Activo ahora
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-red-400 rounded-full"></span>
                  No disponible
                </span>
              )}
            </div>

            {/* Descripción en caso de tenerloa*/}
            {parking.description && (
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-xs text-gray-600 line-clamp-2">{parking.description}</p>
              </div>
            )}

            {/*boton de reservar */}
            <button
              onClick={() => {
                // TODO: Implementar reserva
                alert('Funcionalidad de reserva próximamente');
              }}
              className="w-full bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm"
            >
              Reservar Plaza
            </button>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default ParkingQuickViewPopup;
