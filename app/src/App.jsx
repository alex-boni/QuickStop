import { Routes, Route, Outlet, Link } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import AppLayout from "./Layouts/AppLayout";
import MapPageBonito from "./pages/MapPageBonito";
import ViewAccountDetails from "./pages/ViewAccountDetails";
import { AuthProvider } from "./context/AuthContext";

function Layout() {
  return (
    <>
      <nav style={{ padding: 12 }}>
        <Link to="/" style={{ marginRight: 12 }}>Home</Link>
        <Link to="/register" style={{ marginRight: 12 }}>Register</Link>
        <Link to="/login">Login</Link>
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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mapa" element={<MapPageBonito />} />
          <Route path="/account" element={<ViewAccountDetails />} />
          {/* Add more routes as needed */}
        </Route>
        <Route path="/" element={<MapPage />} />
      </Routes>
    </AuthProvider>
  );
}