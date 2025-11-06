import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createParking } from "../ParkingService";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

const AddParkingForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        longitude: '',
        latitude: '',
        availableSpots: '',
        pricePerHour: '',
        description: '',
        ownerId: 1, // TODO: obtener del usuario autenticado
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [viewState, setViewState] = useState({
        latitude: 28.4682,
        longitude: -16.2546,
        zoom: 12
    });
    const [markerPosition, setMarkerPosition] = useState(null);
    const mapRef = useRef(null);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value,
        });
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleMapClick = (event) => {
        const { lngLat } = event;
        setMarkerPosition({
            longitude: lngLat.lng,
            latitude: lngLat.lat
        });
        setFormData(prev => ({
            ...prev,
            longitude: lngLat.lng.toString(),
            latitude: lngLat.lat.toString()
        }));
        setErrors(prev => ({ ...prev, longitude: null, latitude: null }));
    };

    const handleAddressSearch = async (searchText) => {
        if (!searchText || searchText.length < 3) return;
        
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
            );
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                const [lng, lat] = data.features[0].center;
                const placeName = data.features[0].place_name;
                
                setMarkerPosition({ longitude: lng, latitude: lat });
                setViewState(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 15 }));
                setFormData(prev => ({
                    ...prev,
                    longitude: lng.toString(),
                    latitude: lat.toString(),
                    address: placeName
                }));
                setErrors(prev => ({ ...prev, longitude: null, latitude: null, address: null }));
            }
        } catch (error) {
            console.error('Error buscando dirección:', error);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }

        if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = 'La dirección debe tener al menos 5 caracteres';
            isValid = false;
        }

        const longitude = parseFloat(formData.longitude);
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            newErrors.longitude = 'La longitud debe estar entre -180 y 180';
            isValid = false;
        }

        const latitude = parseFloat(formData.latitude);
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            newErrors.latitude = 'La latitud debe estar entre -90 y 90';
            isValid = false;
        }

        const spots = parseInt(formData.availableSpots);
        if (isNaN(spots) || spots <= 0) {
            newErrors.availableSpots = 'El número de plazas debe ser mayor a 0';
            isValid = false;
        }

        const price = parseFloat(formData.pricePerHour);
        if (isNaN(price) || price <= 0) {
            newErrors.pricePerHour = 'El precio debe ser mayor a 0';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('=== INICIO SUBMIT ===');
        console.log('FormData actual:', formData);
        console.log('Marker position:', markerPosition);
        
        if (!validateForm()) {
            console.error('Validación falló');
            return;
        }

        console.log('Validación OK');
        setIsLoading(true);
        setErrors({});
        setSuccess(false);
        
        try {
            const parkingData = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                longitude: parseFloat(formData.longitude),
                latitude: parseFloat(formData.latitude),
                availableSpots: parseInt(formData.availableSpots),
                pricePerHour: parseFloat(formData.pricePerHour),
                description: formData.description?.trim() || null,
                ownerId: formData.ownerId,
                isActive: formData.isActive
            };

            console.log('📤 Enviando datos:', parkingData);
            const response = await createParking(parkingData);
            console.log('✅ Respuesta del servidor:', response);
            
            setSuccess(true);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            console.error('Error code:', error.code);
            
            if (error.code === 'ECONNABORTED') {
                setErrors({
                    submit: 'El servidor no responde. Por favor, verifica que el backend esté activo.'
                });
            } else if (error.response?.status === 403) {
                setErrors({
                    submit: 'Acceso denegado. Verifica la configuración de seguridad del backend.'
                });
            } else if (error.response?.status === 409) {
                setErrors({
                    submit: 'Ya existe un parking en esta ubicación'
                });
            } else if (error.response?.status === 500) {
                setErrors({
                    submit: 'Error del servidor. Por favor, inténtelo de nuevo más tarde.'
                });
            } else if (error.response?.data?.message) {
                setErrors({
                    submit: `Error: ${error.response.data.message}`
                });
            } else {
                setErrors({
                    submit: `Error al crear el parking: ${error.message || 'Error desconocido'}`
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getInputClass = (field) => {
        return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 
            ${errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Descripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Parking *
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        required
                        onChange={handleChange}
                        className={getInputClass('name')}
                        placeholder="Ej: Parking Centro"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        disabled={isLoading}
                    />
                    {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600" aria-live="assertive">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción (opcional)
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={formData.description}
                        onChange={handleChange}
                        className={getInputClass('description')}
                        placeholder="Ej: Parking céntrico con vigilancia"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Dirección con buscador */}
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                </label>
                <div className="flex gap-2">
                    <input
                        id="address"
                        type="text"
                        value={formData.address}
                        required
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddressSearch(formData.address);
                            }
                        }}
                        className={getInputClass('address')}
                        placeholder="Busca una dirección..."
                        aria-invalid={!!errors.address}
                        aria-describedby={errors.address ? 'address-error' : undefined}
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => handleAddressSearch(formData.address)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors whitespace-nowrap"
                        disabled={isLoading}
                    >
                        🔍 Buscar
                    </button>
                </div>
                {errors.address && <p id="address-error" className="mt-1 text-xs text-red-600" aria-live="assertive">{errors.address}</p>}
                <p className="mt-1 text-xs text-gray-500">💡 Busca la dirección o haz click en el mapa</p>
            </div>

            {/* Mapa interactivo - más pequeño */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">📍 Selecciona la ubicación</p>
                    {markerPosition && (
                        <span className="text-xs text-green-600 font-medium">
                            ✓ Ubicación seleccionada
                        </span>
                    )}
                </div>
                <div style={{ height: '300px' }}>
                    <Map
                        ref={mapRef}
                        {...viewState}
                        onMove={evt => setViewState(evt.viewState)}
                        onClick={handleMapClick}
                        mapboxAccessToken={MAPBOX_TOKEN}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {markerPosition && (
                            <Marker
                                longitude={markerPosition.longitude}
                                latitude={markerPosition.latitude}
                                anchor="bottom"
                            >
                                <div className="text-3xl">📍</div>
                            </Marker>
                        )}
                    </Map>
                </div>
            </div>

            {/* Plazas y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Plazas *
                    </label>
                    <input
                        id="availableSpots"
                        type="number"
                        min="1"
                        value={formData.availableSpots}
                        required
                        onChange={handleChange}
                        className={getInputClass('availableSpots')}
                        placeholder="Ej: 10"
                        aria-invalid={!!errors.availableSpots}
                        aria-describedby={errors.availableSpots ? 'availableSpots-error' : undefined}
                        disabled={isLoading}
                    />
                    {errors.availableSpots && <p id="availableSpots-error" className="mt-1 text-xs text-red-600" aria-live="assertive">{errors.availableSpots}</p>}
                </div>

                <div>
                    <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (€/hora) *
                    </label>
                    <input
                        id="pricePerHour"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.pricePerHour}
                        required
                        onChange={handleChange}
                        className={getInputClass('pricePerHour')}
                        placeholder="Ej: 2.50"
                        aria-invalid={!!errors.pricePerHour}
                        aria-describedby={errors.pricePerHour ? 'pricePerHour-error' : undefined}
                        disabled={isLoading}
                    />
                    {errors.pricePerHour && <p id="pricePerHour-error" className="mt-1 text-xs text-red-600" aria-live="assertive">{errors.pricePerHour}</p>}
                </div>
            </div>

            {/* Toggle Parking activo */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                    Parking activo
                </span>
                <label htmlFor="isActive" className="relative inline-flex items-center cursor-pointer">
                    <input
                        id="isActive"
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                        disabled={isLoading}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="text-sm font-medium text-green-800">¡Parking creado exitosamente!</p>
                        <p className="text-xs text-green-600">Redirigiendo al mapa...</p>
                    </div>
                </div>
            )}

            {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="text-sm font-medium text-red-800">Error al crear el parking</p>
                        <p className="text-xs text-red-600">{errors.submit}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isLoading || !markerPosition}
                    className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? '⏳ Creando...' : '✓ Añadir Parking'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    disabled={isLoading}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default AddParkingForm;
