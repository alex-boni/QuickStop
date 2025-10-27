import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import ViewAccountDetails from "./pages/ViewAccountDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                Home
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/register" 
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Registrarse
                  </Link>
                  <Link 
                    to="/login" 
                    className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Iniciar Sesión
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/account" 
                    className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  >
                    Mi Cuenta
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<ViewAccountDetails />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}