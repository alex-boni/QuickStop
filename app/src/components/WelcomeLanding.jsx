import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeLanding({ onGuest }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div 
        className="bg-white/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border border-white/20"
        role="dialog" 
        aria-labelledby="welcome-title"
      >
        <h2 id="welcome-title" className="text-3xl font-bold text-indigo-600 mb-2">
          QuickStop
        </h2>
        <p className="text-gray-600 mb-8">
          Encuentra o gestiona plazas de aparcamiento de forma accesible y sencilla.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Iniciar Sesión
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Crear una cuenta
          </button>

          <button
            onClick={onGuest}
            className="mt-2  text-gray-500 hover:text-indigo-600 underline underline-offset-4"
          >
            Explorar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
}