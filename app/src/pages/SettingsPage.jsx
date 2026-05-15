import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusMessage from "../components/StatusMessage";
import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  applyAccessibilityPreferences,
  getStorageKeyForUser,
  getStoredSettingsForUser,
} from "../features/accessibility/accessibilitySettings";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const storageKey = useMemo(() => getStorageKeyForUser(user?.id), [user?.id]);
  const [settings, setSettings] = useState(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [status, setStatus] = useState({ type: null, message: null });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !storageKey) {
      setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      setIsDirty(false);
      return;
    }
    const loaded = getStoredSettingsForUser(user.id);
    setSettings(loaded);
    setIsDirty(false);
  }, [isAuthenticated, storageKey, user?.id]);

  useEffect(() => {
    applyAccessibilityPreferences(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      if (!storageKey) return;
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setIsDirty(false);
      setStatus({
        type: "success",
        message: "Ajustes guardados y asociados a tu cuenta.",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Error guardando configuración:", error);
      setStatus({
        type: "error",
        message: "No se pudo guardar la configuración. Inténtalo de nuevo.",
      });
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    setIsDirty(true);
    setStatus({
      type: "success",
      message: "Ajustes restablecidos en vista previa. Pulsa Guardar para confirmar.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-16 md:py-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Accesibilidad</h1>
          <p className="mt-3 text-gray-700">
            Inicia sesión para ajustar las opciones de accesibilidad.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Iniciar sesión
            </Link>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-16 pb-8 md:py-8">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />

      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Accesibilidad</h1>
          <p className="mt-2 text-gray-600">
            Los cambios se aplican al instante para que puedas probarlos. Guarda cuando te convenzan.
          </p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Ajustes visuales y de lectura</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="text-scale" className="block text-sm font-medium text-gray-700">
                Tamaño de letra
              </label>
              <select
                id="text-scale"
                value={settings.textScale}
                onChange={(e) => updateSetting("textScale", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="xlarge">Muy grande</option>
              </select>
            </div>

            <div>
              <label htmlFor="button-size" className="block text-sm font-medium text-gray-700">
                Tamaño de botones
              </label>
              <select
                id="button-size"
                value={settings.buttonSize}
                onChange={(e) => updateSetting("buttonSize", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="xlarge">Muy grande</option>
              </select>
            </div>

            <div>
              <label htmlFor="line-spacing" className="block text-sm font-medium text-gray-700">
                Espaciado entre líneas
              </label>
              <select
                id="line-spacing"
                value={settings.lineSpacing}
                onChange={(e) => updateSetting("lineSpacing", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <option value="normal">Normal</option>
                <option value="relaxed">Relajado</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <label className="flex min-h-11 items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSetting("darkMode", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              Modo oscuro
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting("highContrast", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              Alto contraste
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={settings.dyslexiaFont}
                onChange={(e) => updateSetting("dyslexiaFont", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              Modo lectura amigable para dislexia
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              Reducir animaciones
            </label>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Guardar accesibilidad
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Restablecer
          </button>
          {isDirty && (
            <span className="text-sm font-medium text-amber-700">
              Tienes cambios sin guardar.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
