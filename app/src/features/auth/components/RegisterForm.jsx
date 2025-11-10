import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../AuthService';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DRIVER',
    termsAccepted: false,
  });

  // Nuevo estado para almacenar mensajes de error por campo
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
    // Limpiar el error cuando el usuario empieza a escribir en el campo
    if (errors[id]) {
        setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleRoleChange = (newRole) => {
    setFormData({ ...formData, role: newRole });
  };
  
  // Función de validación del lado del cliente
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // 1. Validación de Nombre (mín. 4 caracteres)
    if (formData.name.length < 4) {
      newErrors.name = "El nombre debe tener al menos 4 caracteres.";
      isValid = false;
    }
    
    // 2. Validación de Email (Formato básico y no vacío. La verificación de 'no registrado' es de la API)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        newErrors.email = "Introduce un correo electrónico válido.";
        isValid = false;
    }
    
    // 3. Validación de Contraseña (mín. 8 caracteres)
    if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
        isValid = false;
    }

    // 4. Validación de Confirmación de Contraseña
    if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
        isValid = false;
    }

    // 5. Validación de Términos
    if (!formData.termsAccepted) {
        newErrors.termsAccepted = "Debes aceptar los Términos y Condiciones.";
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Enfocar al primer campo con error (WCAG)
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) { document.getElementById(firstErrorField)?.focus(); }
      return;
    }
    try {
      await registerUser(formData);
      navigate('/login'); // Redirige a login tras registro exitoso
    } catch (error) {
      if (error.message === 'EmailAlreadyExists') {
        setErrors({ 
            email: 'Este correo electrónico ya está registrado. Por favor, inicia sesión.',
        });
        document.getElementById('email')?.focus();
      } else {
        // Otros errores no manejados (ej. 500 interno)
        setErrors({ 
            global: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.'
        });
      } 
    }finally {
        setIsLoading(false);
    }
  };

  // Clase común para inputs (usando errores para el estilo)
  const getInputClass = (field) => {
    return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 
            ${errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
  };

  const isDriver = formData.role === 'DRIVER';

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      
      {/* ---------------------------------------------------- */}
      {/* 1. Campos de Formulario (con Feedback de Error y ARIA) */}
      {/* ---------------------------------------------------- */}

      {/* Campo Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input
          id="name"
          type="text"
          value={formData.name} // Mantiene el valor ingresado
          onChange={handleChange}
          required
          autoComplete="name"
          className={getInputClass('name')}
          placeholder="Ej: Laura Sánchez (mín. 4 caracteres)"
          aria-invalid={!!errors.name} // WCAG: Indica si el campo tiene un error
          aria-describedby={errors.name ? 'name-error' : undefined} // WCAG: Vincula el campo al mensaje de error
          disabled={isLoading} // Deshabilita el campo si está cargando
        />
        {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.name}</p>}
      </div>

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className={getInputClass('email')}
          placeholder="tu.correo@ejemplo.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isLoading}
        />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.email}</p>}
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          className={getInputClass('password')}
          placeholder="Mínimo 8 caracteres"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          disabled={isLoading}
        />
        {errors.password && <p id="password-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.password}</p>}
      </div>
      
      {/* Campo Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          className={getInputClass('confirmPassword')}
          placeholder="Repite la contraseña"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          disabled={isLoading}
        />
        {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.confirmPassword}</p>}
      </div>
      
      {/* ---------------------------------------------------- */}
      {/* 2. Selector de Rol y Términos (sin cambios en estilo) */}
      {/* ---------------------------------------------------- */}

      <div className="pt-2">
        <span className="block text-sm font-medium text-gray-700 mb-2">Quiero usar QuickStop como:</span>
        <div 
          className="flex bg-gray-100 rounded-xl p-1 shadow-inner"
          role="radiogroup"
          aria-label="Selección de rol de usuario"
        >
          {/* ... Botones Driver/Owner (sin cambios) ... */}
          <button
            type="button"
            onClick={() => handleRoleChange('DRIVER')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out ${isDriver ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            role="radio"
            aria-checked={isDriver}
          >Conductor (Driver)</button>
          
          <button
            type="button"
            onClick={() => handleRoleChange('OWNER')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out ${!isDriver ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            role="radio"
            aria-checked={!isDriver}
          >Dueño (Owner)</button>
        </div>
      </div>

      {/* Checkbox y Mensaje de Términos */}
      <div className="mt-4">
        <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                aria-required="true"
                aria-invalid={!!errors.termsAccepted} // WCAG: Indica si el checkbox tiene un error
                disabled={isLoading} // Deshabilita el checkbox si está cargando
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                Acepto los <a href="/terms" className="text-indigo-600 hover:text-indigo-800 underline transition-colors" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
              </label>
            </div>
        </div>
        {errors.termsAccepted && <p id="termsAccepted-error" className="mt-1 text-sm text-red-600" aria-live="assertive">{errors.termsAccepted}</p>}
      </div>
      
      {/* Botón de Registro */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
        disabled={isLoading || !formData.termsAccepted}
        aria-label={isLoading ? "Registrando usuario..." : "Crear una cuenta nueva en QuickStop ParkIT"}
      >
                {isLoading ? (
            <>
                {/* Ícono de carga simple */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
            </>
        ) : (
            'Crear Cuenta'
        )}
      </button>

      {/* Enlace a Login */}
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta? <a href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Iniciar Sesión</a>
      </p>
    </form>
  );
};

export default RegisterForm;