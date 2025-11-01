/*
  Este componente muestra un formulario (no modificable) para ver los detalles de la cuenta del usuario.
  Incluye campos para el nombre y correo electrónico.
*/
import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function ViewAccountDetailsForm() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Por favor, inicia sesión para ver tus detalles de cuenta.</p>
      </div>
    );
  }

  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name || ''}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email || ''}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <input
          type="text"
          id="role"
          name="role"
          value={user.role === 'DRIVER' ? 'Conductor' : user.role === 'OWNER' ? 'Propietario' : ''}
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>
    </form>
  );
}
