import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const StatusMessage = ({ type, message, onClose, duration = 4000 }) => {
  // Efecto para el auto-cierre
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  const styles = {
    container: isSuccess 
      ? 'bg-green-50 border-green-200 shadow-green-100' 
      : 'bg-red-50 border-red-200 shadow-red-100',
    iconColor: isSuccess ? 'text-green-500' : 'text-red-500',
    textColor: isSuccess ? 'text-green-800' : 'text-red-800',
  };

  // Usamos createPortal para que el mensaje flote sobre toda la app
  return ReactDOM.createPortal(
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <div className={`flex max-w-md w-full p-4 border rounded-2xl shadow-xl pointer-events-auto ${styles.container} animate-in fade-in slide-in-from-top-4 duration-300`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <svg className={`h-5 w-5 ${styles.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className={`h-5 w-5 ${styles.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-bold ${styles.textColor}`}>
            {isSuccess ? 'Completado' : 'Error de sistema'}
          </p>
          <p className={`mt-1 text-sm ${styles.textColor} opacity-90`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 flex-shrink-0 ${styles.textColor} hover:opacity-50 transition-opacity`}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>,
    document.body // Se renderiza al final del body para asegurar superposición
  );
};

export default StatusMessage;