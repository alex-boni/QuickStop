import apiClient from "../../services/apiClient";

const PARKING_ENDPOINTS = {
    GET_PARKINGS: 'parking/find-all',
    GET_PARKING_BY_ID: 'parking',
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
                    name: parking.name,
                    ownerId: parking.ownerId,
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



export const getParkingById = async (id) => {
    try {
        const response = await apiClient.get(`${PARKING_ENDPOINTS.GET_PARKING_BY_ID}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching parking by ID:", error);
        throw error;
    }
};

export const updateParking = async (id, parkingData) => {
    try {
        const response = await apiClient.put(`${PARKING_ENDPOINTS.GET_PARKING_BY_ID}/${id}`, parkingData);
        return response.data;
    } catch (error) {
        console.error("Error updating parking:", error);
        throw error;
    }
};

export const createParking = async (parkingData) => {
    try {
        const response = await apiClient.post(PARKING_ENDPOINTS.CREATE_PARKING, parkingData);
        return response.data;
    } catch (error) {
        console.error("Error creating parking:", error);
        throw error;
    }
};

export const deleteParking = async (id) => {
    try {
        const response = await apiClient.delete(`${PARKING_ENDPOINTS.GET_PARKING_BY_ID}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting parking:", error);
        throw error;
    }
};
