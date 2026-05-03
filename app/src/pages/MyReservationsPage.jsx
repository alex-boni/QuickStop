import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getUserReservations,
  cancelReservation,
  updateReservationStatus,
} from "../features/reservation/ReservationService";
import StatusMessage from "../components/StatusMessage";
import ConfirmDialog from "../components/ConfirmDialog";
import { getParkingById } from "../features/parking/ParkingService";
export default function MyReservationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para notificaciones unificadas
  const [status, setStatus] = useState({ type: null, message: null });
  // Estados adicionales para la confirmación de cancelación
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    resId: null,
    parkingName: "",
  });

  const triggerCancel = (e, id, parkingName) => {
    e.stopPropagation();
    setConfirmState({ isOpen: true, resId: id, parkingName });
  };
  // Función para formatear números al estilo español Ej: 1234.56 => "1.234,56"
  const formatSpain = (num) => {
    const parsedNum = num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return parsedNum.replace(/,/g, "X").replace(/\./g, ",").replace(/X/g, ".");
  };
  // Función para formatear fecha y hora al estilo español Ej: "2024-06-30T14:30:00" => "30/06/2024 14:30"
  const formatDateTimeSpain = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleViewOnMap = async (e, res) => {
    e.stopPropagation();
    // promise to data
    const parkingReservation = await getParkingById(res.parkingId);

    navigate("/", {
      state: {
        centerOn: {
          latitude: parkingReservation.latitude,
          longitude: parkingReservation.longitude,
        },
        isReservation: true,
        parkingId: res.parkingId,
      },
    });
  };

  const handleConfirmCancel = async (e) => {
    e.stopPropagation();
    const { resId } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false }); // Cerrar modal inmediatamente

    try {
      await cancelReservation(resId);
      setStatus({
        type: "success",
        message: "Reserva cancelada correctamente.",
      });
      loadMyReservations();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      setStatus({
        type: "error",
        message: "No se pudo procesar la cancelación.",
      });
    }
  };
  useEffect(() => {
    if (user?.id) {
      loadMyReservations();
    }
  }, [user]);

  const loadMyReservations = async () => {
    try {
      setLoading(true);
      const data = await getUserReservations(user.id);
      setReservations(data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setStatus({
        type: "error",
        message:
          "Error al conectar con el servidor. No se pudieron cargar las reservas.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e, id, newStatus) => {
    e.stopPropagation();
    try {
      await updateReservationStatus(id, newStatus);
      setStatus({
        type: "success",
        message: `Reserva marcada como ${newStatus === "COMPLETED" ? "realizada" : "no realizada"}.`,
      });
      loadMyReservations();
    } catch (error) {
      console.error("Error al actualizar estado de reserva:", error);
      setStatus({ type: "error", message: "Error al actualizar el estado." });
    }
  };
  const isPastReservation = (endTime) => {
    return new Date() > new Date(endTime);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Reservada
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            Completada
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelada
          </span>
        );
      case "NOT_COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-400">
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

  const filteredReservations = reservations.filter((res) => {
    if (filter === "active" && res.status !== "ACTIVE") return false;
    if (filter === "completed" && res.status !== "COMPLETED") return false;
    if (
      filter === "cancelled" &&
      res.status !== "CANCELLED" &&
      res.status !== "NOT_COMPLETED"
    )
      return false;

    if (
      searchTerm &&
      !res.parkingName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Componente de notificaciones flotante */}
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="¿Cancelar reserva?"
        message={`Esta acción cancelará su reserva de la plaza en "${confirmState.parkingName}". Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmCancel}
        onCancel={() =>
          setConfirmState({ isOpen: false, resId: null, parkingName: "" })
        }
        type="danger"
      />

      <div className="max-w-6xl mx-auto pt-8 md:py-0">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">
            Controle sus reservas de aparcamiento y pagos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1  p-2">
              <input
                type="text"
                placeholder="Buscar por aparcamiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto p-2 ">
              {["all", "active", "completed", "cancelled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f === "all"
                    ? "Todas"
                    : f === "active"
                      ? "Activas"
                      : f === "completed"
                        ? "Hechas"
                        : "Canceladas"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900">
              No hay reservas
            </h3>
            <p className="text-gray-600 mt-2">
              ¿Necesitas aparcar? Busca un sitio en el mapa.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                tabIndex="0" // Permite seleccionar con el tabulador
                role="button" // Indica a los lectores de pantalla que actúa como un botón
                aria-label={`Ver detalles de la reserva en ${res.parkingName}`}
                onClick={() => navigate(`/reservation/details/${res.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/reservation/details/${res.id}`);
                  }
                }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-100 transition-shadow p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {res.parkingName}
                      </h3>
                      <div className="flex items-center justify-end gap-3 ml-auto md:ml-0">
                        {getStatusBadge(res.status)}

                        {/* ICONO para ver en mapa */}
                        {res.status === "ACTIVE" && (
                          <button
                            onClick={(e) => handleViewOnMap(e, res)}
                            className="md:hidden p-0.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                            title="Ver en mapa"
                          >
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
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
                        <span>
                          Entrada: {formatDateTimeSpain(res.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <span>Salida: {formatDateTimeSpain(res.endTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t border-gray-300 md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                        Precio Total
                      </p>
                      <p className="text-2xl font-black text-indigo-700">
                        {formatSpain(res.totalPrice)} €
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {res.status === "ACTIVE" &&
                        isPastReservation(res.endTime) && (
                          <>
                            <button
                              onClick={(e) => handleViewOnMap(e, res)}
                              className="hidden md:flex px-4 py-2 bg-white border-2 border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-bold text-sm items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                              </svg>
                              Ver en mapa
                            </button>
                            <button
                              onClick={(e) =>
                                handleUpdateStatus(e, res.id, "COMPLETED")
                              }
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2 font-bold text-sm shadow-sm"
                              title="Confirmar que usé la plaza"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="22" // Ligeramente más grande para que destaque
                                height="22"
                                style={{ flexShrink: 0, display: "block" }} // Evita deformaciones y espacios fantasma
                              >
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                              </svg>
                              Hecho!
                            </button>
                            <button
                              onClick={(e) =>
                                handleUpdateStatus(e, res.id, "NOT_COMPLETED")
                              }
                              className="px-4 py-2 border-2 border-gray-200 hover:border-gray-400 text-gray-500 rounded-lg hover:bg-gray-300  transition-colors font-bold text-sm"
                              title="No pude usar la plaza"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="22"
                                height="22"
                                style={{ flexShrink: 0, display: "block" }}
                              >
                                <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
                              </svg>
                              No usada
                            </button>
                          </>
                        )}
                      {res.status === "ACTIVE" &&
                        !isPastReservation(res.endTime) && (
                          <button
                            onClick={(e) =>
                              triggerCancel(e, res.id, res.parkingName)
                            }
                            className="px-4 py-2 border-2 border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      {res.status === "ACTIVE" &&
                        !isPastReservation(res.endTime) && (
                          <button
                            onClick={() =>
                              navigate(`/reservation/details/${res.id}`)
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
                          >
                            Detalles
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
