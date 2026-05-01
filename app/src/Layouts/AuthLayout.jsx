import React from "react";
import logo from "../../public/icons/ic_app_196.png";
import CitySkylineIllustration from "../components/CitySkylineIllustration";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    // Contenedor principal con degradado
    <div className="h-full w-full flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-white to-white relative ">
      {/* PANEL IZQUIERDO: Beneficios*/}
      <div className="hidden md:flex md:w-1/2 flex-col top-50 pl-12 lg:pl-36 relative overflow-hidden">
        {/* Contenido de texto */}
        <div className="z-10 space-y-6 mb-20">
          <p className="text-2xl font-semibold text-gray-800 flex items-center gap-4 ">
            <img
              src={logo}
              alt="QuickStop Logo"
              className="h-16 w-auto object-contain"
            />
            Tu ciudad, sin problemas de aparcamiento.
          </p>
          <ul className="space-y-4 text-gray-900">
            <li className="flex items-center gap-3">
              <span className="text-indigo-500 font-bold">✦</span> Encuentra
              plazas libres en tiempo real.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-indigo-500 font-bold">✦</span> Gestiona tus
              reservas en segundos.
            </li>
            <li className="flex items-center gap-3">
              <span className="text-indigo-500 font-bold">✦</span> Genera
              ingresos con tus plazas vacías.
            </li>
          </ul>
        </div>
      </div>
      {/* Ilustración de la ciudad */}
      <CitySkylineIllustration className="bottom-0" />

      {/* PANEL DERECHO: Formulario */}
      <div className="flex-1 flex flex-col items-center pt-32 md:pt-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm p-10 space-y-4 shadow-2xl rounded-2xl border border-white">
          <header className="text-center md:text-left space-y-2">
            {/* Logo solo visible en móvil*/}
            <h1 className="text-3xl font-bold text-indigo-700 md:hidden">
              QuickStop
            </h1>
            <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
            <h3 className="text-gray-500 font-semibold ">{subtitle}</h3>
          </header>

          <main role="main">{children}</main>
        </div>
        <footer className="text-center pt-6 text-xs text-gray-50">. </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
