import React, { useState } from "react";
import Map, {  GeolocateControl, ScaleControl, NavigationControl } from "react-map-gl/mapbox";
import GeocoderControl from "../components/GeocoderControl";
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

  const [viewState, setViewState] = useState({
    latitude: 40.4168,
    longitude: -3.7038,
    zoom: 12,
  });
  
  const handleViewStateChange = (newViewState) => {
    if(!newViewState || !newViewState.latitude || !newViewState.longitude ) return;
    setViewState({
      latitude: newViewState.latitude,
      longitude: newViewState.longitude,
      zoom: 14,
      trandsitionDuration: 1500,
    });
  }
  
  // Verificación de token (WCAG 3.3.5: Ayuda en caso de error)
  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold p-8">
        Error de Configuración: Token de Mapbox no configurado. Verifica tu
        archivo .env.
      </div>
    );
  }
// const noop = () => {};
  
  return (
    <div className="relative w-full h-full ">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {/* Control de Búsqueda Geocoding */}
        {/* <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-left" marker="false" onLoading={noop} onResults={noop} onResult={noop} onError={noop} /> */}

        {/* Control de Geolocalización (Mi Ubicación) */}
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          position="top-right"
          aria-label="Localizar mi ubicación actual"
          style={{marginRight: "35px", marginTop: "110px"}}
        />
        <ScaleControl/>
        <NavigationControl position="top-right" style={{marginRight: "35px", marginTop: "20px"}}/>

      </Map>

      <MobileSearchBar onSearch={handleViewStateChange} />
      <DesktopSearchBar
        onSearch={handleViewStateChange}
      />
      <FloatingMenuButton onToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
  );
}

export default MapPage;
