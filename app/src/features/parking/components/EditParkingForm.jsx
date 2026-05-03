import { useState, useEffect, useRef } from 'react';
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
    const [loadError, setLoadError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [showDescriptionHelp, setShowDescriptionHelp] = useState(false);
    const backButtonRef = useRef(null);
    const redirectTimeoutRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        availableSpots: 0,
        pricePerHour: 0,
        description: '',
        isActive: true
    });

    const getApiErrorMessage = (err, fallbackMessage) => {
        if (err?.code === 'ECONNABORTED') {
            return 'El servidor no responde. Verifica que el backend esté activo.';
        }

        const status = err?.response?.status;
        if (status === 400) return 'Los datos enviados no son válidos.';
        if (status === 401) return 'Tu sesión ha caducado. Inicia sesión de nuevo.';
        if (status === 403) return 'No tienes permisos para editar este aparcamiento.';
        if (status === 404) return 'No se encontró el aparcamiento solicitado.';
        if (status === 409) return 'No se puede guardar: hay un conflicto con el estado actual.';
        if (status >= 500) return 'Error interno del servidor. Inténtalo más tarde.';

        if (typeof err?.response?.data?.message === 'string' && err.response.data.message.trim()) {
            return err.response.data.message;
        }

        return fallbackMessage;
    };

    useEffect(() => {
        const fetchParking = async () => {
            try {
                setLoading(true);
                setLoadError(null);
                const data = await getParkingById(id);
                
                // Verificar que el usuario sea el owner
                if (data.ownerId !== user?.id) {
                    setLoadError('No tienes permisos para editar este aparcamiento');
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
                setLoadError(getApiErrorMessage(err, 'Error al cargar los detalles del aparcamiento'));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchParking();
        }
    }, [id, user]);

    useEffect(() => {
        if (!success) {
            return;
        }

        backButtonRef.current?.focus();
        redirectTimeoutRef.current = setTimeout(() => {
            navigate('/my-parkings');
        }, 2000);

        return () => {
            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, [success, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
        if (submitError) {
            setSubmitError(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
        }

        const spots = Number.parseInt(formData.availableSpots, 10);
        if (Number.isNaN(spots) || spots <= 0) {
            newErrors.availableSpots = 'El número de plazas debe ser mayor que 0.';
        }

        const price = Number.parseFloat(formData.pricePerHour);
        if (Number.isNaN(price) || price <= 0) {
            newErrors.pricePerHour = 'El precio por hora debe ser mayor que 0.';
        }

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
        }
        setSaving(true);
        setSubmitError(null);
        setSuccess(false);

        try {
            const updatedData = {
                ...parking,
                ...formData,
                availableSpots: Number.parseInt(formData.availableSpots, 10),
                pricePerHour: Number.parseFloat(formData.pricePerHour)
            };
            
            await updateParking(id, updatedData);
            setSuccess(true);
        } catch (err) {
            setSubmitError(getApiErrorMessage(err, 'Error al actualizar el aparcamiento'));
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const getInputClass = (field) => {
        return `w-full p-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
            fieldErrors[field]
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        }`;
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando aparcamiento...</p>
            </div>
        );
    }

    if (loadError && !parking) {
        return (
            <div className="text-center py-8">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg inline-flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div className="text-left">
                        <p className="text-sm font-medium text-red-800">{loadError}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => navigate('/my-parkings')}
                        className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Volver a mis plazas de aparcamiento
                    </button>
                </div>
            </div>
        );
    }

    if (!parking) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No se encontró el aparcamiento</p>
                <button
                    onClick={() => navigate('/my-parkings')}
                    className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Volver a mis plazas de aparcamiento
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
                        Nombre del Aparcamiento *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={getInputClass('name')}
                        placeholder="Ej: Aparcamiento Centro"
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                        disabled={saving}
                    />
                    {fieldErrors.name && (
                        <p id="name-error" className="mt-1 text-xs text-red-600" aria-live="assertive">
                            {fieldErrors.name}
                        </p>
                    )}
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
                        placeholder="Dirección del aparcamiento"
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
                        aria-invalid={!!fieldErrors.availableSpots}
                        aria-describedby={fieldErrors.availableSpots ? 'availableSpots-error' : undefined}
                        disabled={saving}
                    />
                    {fieldErrors.availableSpots && (
                        <p id="availableSpots-error" className="mt-1 text-xs text-red-600" aria-live="assertive">
                            {fieldErrors.availableSpots}
                        </p>
                    )}
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
                        placeholder="Introduce el coste de la plaza por hora"
                        aria-invalid={!!fieldErrors.pricePerHour}
                        aria-describedby={fieldErrors.pricePerHour ? 'pricePerHour-error' : undefined}
                        disabled={saving}
                    />
                    {fieldErrors.pricePerHour && (
                        <p id="pricePerHour-error" className="mt-1 text-xs text-red-600" aria-live="assertive">
                            {fieldErrors.pricePerHour}
                        </p>
                    )}
                </div>
            </div>

            {/* Descripción */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción (opcional)
                    </label>
                    <button
                        type="button"
                        className="w-5 h-5 rounded-full border border-gray-300 text-xs font-bold text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Mostrar información sobre la descripción"
                        aria-expanded={showDescriptionHelp}
                        aria-controls="description-help-edit-parking"
                        onClick={() => setShowDescriptionHelp(prev => !prev)}
                    >
                        i
                    </button>
                </div>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={getInputClass('description')}
                    placeholder="Introduce una breve descripción del tipo de aparcamiento"
                    disabled={saving}
                />
                {showDescriptionHelp && (
                    <p id="description-help-edit-parking" className="mt-2 text-xs text-gray-600">
                        Puedes indicar datos útiles como el tipo de plaza (garaje, urbanización o casa), si tiene vigilancia, el acceso y cualquier restricción.
                    </p>
                )}
            </div>

            {/* Toggle disponibilidad de reservas */}
            <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                            Disponible para reservar
                        </span>
                        <button
                            type="button"
                            className="w-5 h-5 rounded-full border border-gray-300 text-xs font-bold text-gray-600 bg-white"
                            title="Activado: los usuarios pueden reservar esta plaza. Desactivado: no acepta nuevas reservas."
                            aria-label="Información sobre disponibilidad para reservar"
                        >
                            i
                        </button>
                    </div>
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
                <p className="mt-2 text-xs text-gray-600">
                    {formData.isActive
                        ? "Esta plaza está disponible y puede recibir reservas."
                        : "Esta plaza no acepta nuevas reservas."}
                </p>
            </div>

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                        <p className="text-sm font-medium text-green-800">Cambios guardados.</p>
                    </div>
                </div>
            )}

            {submitError && parking && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="text-sm font-medium text-red-800">Error al actualizar el aparcamiento</p>
                        <p className="text-xs text-red-600">{submitError}</p>
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
                    ref={backButtonRef}
                    disabled={saving}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Volver
                </button>
            </div>
        </form>
    );
}
