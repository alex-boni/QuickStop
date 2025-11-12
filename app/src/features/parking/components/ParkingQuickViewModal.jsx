import React, { useState, useEffect } from 'react';
import { getParkingById } from '../ParkingService';

const ParkingQuickViewModal = ({ isOpen, onClose, parkingId }) => {
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && parkingId) {
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
  }, [isOpen, parkingId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-5 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        )}

        {!loading && !error && parking && (
          <div className="space-y-4">
            {/* Título */}
            <div className="border-b pb-3">
              <h3 className="text-xl font-bold text-gray-900">{parking.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {parking.address}
              </p>
            </div>

            {/* Info principal en cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Precio */}
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <p className="text-xs text-indigo-600 font-medium mb-1">Precio</p>
                <p className="text-2xl font-bold text-indigo-700">{parking.pricePerHour}€</p>
                <p className="text-xs text-indigo-500">por hora</p>
              </div>

              {/* Plazas disponibles */}
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xs text-green-600 font-medium mb-1">Disponibles</p>
                <p className="text-2xl font-bold text-green-700">{parking.availableSpots}</p>
                <p className="text-xs text-green-500">plazas libres</p>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-center py-2">
              {parking.isActive ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 mr-2 bg-green-400 rounded-full animate-pulse"></span>
                  Activo ahora
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 mr-2 bg-red-400 rounded-full"></span>
                  No disponible
                </span>
              )}
            </div>

            {/* Descripción (si existe) */}
            {parking.description && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 line-clamp-2">{parking.description}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  // TODO: Implementar reserva
                  alert('Funcionalidad de reserva próximamente');
                }}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
              >
                Reservar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingQuickViewModal;
