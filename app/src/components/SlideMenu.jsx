import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SideMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 block"
          onClick={onClose}
          aria-label="Cerrar menú"
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 p-6 
                    transition-transform duration-300 ease-in-out transform
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <nav className="space-y-6 mt-12 text-xl">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigation("/account")}
                className="block w-full text-left text-gray-700 hover:text-indigo-600 border-b-1 pb-4 mb-4"
              >
                <div className="flex-col items-center justify-center text-center space-x-3">
                  <div className="flex-row items-center content-center justify-center ">
                    <img
                      src="../../public/vite.svg"
                      alt={user?.name ?`Foto de perfil de ${user.name}` : "Foto de perfil de usuario"}
                      className="mx-auto"
                    />
                    <span className="font-medium">
                      {user?.name || user?.username || "Usuario"}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    Ver Perfil
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleNavigation("/")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Mapa</span>
              </button>
              <button
                onClick={() => handleNavigation("/reservations")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center mt-6 items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Mis Reservas</span>
              </button>



              <button
                onClick={() => handleNavigation('/addparking')}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center mt-6 items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Añadir parking</span>
              </button>




              <button
                onClick={handleLogout}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Cerrar Sesión</span>
              </button>
              <button
                onClick={() => handleNavigation("/settings")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.829 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.829 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.829-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.829-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Configuración</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Mapa</span>
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Iniciar Sesión</span>
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="flex w-full text-left text-gray-700 hover:text-indigo-600 text-center items-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span className="font-medium">Registrarse</span>
              </button>
            </>
          )}
        </nav>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 font-bold text-3xl text-gray-600 hover:text-gray-900"
          aria-label="Cerrar menú lateral"
        >
          &times;
        </button>
      </div>
    </>
  );
};

export default SideMenu;
