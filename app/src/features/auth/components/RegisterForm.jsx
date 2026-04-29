import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../AuthService";
import { useAuth } from "../../../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const infoRef = React.useRef(null);
    const { login } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "DRIVER",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  // Efecto para cerrar info roles al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el pop-up está abierto y el clic NO está dentro del div del pop-up
      if (
        showInfo &&
        infoRef.current &&
        !infoRef.current.contains(event.target)
      ) {
        setShowInfo(false);
      }
    };

    // Escuchamos el evento mousedown en todo el documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza del evento al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  // ----------------------------
  // INPUT CHANGE + VALIDACIÓN LIVE
  // ----------------------------
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));

    validateField(id, type === "checkbox" ? checked : value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    // Nombre
    if (field === "name") {
      if (!value || value.length < 4)
        newErrors.name = "El nombre debe contener al menos 4 caracteres.";
      else delete newErrors.name;
    }

    // Email
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
        newErrors.email = "Se requiere un formato válido. Ej: ejemplo@dominio.com";
      else delete newErrors.email;
    }

    // Password
    if (field === "password") {
      if (!value || value.length < 8)
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      else delete newErrors.password;

      // Si cambia password, también validar confirmación
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    // Confirm password
    if (field === "confirmPassword") {
      if (value !== formData.password)
        newErrors.confirmPassword = "Las contraseñas deben coincidir.";
      else delete newErrors.confirmPassword;
    }

    // Términos
    if (field === "termsAccepted") {
      if (!value)
        newErrors.termsAccepted = "Para crear una cuenta, se deben aceptar los Términos y Condiciones.";
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
      newErrors.name = "El nombre debe contener al menos 4 caracteres.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Se requiere un formato válido. Ej: ejemplo@dominio.com";

    if (formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas deben coincidir.";

    if (!formData.termsAccepted)
      newErrors.termsAccepted = "Para crear una cuenta, se deben aceptar los Términos y Condiciones.";

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
      const response = await registerUser(formData);
      if (response?.userId === 0) {
        const errorMsg = "El correo " + formData.email + " se encuentra registrado.";
        setErrors({ email: errorMsg });
        document.getElementById("email")?.focus();
        return;
      }else
      if (response?.token) {
				const userData = {
					id: response.userId,
					name: response.name,
					email: response.email,
					role: response.role
				};
				login(response.token, userData);
			}
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error);
        setErrors({
          global: "No se ha podido procesar el registro en este momento. Por favor, inténtelo de nuevo en unos minutos.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (field) => `
    w-full p-3 border rounded-lg transition-colors focus:outline-none
    ${
      errors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    }
  `;

  const isDriver = formData.role === "DRIVER";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.global && (
        <p className="text-sm text-red-600" aria-live="assertive">
          {errors.global}
        </p>
      )}

      {/* Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
          className={getInputClass("name")}
          placeholder="Ej: Laura Sánchez"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={isLoading}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className={getInputClass("email")}
          placeholder="tu.correo@ejemplo.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isLoading}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          className={getInputClass("password")}
          placeholder="Introduzca una contraseña"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          disabled={isLoading}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirmación */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          className={getInputClass("confirmPassword")}
          placeholder="Repita la contraseña"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Rol */}
      <div className="pt-2 relative">
        <div className="flex items-center mb-2">
          <span className="block text-sm font-medium text-gray-700">
            Tipo de cuenta:
          </span>
          {/* Botón de información "?" */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }}
            className="ml-2 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Más información sobre los roles"
          >
            ?
          </button>
        </div>

        {/* Pop-up de información */}
        {showInfo && (
          <div
            ref={infoRef}
            className="absolute z-10 left-0 bottom-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-4 animate-in fade-in zoom-in duration-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-indigo-600 text-sm">
                Tipos de cuenta
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-600">
              <p>
                <strong className="text-gray-800">Conductor:</strong> Busca y
                reserva plazas en tiempo real. Ideal si se necesita aparcar rápido
                y sin complicaciones.
              </p>
              <p>
                <strong className="text-gray-800">Propietario:</strong> Registra
                plazas de aparcamiento vacías y genera ingresos.
              </p>
            </div>
          </div>
        )}

        <div
          className="flex bg-gray-100 rounded-xl p-1 shadow-inner"
          role="radiogroup"
        >
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "DRIVER" }))}
            className={`
        flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${
          isDriver
            ? "bg-indigo-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-200"
        }
      `}
            role="radio"
            aria-checked={isDriver}
          >
            Conductor
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role: "OWNER" }))}
            className={`
        flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${
          !isDriver
            ? "bg-indigo-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-200"
        }
      `}
            role="radio"
            aria-checked={!isDriver}
          >
            Propietario
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
          <label
            htmlFor="termsAccepted"
            className="ml-3 text-sm font-medium text-gray-700"
          >
            Se han leído y se aceptan los{" "}
            <a
              href="/terms"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Términos y Condiciones
            </a>
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
        {isLoading ? "Registrando..." : "Crear Cuenta"}
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Tiene cuenta?{" "}
        <a
          href="/login"
          className="p-1 text-indigo-600 hover:bg-indigo-100 focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 rounded"
        >
          Inicie sesión aquí
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
