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

  const [errors, setErrors] = useState({});

  // ----------------------------
  // INPUT CHANGE + VALIDACIÓN LIVE
  // ----------------------------
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));

    validateField(id, type === 'checkbox' ? checked : value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    // Nombre
    if (field === 'name') {
      if (!value || value.length < 4) newErrors.name = 'El nombre debe tener al menos 4 caracteres.';
      else delete newErrors.name;
    }

    // Email
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) newErrors.email = 'Introduce un correo electrónico válido.';
      else delete newErrors.email;
    }

    // Password
    if (field === 'password') {
      if (!value || value.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      else delete newErrors.password;

      // Si cambia password, también validar confirmación
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    // Confirm password
    if (field === 'confirmPassword') {
      if (value !== formData.password) newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      else delete newErrors.confirmPassword;
    }

    // Términos
    if (field === 'termsAccepted') {
      if (!value) newErrors.termsAccepted = 'Debes aceptar los Términos y Condiciones.';
      else delete newErrors.termsAccepted;
    }

    setErrors(newErrors);
  };

  // ----------------------------
  // VALIDACIÓN COMPLETA
  // ----------------------------
  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 4)
      newErrors.name = 'El nombre debe tener al menos 4 caracteres.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = 'Introduce un correo electrónico válido.';

    if (formData.password.length < 8)
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';

    if (!formData.termsAccepted)
      newErrors.termsAccepted = 'Debes aceptar los Términos y Condiciones.';

    setErrors(newErrors);

    return { isValid: Object.keys(newErrors).length === 0, newErrors };
  };

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      const firstField = Object.keys(newErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      if (error.message === 'EmailAlreadyExists') {
        setErrors({ email: 'Este correo ya está registrado.' });
        document.getElementById('email')?.focus();
      } else {
        setErrors({
          global: 'Ocurrió un error inesperado. Inténtalo más tarde.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field) => `
    w-full p-3 border rounded-lg transition-colors focus:outline-none
    ${errors[field]
      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'}
  `;

  const isDriver = formData.role === 'DRIVER';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {errors.global && (
        <p className="text-sm text-red-600" aria-live="assertive">{errors.global}</p>
      )}

      {/* Nombre */}
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
          autoComplete="name"
          className={getInputClass('name')}
          placeholder="Ej: Laura Sánchez"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          disabled={isLoading}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
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
          autoComplete="email"
          className={getInputClass('email')}
          placeholder="tu.correo@ejemplo.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isLoading}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
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
          autoComplete="new-password"
          className={getInputClass('password')}
          placeholder="Mínimo 8 caracteres"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          disabled={isLoading}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirmación */}
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
          autoComplete="new-password"
          className={getInputClass('confirmPassword')}
          placeholder="Repite la contraseña"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Rol */}
      <div className="pt-2">
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Quiero usar QuickStop como:
        </span>

        <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner" role="radiogroup">
          
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'DRIVER' }))}
            className={`
              flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${isDriver
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'}
            `}
            role="radio"
            aria-checked={isDriver}
          >
            Conductor (Driver)
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, role: 'OWNER' }))}
            className={`
              flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${!isDriver
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'}
            `}
            role="radio"
            aria-checked={!isDriver}
          >
            Dueño (Owner)
          </button>
        </div>
      </div>

      {/* Términos */}
      <div className="mt-4">
        <div className="flex items-start">
          <input
            id="termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            aria-invalid={!!errors.termsAccepted}
            disabled={isLoading}
          />
          <label htmlFor="termsAccepted" className="ml-3 text-sm font-medium text-gray-700">
            Acepto los <a href="/terms" className="text-indigo-600 hover:text-indigo-800 underline">Términos y Condiciones</a>
          </label>
        </div>

        {errors.termsAccepted && (
          <p id="termsAccepted-error" className="mt-1 text-sm text-red-600">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg
          hover:bg-indigo-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        "
        disabled={isLoading}
      >
        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta?{' '}
        <a
          href="/login"
          className="p-1 text-indigo-600 hover:bg-indigo-100 focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 rounded"
        >
          Inicia sesión aquí
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
