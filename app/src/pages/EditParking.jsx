import React from 'react';
import { useNavigate } from 'react-router-dom';
import EditParkingForm from "../features/parking/components/EditParkingForm";

export default function EditParking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-parkings')}
            className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mis aparcamientos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Editar Aparcamiento</h1>
          <p className="text-gray-600 mt-2">Actualiza la información de tu aparcamiento</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <EditParkingForm />
        </div>
      </div>
    </div>
  );
}
