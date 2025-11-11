import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParkingById } from '../ParkingService';

export default function ViewParkingDetailsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [parking, setParking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParking = async () => {
            try {
                setLoading(true);
                const data = await getParkingById(id);
                setParking(data);
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
    }, [id]);

    if (loading) {
        return <div className="text-center p-4">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }

    if (!parking) {
        return <div className="text-center p-4">No se encontró el parking</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    id="name"
                    value={parking.name || ''}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                </label>
                <input
                    type="text"
                    id="address"
                    value={parking.address || ''}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                    Plazas disponibles
                </label>
                <input
                    type="text"
                    id="availableSpots"
                    value={parking.availableSpots || '0'}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por hora
                </label>
                <input
                    type="text"
                    id="pricePerHour"
                    value={parking.pricePerHour ? `${parking.pricePerHour}€` : 'N/A'}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    id="description"
                    value={parking.description || 'Sin descripción'}
                    readOnly
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                </label>
                <input
                    type="text"
                    id="isActive"
                    value={parking.isActive ? 'Activo' : 'Inactivo'}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}