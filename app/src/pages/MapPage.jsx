import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WelcomeLanding from "../components/WelcomeLanding";
import OwnerParkingQuickViewPopup from "../features/parking/components/OwnerParkingQuickViewPopup";
import ParkingDetailsModal from "../features/parking/components/ParkingDetailsModal";
import ParkingQuickViewPopup from "../features/parking/components/ParkingQuickViewPopup";
import {
  deleteParking,
  getParkingById,
  getParkingDeleteInfo,
  updateParking,
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
import { hasOwnerRole } from "../features/auth/roleUtils";

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
    parkingIds: [],
    longitude: null,
    latitude: null,
    parkingName: "",
  });

  // Estado para confirmación de cambios (eliminar/reactivar)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    parkingId: null,
    title: "",
    message: "",
    type: "", // "delete" para eliminar, "reactivate" para reactivar
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
    parkingIds: [],
    longitude: null,
    latitude: null,
  });

  const [showWelcome, setShowWelcome] = useState(false);
  const [isPickingNewParkingOnMap, setIsPickingNewParkingOnMap] =
    useState(false);

  const openModal = (parkingIds, parkingName, longitude, latitude) => {
    setModalState({
      isOpen: true,
      parkingIds,
      parkingName,
      longitude,
      latitude,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
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

  const handleViewDetails = (id) => {
    closeModal();
    setDetailsModalState({ isOpen: true, parkingId: id });
  };

  const handleEdit = (id) => {
    navigate(`/parking/edit/${id}`);
    closeModal();
  };

  const handleDelete = async (id, name) => {
    try {
      const info = await getParkingDeleteInfo(id);
      setConfirmDialog({
        isOpen: true,
        parkingId: id,
        title: "Eliminar Aparcamiento",
        message: `¿Estás seguro de que quieres eliminar el aparcamiento "${name}"? ${info.activeReservations > 0 ? `Tiene ${info.activeReservations} reservas activas que serán canceladas.` : "No tiene reservas activas."}`,
        type: "delete",
      });
      closeModal();
    } catch (error) {
      console.error("Error al obtener información de eliminación:", error);
      setStatusMessage({
        type: "error",
        message: "Error al obtener información.",
      });
    }
  };


  const handleReactivate = async (id, name) => {
    try {
      setConfirmDialog({
        isOpen: true,
        parkingId: id,
        title: "Reactivar Aparcamiento",
        message: `¿Estás seguro de que quieres reactivar el aparcamiento "${name}"?`,
        type: "reactivate",
      });
      closeModal();
    } catch (error) {
      console.error("Error al obtener información de eliminación:", error);
      setStatusMessage({
        type: "error",
        message: "Error al obtener información.",
      });
    }
  }

  const confirmReactivate = async () => {
    const { parkingId } = confirmDialog;
    try {      
      let parking = await getParkingById(parkingId);
      if (parking) {
        parking.isActive=true;
      }
      await updateParking(parkingId, parking);
      const message = "Aparcamiento reactivado exitosamente.";
      setStatusMessage({
        type: "success",
        message,
      });
    } catch (error) {
      console.error("Error al reactivar aparcamiento:", error);
      setStatusMessage({
        type: "error",
        message: "Error al reactivar el aparcamiento. Inténtalo de nuevo.",
      });
    } finally {
      setConfirmDialog({
        isOpen: false,
        parkingId: null,
        title: "",
        message: "",
        type: "",
      });
    }
  }

  const confirmDelete = async () => {
    const { parkingId } = confirmDialog;

    try {
      await deleteParking(parkingId);

      const message = "Aparcamiento eliminado exitosamente.";

      setStatusMessage({
        type: "success",
        message,
      });
      handleSearchInThisArea(); // Refrescar la búsqueda para actualizar el mapa
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
        title: "",
        message: "",
        type: "",
      });
    }
  };

  const cancel = () => {
    setConfirmDialog({
      isOpen: false,
      parkingId: null,
      title: "",
      message: "",
      type: "",
    });
  };

  useEffect(() => {
    const hasAutoLocated = sessionStorage.getItem("hasAutoLocated");
    const savedView = sessionStorage.getItem("lastMapView");
    const centerOn = location.state?.centerOn;
    const focusedParkingId =
      location.state?.parkingId ?? location.state?.centerOn?.parkingId ?? null;
    const shouldOpenParkingPopup =
      Boolean(location.state?.openParkingPopup) || Boolean(location.state?.isReservation);

    if (centerOn) {
      const { latitude, longitude } = centerOn;
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

      if (focusedParkingId && shouldOpenParkingPopup) {
        if (hasOwnerRole(user?.role)) {
          setModalState({
            isOpen: true,
            parkingIds: [focusedParkingId],
            longitude,
            latitude,
            parkingName: "",
          });
        } else {
          setQuickViewModalState({
            isOpen: true,
            parkingIds: [focusedParkingId],
            longitude,
            latitude,
          });
        }
      }

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
    setIsPickingNewParkingOnMap(true);
  };

  const handleAddParkingAtCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatusMessage({
        type: "error",
        message: "Tu navegador no permite obtener la ubicación actual.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextViewState = {
          ...viewState,
          latitude: coords.latitude,
          longitude: coords.longitude,
          zoom: 16,
          transitionDuration: 1200,
        };
        setViewState(nextViewState);
        setSearchLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          distance: SEARCH_DISTANCE_KM,
        });
        setIsPickingNewParkingOnMap(true);
      },
      () => {
        setStatusMessage({
          type: "error",
          message: "No se pudo obtener tu ubicación actual.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const handleCancelAddParkingOnMap = () => {
    setIsPickingNewParkingOnMap(false);
  };

  const handleConfirmAddParkingOnMap = () => {
    navigate("/addparking", {
      state: {
        coordinates: {
          latitude: viewState.latitude,
          longitude: viewState.longitude,
        },
      },
    });
  };

  useEffect(() => {
    const loadParkings = async () => {
      const coords = searchLocation || {
        ...viewState,
        distance: SEARCH_DISTANCE_KM,
      };
      const data = await getParkings(coords);
      if (showOnlyMyParkings && user) {
        setParkingsGeoJson({
          ...data,
          features: data.features.filter(
            (f) => f.properties.ownerId === user.id,
          ),
        });
      } else {
        setParkingsGeoJson(data);
      }
    };
    loadParkings();
  }, [searchLocation, showOnlyMyParkings, user]);

  // Manejo de los clusters y puntos no agrupados
  const onClick = (event) => {
    if (isPickingNewParkingOnMap) return;

    if (!event.features || event.features.length === 0) {
      setQuickViewModalState((prev) => ({ ...prev, isOpen: false }));
      setModalState((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    const feature = event.features[0];
    if (event.originalEvent) event.originalEvent.stopPropagation();

    if (feature.layer.id === clusterLayer.id) {
      const clusterId = feature.properties.cluster_id;
      mapRef.current
        .getSource("parkings")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (!err)
            setViewState({
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0],
              zoom,
              transitionDuration: 500,
            });
        });
      return;
    }

    if (feature.layer.id === unclusteredPointLayer.id) {
      const allFeaturesAtPoint = event.features.filter(
        (f) => f.layer.id === unclusteredPointLayer.id,
      );
      const [longitude, latitude] = feature.geometry.coordinates;
      const parkingIds = allFeaturesAtPoint.map((f) => f.properties.id);

      if (mapRef.current) {
        mapRef.current.easeTo({
          center: [longitude, latitude],
          zoom: 16,
          duration: 1000,
        });
      }

      // Si el primero de la lista es del usuario actual, tratamos el grupo como "propios"
      if (user && user.id === feature.properties.ownerId) {
        openModal(parkingIds, feature.properties.name, longitude, latitude);
      } else {
        setQuickViewModalState({
          isOpen: true,
          parkingIds,
          longitude,
          latitude,
        });
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
      {isPickingNewParkingOnMap && (
        <>
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div className="text-5xl drop-shadow-xl" aria-hidden="true">
              📍
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-20 z-30 px-4">
            <div className="mx-auto max-w-lg rounded-xl bg-white/95 border border-indigo-100 shadow-2xl p-4">
              <p className="text-sm text-gray-700">
                Mueve el mapa y coloca el pin en el centro para seleccionar la
                ubicación de la nueva plaza.
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancelAddParkingOnMap}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddParkingOnMap}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Confirmar ubicación
                </button>
              </div>
            </div>
          </div>
        </>
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
            parkingIds={quickViewModalState.parkingIds}
            onClose={() =>
              setQuickViewModalState({ ...quickViewModalState, isOpen: false })
            }
          />
        )}
        {modalState.isOpen && hasOwnerRole(user?.role) && (
          <OwnerParkingQuickViewPopup
            longitude={modalState.longitude}
            latitude={modalState.latitude}
            parkingIds={modalState.parkingIds}
            onClose={closeModal}
            onView={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReactivate={handleReactivate}
          />
        )}
      </Map>

      <MobileSearchBar
        onSearch={handleSearchMove}
        onGeolocate={handleGeolocateClick}
        onOwnerAddParking={handleAddParkingQuickAction}
        onOwnerAddParkingAtCurrentLocation={handleAddParkingAtCurrentLocation}
      />
      <DesktopSearchBar
        onSearch={handleSearchMove}
        onOwnerAddParking={handleAddParkingQuickAction}
        onOwnerAddParkingAtCurrentLocation={handleAddParkingAtCurrentLocation}
        showOwnerAddParking={hasOwnerRole(user?.role)}
      />

      {/* Botón flotante para filtrar mis aparcamientos - solo para OWNERS */}
      {user && hasOwnerRole(user.role) && (
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

      <ParkingDetailsModal
        isOpen={detailsModalState.isOpen}
        onClose={() => setDetailsModalState({ isOpen: false, parkingId: null })}
        parkingId={detailsModalState.parkingId}
      />

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.type === "delete" ? confirmDelete : confirmReactivate}
        onCancel={cancel}
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
