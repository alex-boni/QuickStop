import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getParkings, deleteParking } from '../features/parking/ParkingService';

export default function MyParkingsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMyParkings();
    }, []);

    const loadMyParkings = async () => {
        try {
            setLoading(true);
            // TODO: Crear endpoint en backend para obtener parkings por owner
            // Por ahora simulamos obteniendo todos y filtrando en frontend
            const allParkings = await getParkings({ 
                latitude: 40.4168, 
                longitude: -3.7038, 
                distance: 100 
            });
            
            // Filtrar solo mis parkings
            const myParkings = allParkings.features
                .filter(f => f.properties.ownerId === user?.id)
                .map(f => ({
                    id: f.properties.id,
                    name: f.properties.name,
                    ownerId: f.properties.ownerId,
                    spots: f.properties.spots,
                    price: f.properties.price,
                    available: f.properties.available,
                    latitude: f.geometry.coordinates[1],
                    longitude: f.geometry.coordinates[0]
                }));
            
            setParkings(myParkings);
        } catch (error) {
            console.error('Error cargando parkings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (parkingId, parkingName) => {
        if (window.confirm(`¿Estás seguro de eliminar "${parkingName}"?`)) {
            try {
                await deleteParking(parkingId);
                alert('Parking eliminado correctamente');
                loadMyParkings();
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar el parking');
            }
        }
    };

    const handleViewOnMap = (parking) => {
        navigate('/', {
            state: {
                centerOn: {
                    longitude: parking.longitude,
                    latitude: parking.latitude,
                    parkingId: parking.id
                }
            }
        });
    };

    const filteredParkings = parkings.filter(parking => {
        // Filtro por estado
        if (filter === 'active' && !parking.available) return false;
        if (filter === 'inactive' && parking.available) return false;
        
        // Filtro por búsqueda
        if (searchTerm && !parking.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al mapa
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Parkings</h1>
                    <p className="text-gray-600 mt-2">Gestiona todos tus parkings</p>
                </div>

                {/* Filtros y búsqueda */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Búsqueda */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Filtro por estado */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'all'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'active'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Activos
                            </button>
                            <button
                                onClick={() => setFilter('inactive')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'inactive'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Inactivos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando parkings...</p>
                    </div>
                )}

                {/* Lista vacía */}
                {!loading && filteredParkings.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm || filter !== 'all' ? 'No se encontraron parkings' : 'No tienes parkings'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filter !== 'all' 
                                ? 'Intenta con otros filtros' 
                                : 'Comienza agregando tu primer parking'}
                        </p>
                        {!searchTerm && filter === 'all' && (
                            <button
                                onClick={() => navigate('/addparking')}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                Agregar Parking
                            </button>
                        )}
                    </div>
                )}

                {/* Lista de parkings */}
                {!loading && filteredParkings.length > 0 && (
                    <div className="space-y-4">
                        {filteredParkings.map(parking => (
                            <div key={parking.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Info del parking */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{parking.name}</h3>
                                            {parking.available ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <span className="w-1.5 h-1.5 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <span className="w-1.5 h-1.5 mr-1.5 bg-red-400 rounded-full"></span>
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                </svg>
                                                <span>{parking.spots} plazas</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                </svg>
                                                <span>{parking.price}€/hora</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleViewOnMap(parking)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                        >
                                            Ver en mapa
                                        </button>
                                        <button
                                            onClick={() => navigate(`/parking/edit/${parking.id}`)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(parking.id, parking.name)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón flotante para agregar */}
                {!loading && (
                    <button
                        onClick={() => navigate('/addparking')}
                        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                        title="Agregar parking"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
