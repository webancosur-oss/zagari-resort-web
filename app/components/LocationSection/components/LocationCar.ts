import * as mapboxgl from "mapbox-gl/esm";
import { MAP_ASSETS } from "../location.config";
import type { Coordinate } from "../location.config";

/**
 * Marcador mínimo: solamente el SVG proporcionado por el proyecto.
 * El SVG rota siguiendo el bearing de la ruta.
 */
export function createCarMarker(
  map: mapboxgl.Map,
  styles: Record<string, string>,
  coordinate: Coordinate,
) {
  const element = document.createElement("div");
  element.className = styles.routeVehicle;
  element.setAttribute("aria-hidden", "true");

  const image = document.createElement("img");
  image.className = styles.routeVehicleImage;
  image.src = MAP_ASSETS.vehicleSvg;
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";

  element.appendChild(image);

  return new mapboxgl.Marker({
    element,
    anchor: "center",
    offset: [0, 0],
    rotationAlignment: "map",
    pitchAlignment: "map",
  })
    .setLngLat(coordinate)
    .setRotation(0)
    .addTo(map);
}
