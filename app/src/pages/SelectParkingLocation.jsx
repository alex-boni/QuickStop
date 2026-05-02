import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { useAuth } from "../context/AuthContext";
import { fetchReverseGeocodingAddress } from "../services/mapService";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

const MADRID_FALLBACK = {
  latitude: 40.4168,
  longitude: -3.7038,
  zoom: 15,
};

export default function SelectParkingLocation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.role?.toUpperCase() === "OWNER";

  const [viewState, setViewState] = useState(MADRID_FALLBACK);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: MADRID_FALLBACK.latitude,
    longitude: MADRID_FALLBACK.longitude,
  });
  const [selectedAddress, setSelectedAddress] = useState("Obteniendo dirección...");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!isOwner) {
      return;
    }

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextView = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          zoom: 15,
        };

        setViewState(nextView);
        setSelectedLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      () => {
        // Mantiene fallback en Madrid
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [isOwner]);

  useEffect(() => {
    let isCancelled = false;

    fetchReverseGeocodingAddress(selectedLocation.longitude, selectedLocation.latitude)
      .then((address) => {
        if (isCancelled) return;
        setSelectedAddress(address || "No se pudo determinar la dirección.");
      })
      .catch(() => {
        if (isCancelled) return;
        setSelectedAddress("No se pudo determinar la dirección.");
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedLocation.latitude, selectedLocation.longitude]);

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-md text-center">
          <h1 className="text-xl font-bold text-red-700">Acceso denegado</h1>
          <p className="mt-2 text-sm text-gray-700">
            Esta pantalla es solo para propietarios.
          </p>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handleMarkerDragEnd = (event) => {
    const { lng, lat } = event.lngLat;
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const handleConfirmContinue = () => {
    navigate("/addparking", {
      state: {
        coordinates: selectedLocation,
        address: selectedAddress,
      },
    });
  };

  return (
    <div className="relative h-screen w-full">
      <Map
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <Marker
          latitude={selectedLocation.latitude}
          longitude={selectedLocation.longitude}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          anchor="bottom"
        >
          <div className="text-4xl drop-shadow-lg" aria-hidden="true">
            📍
          </div>
        </Marker>
      </Map>

      <div className="fixed inset-x-0 bottom-0 z-20 p-4">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Confirmar ubicación
        </button>
      </div>

      {showConfirmModal && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-location-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="confirm-location-title" className="text-xl font-bold text-gray-900">
              Confirmar ubicación seleccionada
            </h2>

            <p className="mt-3 text-sm text-gray-700">
              <span className="font-semibold">Dirección:</span> {selectedAddress}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmContinue}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Confirmar y continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
