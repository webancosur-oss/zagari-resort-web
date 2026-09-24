import type { Coordinate } from "./location.config";

export type RawRouteCoordinate = readonly number[];

export type RouteGeometry = {
  type: "LineString";
  coordinates: RawRouteCoordinate[];
};

export type DirectionsResponse = {
  code?: string;
  message?: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: RouteGeometry;
  }>;
};

export type LineFeature = {
  type: "Feature";
  properties: Record<string, never>;
  geometry: {
    type: "LineString";
    coordinates: Coordinate[];
  };
};

export function isValidCoordinate(value: unknown): value is Coordinate {
  if (!Array.isArray(value) || value.length < 2) return false;

  const lng = Number(value[0]);
  const lat = Number(value[1]);

  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

export function cleanRoute(
  coordinates: readonly RawRouteCoordinate[],
): Coordinate[] {
  const cleaned: Coordinate[] = [];

  for (const coordinate of coordinates) {
    if (!isValidCoordinate(coordinate)) continue;

    const point: Coordinate = [
      Number(coordinate[0]),
      Number(coordinate[1]),
    ];

    const previous = cleaned[cleaned.length - 1];

    if (
      previous &&
      previous[0] === point[0] &&
      previous[1] === point[1]
    ) {
      continue;
    }

    cleaned.push(point);
  }

  return cleaned;
}

export function normalizeRoute(
  directionsRoute: readonly RawRouteCoordinate[],
  start: Coordinate,
  end: Coordinate,
): Coordinate[] {
  const cleaned = cleanRoute(directionsRoute);

  if (cleaned.length < 2) {
    throw new Error("Mapbox no devolvió suficientes coordenadas para la ruta.");
  }

  // Los extremos son siempre las coordenadas entregadas por Google Maps.
  // La geometría intermedia procede de Mapbox Directions.
  const normalized = cleanRoute([
    start,
    ...cleaned.slice(1, -1),
    end,
  ]);

  if (normalized.length < 2) {
    throw new Error("La ruta normalizada no es válida.");
  }

  return normalized;
}

export function distanceBetween(a: Coordinate, b: Coordinate): number {
  const earthRadius = 6371000;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * earthRadius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function buildMetrics(route: Coordinate[]) {
  const cumulative: number[] = [0];
  let total = 0;

  for (let index = 1; index < route.length; index += 1) {
    total += distanceBetween(route[index - 1], route[index]);
    cumulative.push(total);
  }

  return { cumulative, total };
}

export function pointAtDistance(
  route: Coordinate[],
  cumulative: number[],
  distance: number,
): Coordinate {
  if (route.length === 0) throw new Error("No hay ruta disponible.");
  if (distance <= 0) return route[0];

  const total = cumulative[cumulative.length - 1] ?? 0;
  if (distance >= total) return route[route.length - 1];

  let low = 1;
  let high = cumulative.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (cumulative[middle] < distance) low = middle + 1;
    else high = middle;
  }

  const index = low;
  const segmentStart = cumulative[index - 1];
  const segmentLength = cumulative[index] - segmentStart;
  const progress =
    segmentLength > 0 ? (distance - segmentStart) / segmentLength : 0;

  return [
    route[index - 1][0] +
      (route[index][0] - route[index - 1][0]) * progress,
    route[index - 1][1] +
      (route[index][1] - route[index - 1][1]) * progress,
  ];
}

export function bearingBetween(a: Coordinate, b: Coordinate): number {
  const lon1 = (a[0] * Math.PI) / 180;
  const lon2 = (b[0] * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function shortestDelta(current: number, target: number): number {
  let delta = target - current;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

export function lineFeature(coordinates: Coordinate[]): LineFeature {
  const fallback: Coordinate[] = [
    [-75.35164974827498, -11.12118701310725],
    [-75.35164, -11.12118],
  ];

  const safeCoordinates = coordinates.length >= 2 ? coordinates : fallback;

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: safeCoordinates,
    },
  };
}

export function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} KM`
    : `${Math.round(meters)} M`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} MIN`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} H ${rest} MIN` : `${hours} H`;
}