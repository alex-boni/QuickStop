import { Routes, Route, Outlet, Link } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import AppLayout from "./Layouts/AppLayout";
import MapPageBonito from "./pages/MapPageBonito";
import ViewAccountDetails from "./pages/ViewAccountDetails";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";
import TopNav from "./components/TopNav";
import FloatingMenuButton from "./components/FloatingMenuButton";
import SideMenu from "./components/SlideMenu";

function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <>
    <div className="hidden md:block">
      <TopNav />
    </div>
    <div className="md:hidden z-50">
          <FloatingMenuButton onToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
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