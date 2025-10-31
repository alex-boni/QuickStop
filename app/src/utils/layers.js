
const PARKING_SOURCE_ID = 'parkings';

export const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    source: PARKING_SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#66bb6a',   // Verde
            5,
            '#4caf50',   // Verde Medio
            7,
            '#1b5e20'    // Verde Oscuro
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            5,
            30,
            7,
            40
        ],
        
        // Borde blanco limpio
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
    }
};

export const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    source: PARKING_SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 14,
        'text-allow-overlap': true
    },
    paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 0.5,
    }
};

export const unclusteredPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: PARKING_SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#4f46e5', // Índigo de la marca
        'circle-radius': 8, 
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-translate': [0, 0],
    }
};
export const unclusteredShadowLayer = {
    id: 'unclustered-shadow',
    type: 'circle',
    source: PARKING_SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#4f46e5', // Usamos el color de la marca (Índigo)
        'circle-radius': 11,
        'circle-opacity': 0.3,
        'circle-translate': [1, 1] 
    }
};