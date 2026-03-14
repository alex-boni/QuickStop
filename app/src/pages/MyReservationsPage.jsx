import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserReservations, cancelReservation } from '../features/reservation/ReservationService';
import StatusMessage from '../components/StatusMessage';
import ConfirmDialog from '../components/ConfirmDialog';
export default function MyReservationsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado para notificaciones unificadas
    const [status, setStatus] = useState({ type: null, message: null });
// 1. Estados adicionales para la confirmación de cancelación
const [confirmState, setConfirmState] = useState({ isOpen: false, resId: null, parkingName: '' });

const triggerCancel = (id, parkingName) => {
    setConfirmState({ isOpen: true, resId: id, parkingName });
};

const handleConfirmCancel = async () => {
    const { resId } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false }); // Cerrar modal inmediatamente
    
    try {
        await cancelReservation(resId);
        setStatus({ type: 'success', message: 'Reserva cancelada correctamente.' });
        loadMyReservations();
    } catch (error) {
        setStatus({ type: 'error', message: 'No se pudo procesar la cancelación.' });
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
            // El ID viene del contexto de auth
            const data = await getUserReservations(user.id);
            setReservations(data);
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: 'Error al conectar con el servidor. No se pudieron cargar las reservas.' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id, parkingName) => {
        // Mantenemos el confirm para evitar cancelaciones accidentales
        if (window.confirm(`¿Seguro que quieres cancelar tu reserva en "${parkingName}"?`)) {
            try {
                await cancelReservation(id);
                setStatus({ type: 'success', message: 'Reserva cancelada correctamente.' });
                loadMyReservations();
            } catch (error) {
                setStatus({ type: 'error', message: 'No se pudo procesar la cancelación.' });
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        Activa
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Cancelada
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Finalizada
                    </span>
                );
        }
    };

    const filteredReservations = reservations.filter(res => {
        if (filter === 'active' && res.status !== 'ACTIVE') return false;
        if (filter === 'completed' && res.status !== 'COMPLETED') return false;
        if (filter === 'cancelled' && res.status !== 'CANCELLED') return false;
        
        if (searchTerm && !res.parkingName.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Componente de notificaciones flotante */}
            <StatusMessage 
                type={status.type} 
                message={status.message} 
                onClose={() => setStatus({ type: null, message: null })} 
            />
            <ConfirmDialog 
        isOpen={confirmState.isOpen}
        title="¿Cancelar reserva?"
        message={`Esta acción cancelará tu plaza en "${confirmState.parkingName}". No se puede deshacer.`}
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmState({ isOpen: false, resId: null, parkingName: '' })}
        type="danger"
    />
    

            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al mapa
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
                    <p className="text-gray-600 mt-2">Controla tus estacionamientos y pagos</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por parking..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {['all', 'active', 'completed', 'cancelled'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all ${
                                        filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : f === 'completed' ? 'Hechas' : 'Canceladas'}
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
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900">No hay reservas</h3>
                        <p className="text-gray-600 mt-2">¿Necesitas aparcar? Busca un sitio en el mapa.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReservations.map(res => (
                            <div key={res.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">{res.parkingName}</h3>
                                            {getStatusBadge(res.status)}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Entrada: {new Date(res.startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Salida: {new Date(res.endTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Pagado</p>
                                            <p className="text-2xl font-black text-indigo-700">{res.totalPrice}€</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {res.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => triggerCancel(res.id, res.parkingName)}
                                                    className="px-4 py-2 border-2 border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold text-sm"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/parking/${res.parkingId}`)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
                                            >
                                                Detalles
                                            </button>
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