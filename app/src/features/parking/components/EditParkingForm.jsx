import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParkingById, updateParking } from '../ParkingService';
import { useAuth } from '../../../context/AuthContext';

export default function EditParkingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [parking, setParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        availableSpots: 0,
        pricePerHour: 0,
        description: '',
        isActive: true
    });

    useEffect(() => {
        const fetchParking = async () => {
            try {
                setLoading(true);
                const data = await getParkingById(id);
                
                // Verificar que el usuario sea el owner
                if (data.ownerId !== user?.id) {
                    setError('No tienes permisos para editar este parking');
                    return;
                }
                
                setParking(data);
                setFormData({
                    name: data.name || '',
                    address: data.address || '',
                    availableSpots: data.availableSpots || 0,
                    pricePerHour: data.pricePerHour || 0,
                    description: data.description || '',
                    isActive: data.isActive ?? true
                });
            } catch (err) {
                setError('Error al cargar los detalles del parking');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchParking();
        }
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedData = {
                ...parking,
                ...formData,
                availableSpots: parseInt(formData.availableSpots),
                pricePerHour: parseFloat(formData.pricePerHour)
            };
            
            await updateParking(id, updatedData);
            setSuccess(true);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/my-parkings');
            }, 2000);
        } catch (err) {
            setError('Error al actualizar el parking');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const getInputClass = (field) => {
        return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando parking...</p>
            </div>
        );
    }

    if (error && !parking) {
        return (
            <div className="text-center py-8">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg inline-flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div className="text-left">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/my-parkings')}
                        className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Volver a mis parkings
                    </button>
                </div>
            </div>
        );
    }

    if (!parking) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No se encontró el parking</p>
                <button
                    onClick={() => navigate('/my-parkings')}
                    className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Volver a mis parkings
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Descripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Parking *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={getInputClass('name')}
                        placeholder="Ej: Parking Centro"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={getInputClass('address')}
                        placeholder="Dirección del parking"
                        disabled
                    />
                </div>
            </div>

            {/* Plazas y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Plazas *
                    </label>
                    <input
                        type="number"
                        id="availableSpots"
                        name="availableSpots"
                        value={formData.availableSpots}
                        onChange={handleChange}
                        required
                        min="0"
                        className={getInputClass('availableSpots')}
                        placeholder="Ej: 10"
                        disabled={saving}
                    />
                </div>

                <div>
                    <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (€/hora) *
                    </label>
                    <input
                        type="number"
                        id="pricePerHour"
                        name="pricePerHour"
                        value={formData.pricePerHour}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className={getInputClass('pricePerHour')}
                        placeholder="Ej: 2.50"
                        disabled={saving}
                    />
                </div>
            </div>

            {/* Descripción */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción (opcional)
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={getInputClass('description')}
                    placeholder="Describe las características del parking..."
                    disabled={saving}
                />
            </div>

            {/* Toggle Parking activo */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                    Parking activo
                </span>
                <label htmlFor="isActive" className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                        disabled={saving}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="text-sm font-medium text-green-800">¡Parking actualizado exitosamente!</p>
                        <p className="text-xs text-green-600">Redirigiendo a mis parkings...</p>
                    </div>
                </div>
            )}

            {error && parking && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="text-sm font-medium text-red-800">Error al actualizar el parking</p>
                        <p className="text-xs text-red-600">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {saving ? '⏳ Guardando...' : '✓ Guardar Cambios'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/my-parkings')}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
