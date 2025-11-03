import apiClient from "../../services/apiClient";
export const EMPTY_GEOJSON = {
    type: "FeatureCollection",
    features: []
};
//Definicion de Endpoints
const PARKING_ENDPOINTS = {
    GET_ALL_PARKINGS: '/parking/find-all'
    ,GET_PARKINGS: '/parking/search'
    //Aqui se pueden añadir mas endpoints relacionados con parkings
}

export const getParkings = async (coords) => {
    try {
        // console.log("Fetching parkings with coords:", coords);
        if(!coords || !coords.latitude || !coords.longitude){
            console.warn("Invalid coordinates provided for fetching parkings.");
            return EMPTY_GEOJSON;
        }
        const response = await apiClient.get(PARKING_ENDPOINTS.GET_PARKINGS,{
            params: {
                latitude: coords?.latitude,
                longitude: coords?.longitude,
                distance: coords?.distance
            }
        });
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

