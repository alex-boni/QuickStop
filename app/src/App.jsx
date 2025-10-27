import { Routes, Route, Outlet, Link } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import ViewAccountDetails from "./pages/ViewAccountDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Layout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <nav style={{ padding: 12 }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/register" style={{ marginRight: 12 }}>Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <Link to="/account">Account Details</Link>
        )}
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