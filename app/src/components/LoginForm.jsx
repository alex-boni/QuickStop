import React from 'react';

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Iniciar Sesión
      </button>

      <p className="text-center text-sm mt-4">
        ¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">Regístrate aquí</a>
      </p>
    </form>
  );
};

export default LoginForm;
