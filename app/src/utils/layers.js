
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
        
        // Borde blanco
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
  source: 'parkings',
  filter: ['!', ['has', 'point_count']],
  paint: {
    // Lógica de color dinámica
    'circle-color': [
      'case',
      ['>', ['get', 'spots'], 0], 
      '#4f46e5', // Índigo (disponible ahora)
      '#f59e0b'  // Amarillo (sin plazas ahora, pero reservable)
    ],
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};
export const unclusteredShadowLayer = {
    id: 'unclustered-shadow',
    type: 'circle',
    source: PARKING_SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-color': '#4f46e5', //color de la marca (Índigo)
        'circle-radius': 11,
        'circle-opacity': 0.3,
        'circle-translate': [1, 1] 
    }
};
export const buildingLayer = {
  id: '3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 13, // El 3D solo se ve al acercarse para no saturar el rendimiento
  paint: {
    'fill-extrusion-color': '#e0e7ff', // Un color marca (índigo muy claro)
    // Usa la altura real del edificio proporcionada por Mapbox
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      13,
      0,
      13.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      13,
      0,
      13.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.7 // transparencia para que no opaque los parkings
  }
};