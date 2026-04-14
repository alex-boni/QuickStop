import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getParkingById } from "../../parking/ParkingService";
import { createReservation } from "../../reservation/ReservationService";
import { useAuth } from "../../../context/AuthContext";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import StatusMessage from "../../../components/StatusMessage";
import { useLocation } from "react-router-dom";
import {
  getAvailableSpots,
  getNextAvailable,
} from "../../reservation/ReservationService";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

const ReservationForm = () => {
  const navigate = useNavigate();
  const { parkingId } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  const [parking, setParking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [issubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: null });

  // Estado para la disponibilidad dinámica y sugerencias
  const [dynamicAvailableSpots, setDynamicAvailableSpots] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const formatDate = (date) => {
    const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
  }

  const suggestedDate = location.state?.suggestedDate
    ? new Date(location.state.suggestedDate)
    : null;
  // --- Lógica de Restricciones de Tiempo ---
  const getInitialTimes = () => {
    const start = suggestedDate || new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    // console.log("Initial times set to:", { start, end });
    return {
      startDate: formatDate(start),
      startTime: start.toTimeString().slice(0, 5),
      endDate: formatDate(end),
      endTime: end.toTimeString().slice(0, 5),
    };
  };

  const [formData, setFormData] = useState(getInitialTimes());

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const data = await getParkingById(parkingId);
        setParking(data);
        setDynamicAvailableSpots(data.availableSpots);
      } catch (error) {
        setErrors({ submit: "No se pudo cargar la información del parking" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchParkingData();
  }, [parkingId]);

  const checkRealTimeAvailability = useCallback(async () => {
    // Validamos que las fechas sean correctas antes de hacer la consulta
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);

    if (isNaN(start) || isNaN(end) || end <= start) return;

    setCheckingAvailability(true);
    setSuggestion(null);

    // Intentamos obtener la disponibilidad actualizada para las fechas seleccionadas
    try {
      const reservationData = {
        parkingId: parseInt(parkingId),
        userId: user.id,
        startTime: toLocalISOString(start),
        endTime: toLocalISOString(end),
        totalPrice: parseFloat(calculateTotal()),
        status: "ACTIVE",
      };
      // LLamamos al servicio que calcula las plazas disponibles en tiempo real para el rango seleccionado
      const available = await getAvailableSpots(reservationData);
      setDynamicAvailableSpots(available);

      // Si no hay sitio, pedimos una sugerencia de próximo hueco
      if (available <= 0) {
        const nextSlot = await getNextAvailable(parkingId);
        setSuggestion(new Date(nextSlot));
      }
    } catch (error) {
      console.error("Error validando disponibilidad:", error);
    } finally {
      setCheckingAvailability(false);
    }
  }, [formData, parkingId]);

  // Efecto para disparar la validación cuando cambian las fechas
  useEffect(() => {
    const timer = setTimeout(() => {
      checkRealTimeAvailability();
    }, 500); // Debounce para no saturar el backend mientras el usuario escribe
    return () => clearTimeout(timer);
  }, [formData, checkRealTimeAvailability]);

  const applySuggestion = () => {
    if (!suggestion) return;
    const end = new Date(suggestion.getTime() + 60 * 60 * 1000);
    setFormData({
      startDate: formatDate(suggestion),
      startTime: suggestion.toTimeString().slice(0, 5),
      endDate: formatDate(end),
      endTime: end.toTimeString().slice(0, 5),
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  const calculateTotal = () => {
    if (!parking || !formData.endTime) return 0;
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return diffInHours > 0
      ? (diffInHours * parking.pricePerHour).toFixed(2)
      : 0;
  };
  const toLocalISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // diferencia en ms
    const localISOTime = new Date(date - offset).toISOString().slice(0, -1);
    return localISOTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const start = new Date(`${formData.startDate}T${formData.startTime}`);
    const end = new Date(`${formData.endDate}T${formData.endTime}`);

    let newErrors = {};

    // Entrada no puede ser anterior a "ahora"
    if (start < new Date(now.getTime() - 1000 * 60)) {
      // margen de 1 min
      newErrors.startTime = "La entrada no puede ser en el pasado";
    }

    // Restricción: Salida posterior a entrada
    if (end <= start) {
      newErrors.startTime = "La salida debe ser posterior a la entrada";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: null });
    try {
      const reservationData = {
        parkingId: parseInt(parkingId),
        userId: user.id,
        startTime: toLocalISOString(start),
        endTime: toLocalISOString(end),
        totalPrice: parseFloat(calculateTotal()),
        status: "ACTIVE",
      };
      // console.log("Creating reservation with data:", reservationData);
      await createReservation(reservationData);
      setStatus({
        type: "success",
        message: "Reserva confirmada. Redirigiendo...",
      });
      navigate("/my-reservations");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al procesar la reserva.";
      setStatus({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-indigo-600 font-bold">
        Cargando detalles del parking...
      </div>
    );

  return (
    <div className="max-w-6xl mx-4 md:mx-auto pt-16 md:py-8">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />
              <div className="mb-6">
          <button
            onClick={() => navigate("/")}
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
            Volver al mapa
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Confirmar Reserva</h1>
          <p className="text-gray-600 mt-2">
            Revisa los detalles antes de finalizar tu reserva
          </p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className="bg-white rounded-xl shadow-sm  p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-700">
              {parking.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">{parking.address}</p>
            <div className="flex gap-4">
              <span
                className={`px-2 py-1 rounded text-xs font-bold transition-colors ${dynamicAvailableSpots > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {checkingAvailability
                  ? "Comprobando..."
                  : `${dynamicAvailableSpots} plazas libres en este horario`}
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">
                {parking.pricePerHour}€ / hora
              </span>
            </div>
          </div>
          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden ">
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
        {dynamicAvailableSpots === 0 && suggestion && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex justify-between items-center animate-in fade-in zoom-in duration-300">
            <div className="text-sm text-amber-800">
              <p className="font-bold">Horario no disponible</p>
              <p>
                Próximo hueco:{" "}
                {suggestion.toLocaleString([], {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={applySuggestion}
              className="bg-amber-600 text-white px-3 py-3 rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              Aplicar sugerencia
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          {/* Inicio */}
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-700 flex items-center gap-2">
              Entrada
            </h3>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              min={formatDate(new Date())}
              onChange={handleChange}
              className={`w-40 md:w-full mr-4  p-3 border rounded-lg outline-none transition-all ${errors.startTime ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-40 md:w-full p-3 border rounded-lg outline-none transition-all ${errors.startTime ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs">{errors.startTime}</p>
            )}
          </div>

          {/* Fin */}
          <div className="space-y-3">
            <h3 className="font-bold text-indigo-700 flex items-center gap-2">
              Salida
            </h3>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className={`w-40 md:w-full  mr-4 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.endTime ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="time"
              id="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              className={`w-40 md:w-full  p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.endTime ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
        </div>

        {errors.endTime && (
          <p className="text-red-600 text-sm font-medium">{errors.endTime}</p>
        )}

        <div className="bg-indigo-700 text-white p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider">
              Total Estimado
            </p>
            <h2 className="text-3xl text-white">{calculateTotal()}€</h2>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Pago</p>
            <p className="text-xs opacity-70">Gestionado por los usuarios</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={
              issubmitting ||
              !formData.endTime ||
              (parking &&
                dynamicAvailableSpots <= 0 &&
                formData.startDate === new Date().toISOString().split("T")[0])
            }
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-md transition-all disabled:bg-gray-400 disabled:shadow-none"
          >
            {issubmitting
              ? "Procesando..."
              : dynamicAvailableSpots > 0
                ? "Confirmar Reserva"
                : "Sin plazas disponibles"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;
