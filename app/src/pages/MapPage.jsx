import React, { useState } from "react";
import Map, {  GeolocateControl, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./MapPage.css";

import FloatingMenuButton from "../components/FloatingMenuButton";
import MobileSearchBar from "../components/MobileSearchBar";
import SideMenu from "../components/SlideMenu";
import DesktopSearchBar from "../components/DesktopSearchBar";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

function MapPage() {
  // Estado para controlar la barra lateral (SideMenu) en escritorio
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Verificación de token (WCAG 3.3.5: Ayuda en caso de error)
  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold p-8">
        Error de Configuración: Token de Mapbox no configurado. Verifica tu
        archivo .env.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full ">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        initialViewState={{
          latitude: 40.4168,
          longitude: -3.7038,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {/* Control de Geolocalización (Mi Ubicación) */}
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          position="top-right"
          aria-label="Localizar mi ubicación actual"
          style={{marginRight: "45px", marginTop: "110px"}}
        />

      </Map>

      <MobileSearchBar onSearch={(query) => console.log("Buscando:", query)} />
      <DesktopSearchBar
        onSearch={(query) => console.log("Buscando en Desktop:", query)}
      />
      <FloatingMenuButton onToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
  );
}

export default MapPage;
