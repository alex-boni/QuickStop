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

        try {
            const updatedData = {
                ...parking,
                ...formData,
                availableSpots: parseInt(formData.availableSpots),
                pricePerHour: parseFloat(formData.pricePerHour)
            };
            
            await updateParking(id, updatedData);
            alert('Parking actualizado correctamente');
            navigate('/', { replace: true });
        } catch (err) {
            setError('Error al actualizar el parking');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center p-4">Cargando...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                    Volver
                </button>
            </div>
        );
    }

    if (!parking) {
        return <div className="text-center p-4">No se encontró el parking</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                    Plazas disponibles *
                </label>
                <input
                    type="number"
                    id="availableSpots"
                    name="availableSpots"
                    value={formData.availableSpots}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por hora (€) *
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe las características del parking..."
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Parking activo
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => navigate(`/parking/${id}`)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={saving}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                    disabled={saving}
                >
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
