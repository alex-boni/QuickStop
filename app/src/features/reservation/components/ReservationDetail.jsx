import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getParkingById } from "../../parking/ParkingService";
import { getReservationById } from "../../reservation/ReservationService";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

const ReservationDetails = () => {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState(null);
  const [parking, setParking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resData = await getReservationById(reservationId);
        setReservation(resData);
        const parkData = await getParkingById(resData.parkingId);
        setParking(parkData);
      } catch (error) {
        console.error("Error al cargar detalles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [reservationId]);

  // Formateo de moneda estilo español
  const formatSpain = (num) => {
    return num.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Formateo de fecha para mostrar
  const displayDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="px-2 py-2 mt-8 md:mt-0 rounded-full text-sm font-bold  bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Confirmada
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-2 mt-8 md:mt-0 rounded-full text-sm font-bold  bg-blue-100 text-blue-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            Completada
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-2 mt-8 md:mt-0 rounded-full text-sm font-bold  bg-red-100 text-red-800">
            Cancelada
          </span>
        );
      case "NOT_COMPLETED":
        return (
          <span className="px-2 py-2 mt-8 md:mt-0 rounded-full text-sm font-bold  bg-red-100 text-red-800">
            No realizada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Desconocido
          </span>
        );
    }
  };

  if (isLoading)
    return (
      <div className="text-center max-w-6xl mx-4 md:mx-auto pt-16 md:py-8">
        <button
          onClick={() => navigate("/my-reservations")}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a mis reservas
        </button>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mt-12"></div>
      </div>
    );

  const startInfo = displayDateTime(reservation.startTime);
  const endInfo = displayDateTime(reservation.endTime);

  return (
    <div className="max-w-6xl mx-4 md:mx-auto pt-16 md:py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/my-reservations")}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a mis reservas
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reserva Detallada
            </h1>
            <p className="text-gray-600 mt-2">
              ID de reserva: #{reservationId}
            </p>
          </div>
          {getStatusBadge(reservation.status)}
        </div>
      </div>

      <div className="space-y-4">
        {/* Info del Parking */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 border border-gray-100">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-700">
              {parking.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{parking.address}</p>
            <div className="flex gap-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-bold">
                Tarifa aplicada: {formatSpain(parking.pricePerHour)} € / hora
              </span>
            </div>
          </div>
          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
            <Map
              initialViewState={{
                longitude: parking.longitude,
                latitude: parking.latitude,
                zoom: 14,
              }}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              interactive={false}
            >
              <Marker
                longitude={parking.longitude}
                latitude={parking.latitude}
                color="red"
              />
            </Map>
          </div>
        </div>

        {/* Bloque de Tiempos (Lectura) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200">
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
              Entrada
            </h3>
            <div className=" flex justify-between gap-8 bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              <p className="text-lg font-semibold text-gray-800">
                {startInfo.day}
              </p>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              <p className="text-lg text-gray-500">{startInfo.time}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-indigo-700 uppercase text-xs tracking-wider">
              Salida
            </h3>
            <div className="flex justify-between gap-8 bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center text-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-800">
                  {endInfo.day}
                </p>
              </div>
              <div className="flex items-center text-center gap-1">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg text-gray-500">{endInfo.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total y Resumen */}
        <div className="bg-indigo-700 text-white p-6 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider">
              Precio Total
            </p>
            <h2 className="text-3xl text-white ">
              {formatSpain(reservation.totalPrice)} €
            </h2>
          </div>
          <div className="text-right ">
            <p className="text-sm opacity-90">Pago</p>
            <p className="text-xs opacity-70">Gestionado por los usuarios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
