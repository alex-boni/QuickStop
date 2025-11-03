import apiClient from "../../services/apiClient";
//Definicion de Endpoints
const PARKING_ENDPOINTS = {
    GET_PARKINGS: '/parking/find-all'
    //Aqui se pueden añadir mas endpoints relacionados con parkings
}

export const getParkings = async () => {
    try {
        const response = await apiClient.get(PARKING_ENDPOINTS.GET_PARKINGS);
        const parkings = {
            type: "FeatureCollection",
            features: response.data.map(parking => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [parking.longitude, parking.latitude]
                },
                properties: {
                    id: parking.id,
                    name: parking.owner,
                    spots: parking.spots,
                    price: parking.price,
                    available: parking.available,
                }
            }))
        };
        return parkings;
    } catch (error) {
        console.error("Error fetching parkings:", error);
        throw error;
    }
};

