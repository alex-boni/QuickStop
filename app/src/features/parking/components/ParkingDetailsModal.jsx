import React, { useState, useEffect } from 'react';
import { getParkingById } from '../ParkingService';

const ParkingDetailsModal = ({ isOpen, onClose, parkingId }) => {
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
          setError('Error al cargar los detalles del parking');
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
        className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalles...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-4 text-red-600">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        )}

        {!loading && !error && parking && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Detalles del Parking
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                {parking.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                {parking.address}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plazas disponibles
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {parking.availableSpots}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (€/hora)
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {parking.pricePerHour}€
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[80px]">
                {parking.description || 'Sin descripción'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitud
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {parking.latitude}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud
                </label>
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                  {parking.longitude}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                {parking.isActive ? '✅ Activo' : '❌ Inactivo'}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingDetailsModal;
