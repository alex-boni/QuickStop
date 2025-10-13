import { Routes, Route, Outlet, Link } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";

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
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Route>
    </Routes>
  );
}