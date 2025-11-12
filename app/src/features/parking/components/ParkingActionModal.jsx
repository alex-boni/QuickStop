import React from 'react';

const ParkingActionModal = ({ isOpen, onClose, onView, onEdit, onDelete, parkingName }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {parkingName}
        </h2>
        <p className="text-gray-600 mb-6">
          ¿Qué deseas hacer con este parking?
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onView}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver Detalles
          </button>
          
          <button
            onClick={onEdit}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Editar Parking
          </button>

          <button
            onClick={onDelete}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar Parking
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingActionModal;
