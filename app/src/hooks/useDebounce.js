
import { useState, useEffect } from 'react';

/**
 * Hook para retrasar la actualización de un valor.
 * Es crucial para optimizar llamadas a API (ej. autocompletado de búsqueda) 
 * ya que solo se dispara cuando el usuario deja de escribir.
 *
 * @param {any} value El valor que necesita ser 'retrasado' (ej. el texto del input).
 * @param {number} delay El tiempo de espera en milisegundos (ej. 300ms).
 * @returns {any} El valor final después de la pausa.
 */
export function useDebounce(value, delay) {
  // Estado para almacenar el valor debounced
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Configurar un temporizador (timer)
    const handler = setTimeout(() => {
      // 2. Si el timer expira (el usuario dejó de escribir), actualiza el valor debounced
      setDebouncedValue(value);
    }, delay);

    // 3. Función de limpieza:
    // Si 'value' (el texto de entrada) cambia antes de que expire el retraso,
    // se ejecuta la limpieza, cancelando el timer anterior. Esto asegura que 
    // solo se active el último temporizador después de la pausa final.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // El efecto se vuelve a ejecutar si el valor o el retraso cambian

  return debouncedValue;
}