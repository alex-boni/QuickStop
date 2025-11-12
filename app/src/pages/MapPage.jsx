import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ParkingActionModal from "../features/parking/components/ParkingActionModal";
import ParkingDetailsModal from "../features/parking/components/ParkingDetailsModal";
import ParkingQuickViewPopup from "../features/parking/components/ParkingQuickViewPopup";
import { deleteParking } from "../features/parking/ParkingService";
import Map, {
  GeolocateControl,
  ScaleControl,
  NavigationControl,
  Source,
  Layer,
  Popup,
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
import { getParkings, EMPTY_GEOJSON} from "../features/parking/ParkingService"; 

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;
// const PARKINGS_DATA = await getParkings();

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Estado para controlar la barra lateral (SideMenu) en escritorio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Estado para el modal de acciones (owner)
  const [modalState, setModalState] = useState({
    isOpen: false,
    parkingId: null,
    parkingName: '',
    ownerId: null
  });

  // Estado para el modal de detalles completo (owner)
  const [detailsModalState, setDetailsModalState] = useState({
    isOpen: false,
    parkingId: null
  });

  // Estado para el popup quick view (no owner) - anclado al mapa
  const [quickViewModalState, setQuickViewModalState] = useState({
    isOpen: false,
    parkingId: null,
    longitude: null,
    latitude: null
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
    // Cerrar el modal de acciones y abrir el modal de detalles completo (para owner)
    const parkingId = modalState.parkingId;
    closeModal();
    setDetailsModalState({
      isOpen: true,
      parkingId
    });
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

  // Efecto para centrar el mapa cuando venimos desde "Ver en mapa"
  useEffect(() => {
    if (location.state?.centerOn) {
      const { longitude, latitude } = location.state.centerOn;
      
      // Esperar a que el mapa esté listo
      const timer1 = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.easeTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 1500
          });
        }
      }, 500);
      
      // Limpiar el state después de usarlo
      const timer2 = setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 2100);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [location.state]);

  // Estado para manejar la búsqueda de parkings según la ubicación
  const [searchLocation, setSearchLocation] = useState(null);
  const [isLoadingParkings, setIsLoadingParkings] = useState(true);
  const [parkingsGeoJson, setParkingsGeoJson] = useState(EMPTY_GEOJSON);
  const [showOnlyMyParkings, setShowOnlyMyParkings] = useState(false);
  const SEARCH_DISTANCE_KM = 5; // Distancia de búsqueda en kilómetros
  const handleSearchMove = (result) =>{
    if(!result || !result.latitude || !result.longitude){
      return;
    }
    setViewState({
      latitude: result.latitude,
      longitude: result.longitude,
      zoom: 14,
      transitionDuration: 1500,
    })
    setSearchLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      distance: SEARCH_DISTANCE_KM,
    })
  }
  useEffect(() =>{
    const loadParkings = async ()=>{
      setIsLoadingParkings(true);
      const coords = searchLocation || {
        latitude: viewState.latitude,
        longitude: viewState.longitude,
        distance: SEARCH_DISTANCE_KM,
      }
      const data = await getParkings(coords);
      
      // Filtrar solo mis parkings si está activado
      if (showOnlyMyParkings && user) {
        const filteredData = {
          ...data,
          features: data.features.filter(f => f.properties.ownerId === user.id)
        };
        setParkingsGeoJson(filteredData);
      } else {
        setParkingsGeoJson(data);
      }
      
      setIsLoadingParkings(false);
    }
    loadParkings();
  }, [searchLocation, showOnlyMyParkings]);

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
      const [longitude, latitude] = feature.geometry.coordinates;
      
      if (parkingId) {
        // Centrar el mapa en el parking clickeado con transición suave usando easeTo
        if (mapRef.current) {
          mapRef.current.easeTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 1500, // 1.5 segundos
            essential: true
          });
        }

        // Verificar si el usuario es el owner
        if (user && user.id === ownerId) {
          // Es el owner, mostrar modal de acciones
          openModal(parkingId, parkingName, ownerId);
        } else {
          // No es el owner, mostrar quick view anclado al mapa
          setQuickViewModalState({
            isOpen: true,
            parkingId,
            longitude,
            latitude
          });
        }
      }
    }
  };

  // Verificación de token (WCAG 3.3.5: Ayuda en caso de error)
  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold p-8" role="alert" aria-label="Error de Configuración: Token de Mapbox no configurado">
        Error de Configuración: Token de Mapbox no configurado. Verifica tu
        archivo .env.
      </div>
    );
  }
  // const noop = () => {};

  return (
    <div className="relative w-full h-full ">
      <title>QuikStop: Mapa </title>
      <h1 className="justify-center place-self-center text-indigo-600" aria-label="QuikStop: Mapa de Parkings" hidden>QuikStop: Mapa de Parkings</h1>
      <h2 className="justify-center place-self-center text-indigo-600" aria-label="Mapa interactivo de parkings disponibles en QuikStop" hidden>Mapa interactivo de parkings disponibles</h2>

      {isLoadingParkings && (
                <div 
                className="absolute inset-0 z-[10] flex items-center justify-center bg-gray-100 bg-opacity-75"
                role="status" // WCAG: Indica que es un área de estado (cargando)
                aria-live="polite" // WCAG: Anuncia al lector de pantalla que el estado ha cambiado
                aria-label="Cargando parkings disponibles. Por favor espera. Si la carga tarda mucho, por favor refresca la página o revisa tu conexión a internet."
                >
                    <p className="text-indigo-600 font-bold text-xl flex items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
                        {/* Spinner simple de Tailwind (ejemplo) */}
                        <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cargando parkings disponibles... Si la carga tarda mucho, por favor refresca la página o revisa tu conexión a internet.
                    </p> 
                </div>
            )}
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
          data={parkingsGeoJson}
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

        {/* Popup anclado al parking */}
        {quickViewModalState.isOpen && (
          <ParkingQuickViewPopup
            longitude={quickViewModalState.longitude}
            latitude={quickViewModalState.latitude}
            parkingId={quickViewModalState.parkingId}
            onClose={() => setQuickViewModalState({ isOpen: false, parkingId: null, longitude: null, latitude: null })}
          />
        )}
      </Map>

      <MobileSearchBar onSearch={handleSearchMove} />
      <DesktopSearchBar onSearch={handleSearchMove} />
      
      {/* Botón flotante para filtrar mis parkings - solo para OWNERS */}
      {user && user.role === 'OWNER' && (
        <button
          onClick={() => setShowOnlyMyParkings(!showOnlyMyParkings)}
          className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 p-4 rounded-full shadow-lg transition-all duration-300 z-10 ${
            showOnlyMyParkings 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-white hover:bg-gray-100'
          }`}
          title={showOnlyMyParkings ? 'Mostrar todos los parkings' : 'Mostrar solo mis parkings'}
        >
          {showOnlyMyParkings ? (
            // Icono cuando está activo (filtro aplicado)
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          ) : (
            // Icono cuando está inactivo
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          )}
        </button>
      )}
      
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

      <ParkingDetailsModal
        isOpen={detailsModalState.isOpen}
        onClose={() => setDetailsModalState({ isOpen: false, parkingId: null })}
        parkingId={detailsModalState.parkingId}
      />
    </div>
  );
}

