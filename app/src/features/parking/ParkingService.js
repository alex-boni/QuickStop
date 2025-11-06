import apiClient from "../../services/apiClient";

const PARKING_ENDPOINTS = {
    GET_PARKINGS: 'parking/find-all',
    CREATE_PARKING: 'parking/create'
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



//EXPLICAR
export const createParking = async (parkingData) => {
    try {
        const response = await apiClient.post(PARKING_ENDPOINTS.CREATE_PARKING, parkingData);
        return response.data;
    } catch (error) {
        console.error("Error creating parking:", error);
        throw error;
    }
};
