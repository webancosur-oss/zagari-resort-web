export type Coordinate = [number, number];

/**
 * Extremos del recorrido tomados de Google Maps.
 * Mapbox Directions solamente calcula la geometría vial entre ambos puntos.
 */
export const LOCATION_COORDINATES = {
  plazaDeArmas: [-75.35164974827498, -11.12118701310725] as Coordinate,
  zagari: [-75.3893056, -11.1523611] as Coordinate,
} as const;

export const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=ZAGARI+RESORT+CLUB";

/** Reemplaza estos archivos con los assets definitivos que vas a subir. */
export const MAP_ASSETS = {
  vehicleSvg: "/assets/icons/zagari-route-vehicle.svg",
  popupImage: "/assets/experiences/experience8.webp",
} as const;

export const MAP_CONFIG = {
  routeSource: "zagari-route",
  progressSource: "zagari-route-progress",
  fullRouteSource: "zagari-route-full",

  // Duración completa del recorrido.
  journeyDuration: 70000,

  // Entrada a la vista primera persona.
  startCameraDuration: 1800,
  arrivalCameraDuration: 2800,

  // Cámara tipo conducción.
  firstPersonZoom: 18.0,
  firstPersonPitch: 72,
  cameraLeadMeters: 20,
  // Distancia que la cámara y el vehículo toman como referencia por delante.
  // Se mantiene explícita para evitar referencias a propiedades inexistentes.
  lookAheadMeters: 38,

  // Suavizado de orientación del vehículo/cámara.
  bearingSmoothing: 0.12,

  // El brillo se extiende ligeramente por delante del vehículo para que
  // el camino se perciba como una guía luminosa continua.
  illuminatedAheadMeters: 10,
} as const;
