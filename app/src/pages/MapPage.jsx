import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ParkingActionModal from "../features/parking/components/ParkingActionModal";
import { deleteParking } from "../features/parking/ParkingService";
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
import { getParkings } from "../features/parking/ParkingService"; 

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;
const PARKINGS_DATA = await getParkings();

export default function MapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estado para controlar la barra lateral (SideMenu) en escritorio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Estado para el modal
  const [modalState, setModalState] = useState({
    isOpen: false,
    parkingId: null,
    parkingName: '',
    ownerId: null
  });

  const openModal = (parkingId, parkingName, ownerId) => {
    setModalState({
      isOpen: true,
      parkingId,
      parkingName,
      ownerId
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      parkingId: null,
      parkingName: '',
      ownerId: null
    });
  };

  const handleViewDetails = () => {
    navigate(`/parking/${modalState.parkingId}`);
    closeModal();
  };

  const handleEdit = () => {
    navigate(`/parking/edit/${modalState.parkingId}`);
    closeModal();
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${modalState.parkingName}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteParking(modalState.parkingId);
        alert('Parking eliminado correctamente');
        closeModal();
        // Recargar la página para actualizar el mapa
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar parking:', error);
        alert('Error al eliminar el parking. Inténtalo de nuevo.');
      }
    }
  };

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
    
    // Si es un cluster, expandirlo
    if (feature.layer.id === clusterLayer.id) {
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
    }
    
    // Si es un punto individual
    if (feature.layer.id === unclusteredPointLayer.id) {
      const parkingId = feature.properties.id;
      const parkingName = feature.properties.name || 'Parking';
      const ownerId = feature.properties.ownerId;
      
      if (parkingId) {
        // Verificar si el usuario es el owner
        if (user && user.id === ownerId) {
          // Es el owner, mostrar modal
          openModal(parkingId, parkingName, ownerId);
        } else {
          // No es el owner, ir directo a detalles
          navigate(`/parking/${parkingId}`);
        }
      }
    }
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
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="parkings"
          type="geojson"
          data={PARKINGS_DATA}
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
      
      <ParkingActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onView={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        parkingName={modalState.parkingName}
      />
    </div>
  );
}

