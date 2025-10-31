const MAPBOX_TOKEN = import.meta.env.VITE_API_MAP_BOX_KEY;

/**
 * Realiza una llamada a la API de Mapbox Geocoding para obtener sugerencias de autocompletado.
 * @param {string} query El texto que el usuario está escribiendo (ej: "Calle A").
 * @returns {Promise<Array>} Una promesa que resuelve con una lista de 'features' geocodificados.
 */
export const fetchGeocodingResults = async (query) => {
    if (!query || query.length < 3) {
        return [];
    }

    if (!MAPBOX_TOKEN) {
        console.error("Mapbox Token no configurado. Asegúrate de tener VITE_MAPBOX_ACCESS_TOKEN en tu .env");
        return [];
    }

    // autocomplete=true: Habilita sugerencias en tiempo real.
    // limit=5: Limita a 5 resultados para la lista desplegable.
    // language=es: Establece el idioma de los resultados a español (opcional).

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `autocomplete=true&` +
        `limit=5&` +
        `language=es`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error de Geocodificación: ${response.status} ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        return data.features || [];
    } catch (error) {
        console.error("Fallo al conectar con la API de Mapbox:", error);
        return [];
    }
};