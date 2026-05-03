import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WelcomeLanding from "../components/WelcomeLanding";
import ParkingActionModal from "../features/parking/components/ParkingActionModal";
import ParkingDetailsModal from "../features/parking/components/ParkingDetailsModal";
import ParkingQuickViewPopup from "../features/parking/components/ParkingQuickViewPopup";
import {
  deleteParking,
  getParkingDeleteInfo,
} from "../features/parking/ParkingService";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusMessage from "../components/StatusMessage";
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
  buildingLayer,
} from "../utils/layers";
import GeocoderControl from "../components/GeocoderControl";
import "mapbox-gl/dist/mapbox-gl.css";
// import "./MapPage.css";

import FloatingMenuButton from "../components/FloatingMenuButton";
import MobileSearchBar from "../components/MobileSearchBar";
import SideMenu from "../components/SlideMenu";
import DesktopSearchBar from "../components/DesktopSearchBar";
import { getParkings, EMPTY_GEOJSON } from "../features/parking/ParkingService";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;
// const PARKINGS_DATA = await getParkings();

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const geolocateControlRef = useRef();

  // Estado para controlar la barra lateral (SideMenu) en escritorio
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Estado para manejar la búsqueda de parkings según la ubicación
  const [searchLocation, setSearchLocation] = useState(null);
  const [parkingsGeoJson, setParkingsGeoJson] = useState(EMPTY_GEOJSON);
  const [showOnlyMyParkings, setShowOnlyMyParkings] = useState(false);
  const SEARCH_DISTANCE_KM = 5; // Distancia de búsqueda en kilómetros
  const mapRef = React.useRef(null);

  // Estado para la vista del mapa (latitud, longitud, zoom)
  const [viewState, setViewState] = useState(() => {
    const savedView = sessionStorage.getItem("lastMapView");
    return savedView
      ? JSON.parse(savedView)
      : {
          latitude: 40.4168,
          longitude: -3.7038,
          zoom: 12,
        };
  });
  const currentViewRef = React.useRef(viewState);

  //estado para buscar cerca cuando se mueve el mapa (si el usuario se aleja mucho del punto de búsqueda original)
  const [showSearchHere, setShowSearchHere] = useState(false);
  const lastSearchCoordsRef = useRef(null); // Para comparar movimiento

  // Función para calcular distancia simple (en grados) para no sobrecargar
  const hasMovedSignificantly = (newLat, newLng) => {
    if (!lastSearchCoordsRef.current) return false;
    const { latitude, longitude } = lastSearchCoordsRef.current;
    // Si se mueve más de 0.010 grados (aprox 1 km), mostramos el botón
    const threshold = 0.01;
    return (
      Math.abs(newLat - latitude) > threshold ||
      Math.abs(newLng - longitude) > threshold
    );
  };
  const handleMapMove = (evt) => {
    const newViewState = evt.viewState;
    setViewState(newViewState);

    // Si ya hemos buscado alguna vez, comprobamos si se ha movido mucho
    if (lastSearchCoordsRef.current) {
      if (
        hasMovedSignificantly(newViewState.latitude, newViewState.longitude)
      ) {
        setShowSearchHere(true);
      } else {
        setShowSearchHere(false);
      }
    }
  };
  const handleSearchInThisArea = () => {
    const { latitude, longitude } = viewState;

    // Guardamos donde estamos buscando ahora
    lastSearchCoordsRef.current = { latitude, longitude };

    // Disparamos la búsqueda con las nuevas coordenadas
    setSearchLocation({
      latitude,
      longitude,
      distance: SEARCH_DISTANCE_KM,
    });

    setShowSearchHere(false);
  };

  // Estado para el modal de acciones (owner)
  const [modalState, setModalState] = useState({
    isOpen: false,
    parkingId: null,
    parkingName: "",
    ownerId: null,
  });

  // Estado para confirmación de eliminación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    parkingId: null,
    parkingName: "",
    activeReservations: 0,
  });

  // Estado para mensajes de estado
  const [statusMessage, setStatusMessage] = useState({
    type: null,
    message: "",
  });

  // Estado para el modal de detalles completo (owner)
  const [detailsModalState, setDetailsModalState] = useState({
    isOpen: false,
    parkingId: null,
  });

  // Estado para el popup quick view (no owner) - anclado al mapa
  const [quickViewModalState, setQuickViewModalState] = useState({
    isOpen: false,
    parkingId: null,
    longitude: null,
    latitude: null,
  });

  const [showWelcome, setShowWelcome] = useState(false);

  const openModal = (parkingId, parkingName, ownerId) => {
    setModalState({
      isOpen: true,
      parkingId,
      parkingName,
      ownerId,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      parkingId: null,
      parkingName: "",
      ownerId: null,
    });
  };

  useEffect(() => {
    // Solo mostramos si el usuario NO está logueado y es la primera vez en esta sesión
    const hasSeenWelcome = sessionStorage.getItem("welcomeShown");
    if (!isAuthenticated && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    currentViewRef.current = viewState;
  }, [viewState]);

  const handleCloseWelcome = () => {
    sessionStorage.setItem("welcomeShown", "true");
    setShowWelcome(false);
  };

  const handleViewDetails = () => {
    // Cerrar el modal de acciones y abrir el modal de detalles completo (para owner)
    const parkingId = modalState.parkingId;
    closeModal();
    setDetailsModalState({
      isOpen: true,
      parkingId,
    });
  };

  const handleEdit = () => {
    navigate(`/parking/edit/${modalState.parkingId}`);
    closeModal();
  };

  const handleDelete = async () => {
    try {
      const info = await getParkingDeleteInfo(modalState.parkingId);

      setConfirmDialog({
        isOpen: true,
        parkingId: modalState.parkingId,
        parkingName: modalState.parkingName,
        activeReservations: info.activeReservations,
      });
      closeModal();
    } catch (error) {
      console.error("Error obteniendo info del parking:", error);
      setStatusMessage({
        type: "error",
        message:
          "Error al obtener información del aparcamiento. Inténtalo de nuevo.",
      });
      closeModal();
    }
  };

  const confirmDelete = async () => {
    const { parkingId, parkingName, activeReservations } = confirmDialog;

    try {
      await deleteParking(parkingId);

      const message =
        activeReservations > 0
          ? `Aparcamiento "${parkingName}" eliminado y ${activeReservations} reservas canceladas`
          : `Aparcamiento "${parkingName}" eliminado correctamente`;

      setStatusMessage({
        type: "success",
        message,
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error("Error al eliminar aparcamiento:", error);
      setStatusMessage({
        type: "error",
        message: "Error al eliminar el aparcamiento. Inténtalo de nuevo.",
      });
    } finally {
      setConfirmDialog({
        isOpen: false,
        parkingId: null,
        parkingName: "",
        activeReservations: 0,
      });
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      parkingId: null,
      parkingName: "",
      activeReservations: 0,
    });
  };

  useEffect(() => {
    const hasAutoLocated = sessionStorage.getItem("hasAutoLocated");
    const savedView = sessionStorage.getItem("lastMapView");
    if (location.state?.centerOn && location.state?.isReservation) {
      const { latitude, longitude } = location.state.centerOn;
      setViewState({
        latitude,
        longitude,
        zoom: 16,
        transitionDuration: 2000,
      });
      window.history.replaceState({}, document.title); // Limpiar el state para evitar re-centrar al volver
      const coordsReservation = {
        latitude,
        longitude,
        distance: 0, // Solo queremos ese punto exacto para mostrar su popup
      };
      setSearchLocation(coordsReservation);
      //abrir el popup del parking reservado
      setQuickViewModalState({
        isOpen: true,
        parkingId: location.state.parkingId,
        longitude,
        latitude,
      });
      setShowSearchHere(true);
    } else if (!location.state?.centerOn && !hasAutoLocated && !savedView) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            sessionStorage.setItem("hasAutoLocated", "true");

            const newView = { ...viewState, longitude, latitude, zoom: 14 };
            setViewState(newView);
            setSearchLocation({
              longitude,
              latitude,
              distance: SEARCH_DISTANCE_KM,
            });
            lastSearchCoordsRef.current = { latitude, longitude };
          },
          (error) => console.warn("Geolocalización declinada", error),
        );
      }
    }

    return () => {
      if (currentViewRef.current) {
        sessionStorage.setItem(
          "lastMapView",
          JSON.stringify(currentViewRef.current),
        );
      }
    };
  }, []);

  const handleSearchMove = (result) => {
    if (!result || !result.latitude || !result.longitude) {
      return;
    }
    setViewState({
      latitude: result.latitude,
      longitude: result.longitude,
      zoom: 14,
      transitionDuration: 1500,
    });
    setSearchLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      distance: SEARCH_DISTANCE_KM,
    });
    lastSearchCoordsRef.current = {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  };

  const handleGeolocateClick = () => {
    if (geolocateControlRef.current) {
      geolocateControlRef.current.trigger();
    }
  };

  const handleAddParkingQuickAction = () => {
    navigate("/select-parking-location");
  };

  useEffect(() => {
    const loadParkings = async () => {
      const coords = searchLocation || {
        latitude: viewState.latitude,
        longitude: viewState.longitude,
        distance: SEARCH_DISTANCE_KM,
      };
      const data = await getParkings(coords);

      // Filtrar solo mis parkings si está activado
      if (showOnlyMyParkings && user) {
        const filteredData = {
          ...data,
          features: data.features.filter(
            (f) => f.properties.ownerId === user.id,
          ),
        };
        setParkingsGeoJson(filteredData);
      } else {
        setParkingsGeoJson(data);
      }
      lastSearchCoordsRef.current = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    };
    loadParkings();
  }, [searchLocation, showOnlyMyParkings]);

  // Manejo de los clusters y puntos no agrupados
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
      const parkingName = feature.properties.name || "Aparcamiento";
      const ownerId = feature.properties.ownerId;
      const [longitude, latitude] = feature.geometry.coordinates;

      if (parkingId) {
        // Centrar el mapa en el aparcamiento clickeado con transición suave usando easeTo
        if (mapRef.current) {
          mapRef.current.easeTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 1500, // 1.5 segundos
            essential: true,
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
            latitude,
          });
        }
      }
    }
  };

  // Verificación de token (WCAG 3.3.5: Ayuda en caso de error)
  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="flex justify-center items-center h-screen text-red-600 font-semibold p-8"
        role="alert"
        aria-label="Error de Configuración: Token de Mapbox no configurado"
      >
        Error de Configuración: Token de Mapbox no configurado. Verifica tu
        archivo .env.
      </div>
    );
  }
  // const noop = () => {};

  return (
    <div className="relative w-full h-full ">
      {showWelcome && <WelcomeLanding onGuest={handleCloseWelcome} />}
      {showSearchHere && (
        <div className="absolute top-15 md:top-25 inset-x-0 z-20 flex justify-center pointer-events-none">
          <button
            onClick={handleSearchInThisArea}
            className="pointer-events-auto bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full shadow-xl border border-indigo-100 flex items-center gap-2 hover:bg-indigo-50 transition-all animate-bounce-short"
            aria-label="Buscar aparcamientos en esta nueva zona del mapa"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar en esta zona
          </button>
        </div>
      )}
      <title>QuikStop: Mapa </title>
      <h1
        className="justify-center place-self-center text-indigo-600"
        aria-label="QuikStop: Mapa de Aparcamientos"
        hidden
      >
        QuikStop: Mapa de Aparcamientos
      </h1>
      <h2
        className="justify-center place-self-center text-indigo-600"
        aria-label="Mapa interactivo de aparcamientos disponibles en QuikStop"
        hidden
      >
        Mapa interactivo de aparcamientos disponibles
      </h2>

      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        {...viewState}
        onMove={handleMapMove}
        mapStyle="mapbox://styles/mapbox/streets-v12"
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
        <Layer {...buildingLayer} />
        {/* Control de Búsqueda Geocoding */}
        {/* <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-left" marker="false" onLoading={noop} onResults={noop} onResult={noop} onError={noop} /> */}

        {/* Control de Geolocalización (Mi Ubicación) */}
        <GeolocateControl
          ref={geolocateControlRef}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserHeading={true}
          showAccuracyCircle={true}
          position="top-right"
          auto={true}
          aria-label="Localizar mi ubicación actual"
          style={{ marginRight: "35px", marginTop: "150px" }}
        />
        <ScaleControl />
        <NavigationControl
          position="top-right"
          style={{ marginRight: "35px", marginTop: "30px" }}
        />

        {/* Popup anclado al parking */}
        {quickViewModalState.isOpen && (
          <ParkingQuickViewPopup
            longitude={quickViewModalState.longitude}
            latitude={quickViewModalState.latitude}
            parkingId={quickViewModalState.parkingId}
            onClose={() =>
              setQuickViewModalState({
                isOpen: false,
                parkingId: null,
                longitude: null,
                latitude: null,
              })
            }
          />
        )}
      </Map>

      <MobileSearchBar
        onSearch={handleSearchMove}
        onGeolocate={handleGeolocateClick}
      />
      <DesktopSearchBar
        onSearch={handleSearchMove}
        onOwnerAddParking={handleAddParkingQuickAction}
        showOwnerAddParking={user?.role === "OWNER"}
      />

      {/* Botón flotante para filtrar mis aparcamientos - solo para OWNERS */}
      {user && user.role === "OWNER" && (
        <button
          onClick={() => setShowOnlyMyParkings(!showOnlyMyParkings)}
          className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 p-4 rounded-full shadow-lg transition-all duration-300 z-10 ${
            showOnlyMyParkings
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-white hover:bg-gray-100"
          }`}
          title={
            showOnlyMyParkings
              ? "Mostrar todos los aparcamientos"
              : "Mostrar solo mis plazas de aparcamiento"
          }
        >
          {showOnlyMyParkings ? (
            // Icono cuando está activo (filtro aplicado)
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Icono cuando está inactivo
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
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

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Eliminar Aparcamiento"
        message={
          confirmDialog.activeReservations > 0
            ? `Este aparcamiento tiene ${confirmDialog.activeReservations} reservas activas. Al eliminarlo, se cancelarán TODAS automáticamente. Esta acción no se puede deshacer.`
            : `¿Estás seguro de que quieres eliminar "${confirmDialog.parkingName}"? Esta acción no se puede deshacer.`
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />

      {/* Mensaje de estado */}
      <StatusMessage
        type={statusMessage.type}
        message={statusMessage.message}
        onClose={() => setStatusMessage({ type: null, message: "" })}
      />
    </div>
  );
}
