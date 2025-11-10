import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    // flexbox para centrar contenido vertical y horizontalmente.
    <div className="flex flex-col items-center justify-center bg-gray-100 pt-30 md:pt-10">
      {/* Contenedor central de la tarjeta, con sombreado y esquinas redondeadas */}
      <div className="w-full max-w-md h-full bg-white p-8 space-y-6 shadow-xl rounded-lg border border-gray-200">
        {/* Título y Logo */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700">
            QuickStop
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
          <h3 className="text-md font-medium text-gray-600">{subtitle}</h3>
        </header>

        {/* Inyeccion de los formularios de Login o Registro */}
        <main role="main">{children}</main>
      </div>

      {/* Pequeño texto legal fuera de la tarjeta */}
      <footer className="flex mt-6 text-sm text-gray-500">
        ¿Problemas? Contacta a soporte.
      </footer>
    </div>
  );
};

export default AuthLayout;
