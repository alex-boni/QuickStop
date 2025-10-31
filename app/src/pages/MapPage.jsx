import React, { useState } from "react";
import Map, {
  GeolocateControl,
  ScaleControl,
  NavigationControl,
  Source,
  Layer,
} from "react-map-gl/mapbox";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  unclusteredShadowLayer,
} from "../utils/layers";
import GeocoderControl from "../components/GeocoderControl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./MapPage.css";

import FloatingMenuButton from "../components/FloatingMenuButton";
import MobileSearchBar from "../components/MobileSearchBar";
import SideMenu from "../components/SlideMenu";
import DesktopSearchBar from "../components/DesktopSearchBar";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;
// app/src/pages/MapPage.jsx (Definir los datos arriba)

const MOCK_PARKINGS_DATA = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.701, 40.416] },
      properties: { id: 1, available: 5 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.702, 40.415] },
      properties: { id: 2, available: 12 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.7025, 40.4162] },
      properties: { id: 3, available: 8 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.707, 40.418] },
      properties: { id: 4, available: 2 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.69, 40.41] },
      properties: { id: 5, available: 15 },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.6905, 40.4105] },
      properties: { id: 6, available: 6 },
    },
    // Más puntos cercanos para que se agrupen en Madrid Central
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-3.703, 40.416] },
      properties: { id: 7, available: 20 },
    },
  ],
};

function MapPage() {
  // Estado para controlar la barra lateral (SideMenu) en escritorio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Estado para controlar la vista del mapa
  const [viewState, setViewState] = useState({
    latitude: 40.4168,
    longitude: -3.7038,
    zoom: 12,
  });

  const handleViewStateChange = (newViewState) => {
    if (!newViewState || !newViewState.latitude || !newViewState.longitude)
      return;
    setViewState({
      latitude: newViewState.latitude,
      longitude: newViewState.longitude,
      zoom: 14,
      transitionDuration: 1500,
    });
  };

  // Manejo de los clusters y puntos no agrupados
  const mapRef = React.useRef(null);
  const onClick = (event) => {
    if (!event.features || event.features.length === 0) {
      return;
    }
    const feature = event.features[0];
    // Solo proceder si el clic fue en la capa 'clusters'
    if (feature.layer.id !== clusterLayer.id) {
      return;
    }

    const clusterId = feature.properties.cluster_id;
    const mapboxSource = mapRef.current.getSource("parkings");

    // Mapbox calcula el zoom necesario para expandir el cluster
    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      // Anima el movimiento del mapa al centro del cluster con el zoom calculado
      setViewState({
        latitude: feature.geometry.coordinates[1], // [lng, lat]
        longitude: feature.geometry.coordinates[0],
        zoom,
        transitionDuration: 500,
      });
    });
  };

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
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        interactiveLayerIds={[clusterLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="parkings"
          type="geojson"
          data={MOCK_PARKINGS_DATA}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        />
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
        <Layer {...unclusteredShadowLayer} />
        {/* Control de Búsqueda Geocoding */}
        {/* <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-left" marker="false" onLoading={noop} onResults={noop} onResult={noop} onError={noop} /> */}

        {/* Control de Geolocalización (Mi Ubicación) */}
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          position="top-right"
          aria-label="Localizar mi ubicación actual"
          style={{ marginRight: "35px", marginTop: "110px" }}
        />
        <ScaleControl />
        <NavigationControl
          position="top-right"
          style={{ marginRight: "35px", marginTop: "20px" }}
        />
      </Map>

      <MobileSearchBar onSearch={handleViewStateChange} />
      <DesktopSearchBar onSearch={handleViewStateChange} />
      <FloatingMenuButton onToggle={toggleMenu} />
      <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </div>
  );
}

export default MapPage;
