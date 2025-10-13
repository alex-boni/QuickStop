// app/src/features/auth/components/RegisterForm.jsx
import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Simulación de validación de error (para futura implementación ARIA)
  const isPasswordInvalid = false; // Aquí iría la lógica de validación

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Intento de Registro:', formData);
    // Lógica real: Llamar al servicio de registro (features/auth/services/authService.js)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. Campo Nombre Completo */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name" // EAA / WCAG 1.3.5: Clave para autocompletado
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Ej: Laura Sánchez"
        />
      </div>

      {/* 2. Campo Correo Electrónico */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email" // EAA / WCAG 1.3.5
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="tu.correo@ejemplo.com"
        />
      </div>

      {/* 3. Campo Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password" // EAA / WCAG 1.3.5
          aria-invalid={isPasswordInvalid ? "true" : "false"} // WCAG 4.1.3: Indica si el valor es inválido
          className={`w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            isPasswordInvalid ? 'border-red-500 ring-red-500' : 'border-gray-300'
          }`}
          placeholder="Mínimo 8 caracteres, seguro"
        />
      </div>
      
      {/* 4. Campo Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password" // EAA / WCAG 1.3.5
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="Repite la contraseña"
        />
      </div>

      {/* 5. Botón de Registro */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 
                   transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
        aria-label="Crear una cuenta nueva en QuickStop ParkIT" // WCAG: Describe la acción del botón para lectores de pantalla
      >
        Crear Cuenta
      </button>

      {/* 6. Enlace a Login */}
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta? <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Iniciar Sesión</a>
      </p>
    </form>
  );
};

export default RegisterForm;