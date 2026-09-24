"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";

import styles from "./LocationSection.module.css";
import {
  GOOGLE_MAPS_URL,
  LOCATION_COORDINATES,
  MAP_ASSETS,
  MAP_CONFIG,
} from "./location.config";
import type { Coordinate } from "./location.config";
import {
  type DirectionsResponse,
  bearingBetween,
  buildMetrics,
  cleanRoute,
  formatDistance,
  formatDuration,
  lineFeature,
  normalizeRoute,
  pointAtDistance,
  shortestDelta,
} from "./location.route";
import { createCarMarker } from "./components/LocationCar";

gsap.registerPlugin(ScrollTrigger);

/**
 * Perfil de cámara adaptativo. Se calcula en el cliente para que la vista
 * de conducción se sienta natural en desktop, tablet y móvil.
 */
function getCameraProfile() {
  if (typeof window === "undefined") {
    return {
      zoom: MAP_CONFIG.firstPersonZoom,
      pitch: MAP_CONFIG.firstPersonPitch,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width <= 700;
  const isTablet = width > 700 && width <= 1100;
  const isLandscape = width > height;

  if (isMobile && !isLandscape) {
    return { zoom: 16.8, pitch: 58 };
  }

  if (isMobile && isLandscape) {
    return { zoom: 17.4, pitch: 64 };
  }

  if (isTablet) {
    return { zoom: 17.5, pitch: 66 };
  }

  return {
    zoom: MAP_CONFIG.firstPersonZoom,
    pitch: MAP_CONFIG.firstPersonPitch,
  };
}

const EMPTY_ROUTE: Coordinate[] = [
  LOCATION_COORDINATES.plazaDeArmas,
  [
    LOCATION_COORDINATES.plazaDeArmas[0] + 0.000001,
    LOCATION_COORDINATES.plazaDeArmas[1] + 0.000001,
  ],
];

export default function UbicacionSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapFrameRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const vehicleRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const routeRef = useRef<Coordinate[]>([]);
  const cumulativeRef = useRef<number[]>([]);
  const totalDistanceRef = useRef(0);
  const currentDistanceRef = useRef(0);
  const currentBearingRef = useRef(0);

  const animationRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const autoRunRef = useRef(false);
  const mountedRef = useRef(false);

  const distanceElementRef = useRef<HTMLSpanElement | null>(null);
  const durationElementRef = useRef<HTMLSpanElement | null>(null);

  const [routeReady, setRouteReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [showingFullTrack, setShowingFullTrack] = useState(false);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const fullscreenFallbackRef = useRef(false);

  useLayoutEffect(() => {
    const media = window.matchMedia(
      "(max-width: 700px) and (orientation: portrait)",
    );
    const update = () => {
      setIsMobilePortrait(media.matches);
      window.requestAnimationFrame(() => mapRef.current?.resize());
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const handleFullscreen = () => {
      if (document.fullscreenElement) {
        fullscreenFallbackRef.current = false;
        setIsFullscreen(true);
      } else if (!fullscreenFallbackRef.current) {
        setIsFullscreen(false);
      }
      window.requestAnimationFrame(() => mapRef.current?.resize());
    };
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);


  const toggleFullscreen = useCallback(async () => {
    const frame = mapFrameRef.current;
    if (!frame) return;

    try {
      // Navegadores con Fullscreen API nativa.
      if (document.fullscreenElement) {
        if (typeof document.exitFullscreen === "function") {
          await document.exitFullscreen();
        }
        return;
      }

      // Fallback para iOS Safari y WebViews donde requestFullscreen
      // no existe o no está disponible sobre un div.
      if (fullscreenFallbackRef.current || isFullscreen) {
        fullscreenFallbackRef.current = false;
        setIsFullscreen(false);
        window.requestAnimationFrame(() => mapRef.current?.resize());
        return;
      }

      const requestFullscreen = (frame as HTMLDivElement & {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void> | void;
      }).requestFullscreen;

      if (typeof requestFullscreen === "function") {
        await requestFullscreen.call(frame);
        return;
      }

      const webkitRequestFullscreen = (frame as HTMLDivElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      }).webkitRequestFullscreen;

      if (typeof webkitRequestFullscreen === "function") {
        await webkitRequestFullscreen.call(frame);
        return;
      }

      // Fallback CSS: funciona incluso cuando la API Fullscreen no existe.
      fullscreenFallbackRef.current = true;
      setIsFullscreen(true);
      window.requestAnimationFrame(() => {
        mapRef.current?.resize();
        mapRef.current?.triggerRepaint();
      });
    } catch (error) {
      console.warn("Fullscreen nativo no disponible; se utiliza el modo adaptativo.", error);
      fullscreenFallbackRef.current = true;
      setIsFullscreen(true);
      window.requestAnimationFrame(() => mapRef.current?.resize());
    }
  }, [isFullscreen]);

  const enableMapControls = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.dragPan.enable();
    map.scrollZoom.enable();
    map.doubleClickZoom.enable();
    map.dragRotate.enable();
    map.touchZoomRotate.enable();
    map.keyboard.enable();
  }, []);

  const disableMapControls = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.dragPan.disable();
    map.scrollZoom.disable();
    map.doubleClickZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();
  }, []);

  const clearTimers = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (startTimerRef.current !== null) {
      window.clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
    if (arrivalTimerRef.current !== null) {
      window.clearTimeout(arrivalTimerRef.current);
      arrivalTimerRef.current = null;
    }
  }, []);

  const setProgressOpacity = useCallback((opacity: number) => {
    const map = mapRef.current;
    if (!map) return;

    for (const layer of [
      "zagari-progress-glow",
      "zagari-progress-main",
      "zagari-progress-core",
    ]) {
      if (map.getLayer(layer)) {
        map.setPaintProperty(layer, "line-opacity", opacity);
      }
    }
  }, []);

  const updateProgressRoute = useCallback((distance: number) => {
    const map = mapRef.current;
    const route = routeRef.current;
    const cumulative = cumulativeRef.current;

    if (!map || route.length < 2 || cumulative.length < 2) return;

    const clamped = Math.max(
      0,
      Math.min(distance, totalDistanceRef.current),
    );

    const point = pointAtDistance(route, cumulative, clamped);

    let segmentIndex = 1;
    while (
      segmentIndex < cumulative.length - 1 &&
      cumulative[segmentIndex] < clamped
    ) {
      segmentIndex += 1;
    }

    const visible: Coordinate[] = route.slice(0, segmentIndex);
    const last = visible[visible.length - 1];

    if (!last || last[0] !== point[0] || last[1] !== point[1]) {
      visible.push(point);
    }

    const source = map.getSource(MAP_CONFIG.progressSource) as
      | mapboxgl.GeoJSONSource
      | undefined;

    source?.setData(
      lineFeature(visible.length >= 2 ? visible : EMPTY_ROUTE),
    );
  }, []);

  const setVehicleAndCamera = useCallback(
    (distance: number, immediate = false) => {
      const map = mapRef.current;
      const route = routeRef.current;
      const cumulative = cumulativeRef.current;
      const vehicle = vehicleRef.current;

      if (!map || !vehicle || route.length < 2 || cumulative.length < 2) {
        return;
      }

      const total = totalDistanceRef.current;
      const clamped = Math.max(0, Math.min(distance, total));
      const point = pointAtDistance(route, cumulative, clamped);

      const behind = pointAtDistance(
        route,
        cumulative,
        Math.max(0, clamped - 10),
      );
      const ahead = pointAtDistance(
        route,
        cumulative,
        Math.min(total, clamped + MAP_CONFIG.lookAheadMeters),
      );

      const targetBearing = bearingBetween(behind, ahead);
      const delta = shortestDelta(
        currentBearingRef.current,
        targetBearing,
      );
      currentBearingRef.current += delta * MAP_CONFIG.bearingSmoothing;

      vehicle
        .setLngLat(point)
        .setRotation(currentBearingRef.current);

      // La cámara mira ligeramente por delante del vehículo para conseguir
      // sensación de conducción y no una vista cenital.
      const cameraCenter = pointAtDistance(
        route,
        cumulative,
        Math.min(total, clamped + MAP_CONFIG.cameraLeadMeters),
      );

      const camera = getCameraProfile();

      if (immediate) {
        map.jumpTo({
          center: cameraCenter,
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: currentBearingRef.current,
        });
      } else {
        map.easeTo({
          center: cameraCenter,
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: currentBearingRef.current,
          duration: 150,
          easing: (value) => value,
          essential: true,
        });
      }

      currentDistanceRef.current = clamped;
    },
    [],
  );

  const stopJourney = useCallback(
    (reset = false) => {
      autoRunRef.current = false;
      clearTimers();
      mapRef.current?.stop();
      enableMapControls();
      setIsPlaying(false);
      setIsPaused(!reset && currentDistanceRef.current > 0 && currentDistanceRef.current < totalDistanceRef.current);

      if (reset) {
        currentDistanceRef.current = 0;
        setIsPaused(false);
        setProgressOpacity(0);
        updateProgressRoute(0);
        vehicleRef.current
          ?.setLngLat(LOCATION_COORDINATES.plazaDeArmas)
          .setRotation(0);
        popupRef.current?.remove();
        destinationMarkerRef.current
          ?.getElement()
          .classList.remove(styles.destinationArrived);
      }
    },
    [clearTimers, enableMapControls, setProgressOpacity, updateProgressRoute],
  );

  const finishJourney = useCallback(() => {
    const map = mapRef.current;
    const route = routeRef.current;
    const cumulative = cumulativeRef.current;
    if (!map || route.length < 2 || cumulative.length < 2) return;

    currentDistanceRef.current = totalDistanceRef.current;
    updateProgressRoute(totalDistanceRef.current);
    setProgressOpacity(1);

    const finalPoint = LOCATION_COORDINATES.zagari;
    const finalBearing = bearingBetween(
      pointAtDistance(
        route,
        cumulative,
        Math.max(0, totalDistanceRef.current - 30),
      ),
      finalPoint,
    );
    currentBearingRef.current = finalBearing;

    vehicleRef.current
      ?.setLngLat(finalPoint)
      .setRotation(finalBearing);

    map.easeTo({
      center: finalPoint,
      zoom: 18.2,
      pitch: 68,
      bearing: finalBearing,
      duration: MAP_CONFIG.arrivalCameraDuration,
      essential: true,
    });

    arrivalTimerRef.current = window.setTimeout(() => {
      if (!autoRunRef.current) return;

      // El último punto se hace visible e iluminado solamente al completar
      // el recorrido. Después de ello se abre el popup de Zagari.
      destinationMarkerRef.current
        ?.getElement()
        .classList.add(styles.destinationArrived);

      popupRef.current?.setLngLat(finalPoint).addTo(map);
      autoRunRef.current = false;
      setIsPlaying(false);
      setIsPaused(false);
      enableMapControls();
    }, MAP_CONFIG.arrivalCameraDuration + 120);
  }, [enableMapControls, setProgressOpacity, updateProgressRoute]);

  const toggleFullTrack = useCallback(() => {
    const map = mapRef.current;
    const route = routeRef.current;
    if (!map || route.length < 2 || !routeReady) return;

    stopJourney(true);
    const source = map.getSource(MAP_CONFIG.fullRouteSource) as
      | mapboxgl.GeoJSONSource
      | undefined;
    source?.setData(lineFeature(route));

    for (const layer of ["zagari-full-glow", "zagari-full-main", "zagari-full-core"]) {
      if (map.getLayer(layer)) map.setPaintProperty(layer, "line-opacity", 1);
    }
    setProgressOpacity(0);
    setShowingFullTrack((current) => {
      const next = !current;
      if (!next) {
        for (const layer of ["zagari-full-glow", "zagari-full-main", "zagari-full-core"]) {
          if (map.getLayer(layer)) map.setPaintProperty(layer, "line-opacity", 0);
        }
      }
      return next;
    });

    if (!showingFullTrack) {
      map.fitBounds(
        route.reduce(
          (bounds, coordinate) => bounds.extend(coordinate),
          new mapboxgl.LngLatBounds(route[0], route[0]),
        ),
        {
          padding: { top: 70, right: 55, bottom: 70, left: 55 },
          maxZoom: 13.2,
          pitch: 35,
          bearing: -18,
          duration: 1100,
          essential: true,
        },
      );
    }
  }, [routeReady, setProgressOpacity, showingFullTrack, stopJourney]);

  const startJourney = useCallback(() => {
    const map = mapRef.current;
    const route = routeRef.current;
    const cumulative = cumulativeRef.current;
    const vehicle = vehicleRef.current;

    if (!map || !vehicle || route.length < 2 || cumulative.length < 2) return;

    if (autoRunRef.current) {
      stopJourney(false);
      return;
    }

    clearTimers();
    popupRef.current?.remove();
    setShowingFullTrack(false);
    const fullSource = map.getSource(MAP_CONFIG.fullRouteSource) as mapboxgl.GeoJSONSource | undefined;
    fullSource?.setData(lineFeature(EMPTY_ROUTE));
    for (const layer of ["zagari-full-glow", "zagari-full-main", "zagari-full-core"]) {
      if (map.getLayer(layer)) map.setPaintProperty(layer, "line-opacity", 0);
    }
    destinationMarkerRef.current
      ?.getElement()
      .classList.remove(styles.destinationArrived);

    autoRunRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    disableMapControls();

    const startDistance = currentDistanceRef.current;

    if (startDistance >= totalDistanceRef.current - 1) {
      currentDistanceRef.current = 0;
    }

    const distance = currentDistanceRef.current;
    const startPoint = pointAtDistance(route, cumulative, distance);
    const startAhead = pointAtDistance(
      route,
      cumulative,
      Math.min(
        totalDistanceRef.current,
        distance + MAP_CONFIG.lookAheadMeters,
      ),
    );

    currentBearingRef.current = bearingBetween(startPoint, startAhead);
    vehicle
      .setLngLat(startPoint)
      .setRotation(currentBearingRef.current);

    updateProgressRoute(
      Math.min(
        totalDistanceRef.current,
        distance + MAP_CONFIG.illuminatedAheadMeters,
      ),
    );
    setProgressOpacity(1);

    const firstPersonCenter = pointAtDistance(
      route,
      cumulative,
      Math.min(
        totalDistanceRef.current,
        distance + MAP_CONFIG.cameraLeadMeters,
      ),
    );

    const camera = getCameraProfile();
    map.easeTo({
      center: firstPersonCenter,
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: currentBearingRef.current,
      duration: MAP_CONFIG.startCameraDuration,
      essential: true,
    });

    startTimerRef.current = window.setTimeout(() => {
      startTimerRef.current = null;
      if (!autoRunRef.current) return;

      const animationStart = performance.now();
      const remainingDistance = Math.max(
        0,
        totalDistanceRef.current - distance,
      );
      const remainingDuration =
        MAP_CONFIG.journeyDuration *
        (remainingDistance / Math.max(1, totalDistanceRef.current));

      const animate = (now: number) => {
        if (!autoRunRef.current) return;

        const raw = Math.min(
          1,
          (now - animationStart) / Math.max(1000, remainingDuration),
        );
        const eased = gsap.parseEase("power1.inOut")(raw);
        const traveled = distance + remainingDistance * eased;

        const point = pointAtDistance(route, cumulative, traveled);
        const ahead = pointAtDistance(
          route,
          cumulative,
          Math.min(
            totalDistanceRef.current,
            traveled + MAP_CONFIG.lookAheadMeters,
          ),
        );
        const behind = pointAtDistance(
          route,
          cumulative,
          Math.max(0, traveled - 12),
        );

        const targetBearing = bearingBetween(behind, ahead);
        const bearingDelta = shortestDelta(
          currentBearingRef.current,
          targetBearing,
        );
        currentBearingRef.current +=
          bearingDelta * MAP_CONFIG.bearingSmoothing;

        vehicle
          .setLngLat(point)
          .setRotation(currentBearingRef.current);

        const illuminatedDistance = Math.min(
          totalDistanceRef.current,
          traveled + MAP_CONFIG.illuminatedAheadMeters,
        );
        updateProgressRoute(illuminatedDistance);

        const cameraCenter = pointAtDistance(
          route,
          cumulative,
          Math.min(
            totalDistanceRef.current,
            traveled + MAP_CONFIG.cameraLeadMeters,
          ),
        );

        const camera = getCameraProfile();
        map.easeTo({
          center: cameraCenter,
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: currentBearingRef.current,
          duration: 150,
          easing: (value) => value,
          essential: true,
        });

        currentDistanceRef.current = traveled;

        if (raw < 1) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        animationRef.current = null;
        finishJourney();
      };

      animationRef.current = requestAnimationFrame(animate);
    }, MAP_CONFIG.startCameraDuration + 60);
  }, [
    clearTimers,
    disableMapControls,
    finishJourney,
    setProgressOpacity,
    stopJourney,
    updateProgressRoute,
  ]);

  const focusZagari = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    stopJourney(false);
    map.easeTo({
      center: LOCATION_COORDINATES.zagari,
      zoom: 18,
      pitch: 65,
      duration: 1400,
      essential: true,
    });

    window.setTimeout(() => {
      if (!mapRef.current) return;
      destinationMarkerRef.current
        ?.getElement()
        .classList.add(styles.destinationArrived);
      popupRef.current?.setLngLat(LOCATION_COORDINATES.zagari).addTo(map);
    }, 1050);
  }, [stopJourney]);

  useLayoutEffect(() => {
    const container = mapContainerRef.current;
    const root = rootRef.current;
    if (!container || !root) return;

    mountedRef.current = true;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      setRouteError("Falta NEXT_PUBLIC_MAPBOX_TOKEN.");
      return;
    }

    const map = new mapboxgl.Map({
      accessToken: token,
      container,
      style: "mapbox://styles/mapbox/standard-satellite",
      center: LOCATION_COORDINATES.plazaDeArmas,
      zoom: 12.8,
      pitch: 42,
      bearing: -18,
      antialias: true,
      attributionControl: true,
      minZoom: 11,
      maxZoom: 20,
      cooperativeGestures: false,
    });

    mapRef.current = map;

    // Mantiene el canvas sincronizado con el contenedor sin provocar
    // re-render de React al cambiar orientación, fullscreen o tamaño.
    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => map.resize());
    });
    resizeObserver.observe(mapFrameRef.current ?? container);

    const destinationElement = document.createElement("div");
    destinationElement.className = styles.destinationMarker;
    destinationElement.setAttribute("role", "button");
    destinationElement.setAttribute("tabindex", "0");
    destinationElement.setAttribute("aria-label", "Ver información de Zagari Resort Club");
    destinationElement.innerHTML = `
      <span class="${styles.destinationPulse}"></span>
      <span class="${styles.destinationCore}"><span class="${styles.destinationDiamond}"></span></span>
      <span class="${styles.destinationLabel}">ZAGARI</span>
    `;

    const destinationMarker = new mapboxgl.Marker({
      element: destinationElement,
      anchor: "bottom",
    })
      .setLngLat(LOCATION_COORDINATES.zagari)
      .addTo(map);
    destinationMarkerRef.current = destinationMarker;

    const popup = new mapboxgl.Popup({
      offset: 22,
      closeButton: true,
      closeOnClick: false,
      className: styles.mapPopup,
      maxWidth: "310px",
    }).setHTML(`
      <div class="${styles.popupInner}">
        <img
          class="${styles.popupImage}"
          src="${MAP_ASSETS.popupImage}"
          alt="Zagari Resort Club"
          loading="lazy"
        />
        <div class="${styles.popupBody}">
          <span class="${styles.popupEyebrow}">DESTINO</span>
          <strong>ZAGARI RESORT CLUB</strong>
          <span>San Ramón · Chanchamayo · Junín</span>
        </div>
      </div>
    `);
    popupRef.current = popup;

    const openDestinationPopup = () => {
      popup.setLngLat(LOCATION_COORDINATES.zagari).addTo(map);
    };

    destinationElement.addEventListener("click", openDestinationPopup);
    destinationElement.addEventListener("keydown", (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
        keyboardEvent.preventDefault();
        openDestinationPopup();
      }
    });

    const vehicle = createCarMarker(
      map,
      styles,
      LOCATION_COORDINATES.plazaDeArmas,
    );
    vehicleRef.current = vehicle;

    const mapElement = map.getContainer();
    const onUserPointer = (event: Event) => {
      if (!autoRunRef.current) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest(`.${styles.mapAction}`)) return;
      stopJourney(false);
    };
    const onUserWheel = () => {
      if (autoRunRef.current) stopJourney(false);
    };

    mapElement.addEventListener("pointerdown", onUserPointer);
    mapElement.addEventListener("touchstart", onUserPointer, {
      passive: true,
    });
    mapElement.addEventListener("wheel", onUserWheel, { passive: true });

    const initialize = async () => {
      try {
        map.addSource("zagari-terrain", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "zagari-terrain", exaggeration: 1.12 });
      } catch {
        // El terreno es opcional.
      }

      // Una sola geometría de progreso: no se dibuja la ruta completa antes
      // de iniciar. La línea se va revelando detrás/delante del vehículo.
      map.addSource(MAP_CONFIG.progressSource, {
        type: "geojson",
        data: lineFeature(EMPTY_ROUTE),
      });

      map.addLayer({
        id: "zagari-progress-glow",
        type: "line",
        source: MAP_CONFIG.progressSource,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ffd43b",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            7,
            15,
            13,
            19,
            25,
          ],
          "line-opacity": 0,
          "line-blur": 7,
        },
      });

      map.addLayer({
        id: "zagari-progress-main",
        type: "line",
        source: MAP_CONFIG.progressSource,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#ffd21f",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            3,
            15,
            5.5,
            19,
            9,
          ],
          "line-opacity": 0,
        },
      });

      map.addLayer({
        id: "zagari-progress-core",
        type: "line",
        source: MAP_CONFIG.progressSource,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#fff7bd",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.9,
            15,
            1.6,
            19,
            2.4,
          ],
          "line-opacity": 0,
        },
      });

      map.addSource(MAP_CONFIG.fullRouteSource, {
        type: "geojson",
        data: lineFeature(EMPTY_ROUTE),
      });

      map.addLayer({
        id: "zagari-full-glow",
        type: "line",
        source: MAP_CONFIG.fullRouteSource,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#ffd43b",
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 6, 15, 11, 19, 22],
          "line-opacity": 0,
          "line-blur": 6,
        },
      });
      map.addLayer({
        id: "zagari-full-main",
        type: "line",
        source: MAP_CONFIG.fullRouteSource,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#ffd21f",
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2.5, 15, 4.5, 19, 8],
          "line-opacity": 0,
        },
      });
      map.addLayer({
        id: "zagari-full-core",
        type: "line",
        source: MAP_CONFIG.fullRouteSource,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#fff7bd",
          "line-width": ["interpolate", ["linear"], ["zoom"], 11, 0.8, 15, 1.4, 19, 2.1],
          "line-opacity": 0,
        },
      });

      const coordinates =
        `${LOCATION_COORDINATES.plazaDeArmas[0]},${LOCATION_COORDINATES.plazaDeArmas[1]};` +
        `${LOCATION_COORDINATES.zagari[0]},${LOCATION_COORDINATES.zagari[1]}`;

      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}` +
        `?alternatives=false&overview=full&geometries=geojson&steps=false&access_token=${encodeURIComponent(token)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Directions HTTP ${response.status}`);
      }

      const data = (await response.json()) as DirectionsResponse;
      const selectedRoute = data.routes?.[0];
      const rawCoordinates = selectedRoute?.geometry?.coordinates;

      if (!selectedRoute || !rawCoordinates) {
        throw new Error(
          data.message || "Mapbox no devolvió una ruta válida.",
        );
      }

      const directionsRoute = cleanRoute(rawCoordinates);
      const normalizedRoute = normalizeRoute(
        directionsRoute,
        LOCATION_COORDINATES.plazaDeArmas,
        LOCATION_COORDINATES.zagari,
      );

      routeRef.current = normalizedRoute;
      const metrics = buildMetrics(normalizedRoute);
      cumulativeRef.current = metrics.cumulative;
      totalDistanceRef.current = metrics.total;
      currentDistanceRef.current = 0;

      const firstBearing = bearingBetween(
        normalizedRoute[0],
        pointAtDistance(
          normalizedRoute,
          metrics.cumulative,
          Math.min(35, metrics.total),
        ),
      );
      currentBearingRef.current = firstBearing;
      vehicle.setLngLat(normalizedRoute[0]).setRotation(firstBearing);

      if (distanceElementRef.current) {
        distanceElementRef.current.textContent = formatDistance(
          selectedRoute.distance,
        );
      }
      if (durationElementRef.current) {
        durationElementRef.current.textContent = formatDuration(
          selectedRoute.duration,
        );
      }

      const fullRouteSource = map.getSource(MAP_CONFIG.fullRouteSource) as mapboxgl.GeoJSONSource | undefined;
      fullRouteSource?.setData(lineFeature(normalizedRoute));
      setShowingFullTrack(false);
      setRouteReady(true);
      setRouteError("");

      map.fitBounds(
        normalizedRoute.reduce(
          (bounds, coordinate) => bounds.extend(coordinate),
          new mapboxgl.LngLatBounds(normalizedRoute[0], normalizedRoute[0]),
        ),
        {
          padding: { top: 55, right: 55, bottom: 55, left: 55 },
          maxZoom: 13.1,
          pitch: 40,
          bearing: -18,
          duration: 950,
          essential: true,
        },
      );
    };

    map.once("load", () => {
      setMapLoaded(true);
      window.requestAnimationFrame(() => map.resize());
      void initialize().catch((error) => {
        console.error(error);
        setRouteError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar el recorrido.",
        );
      });
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            once: true,
          },
        },
      );
    }, root);

    return () => {
      mountedRef.current = false;
      resizeObserver.disconnect();
      setMapLoaded(false);
      ctx.revert();
      stopJourney(false);

      mapElement.removeEventListener("pointerdown", onUserPointer);
      mapElement.removeEventListener("touchstart", onUserPointer);
      mapElement.removeEventListener("wheel", onUserWheel);

      vehicle.remove();
      destinationElement.removeEventListener("click", openDestinationPopup);
      destinationMarker.remove();
      popup.remove();
      map.remove();

      mapRef.current = null;
      vehicleRef.current = null;
      destinationMarkerRef.current = null;
      popupRef.current = null;
    };
  }, [stopJourney]);

  const PlayIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13L18 12 8 5.5Z" fill="currentColor"/></svg>
  );
  const PauseIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/></svg>
  );
  const ResetIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8V4l-2 2 3 3 2-2H5a7 7 0 1 1-1.2 7.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const ExternalIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8M18 13v5H6V6h5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const FullscreenIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  const RouteColorIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18c3-8 6-8 14-12" fill="none" stroke="#f5c933" strokeWidth="2.8" strokeLinecap="round"/><circle cx="5" cy="18" r="2.8" fill="#2e8065"/><circle cx="19" cy="6" r="2.8" fill="#e3a72f"/></svg>
  );
  const GoogleMapsIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6.2-5.5 6.2-11A6.2 6.2 0 0 0 5.8 10c0 5.5 6.2 11 6.2 11Z" fill="#ea4335"/><path d="M12 4a6.2 6.2 0 0 0-5.2 2.8l4 3.3 2.1-5.9C12.6 4.1 12.3 4 12 4Z" fill="#4285f4"/><path d="m10.8 10.1 4.2-3.4a6.2 6.2 0 0 1 2.9 5.2c0 1.7-.6 3.4-1.4 4.8l-5.7-6.6Z" fill="#34a853"/><circle cx="12" cy="10" r="2.1" fill="#fbbc04"/></svg>
  );
  const RotatePhoneIcon = () => (
    <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="15" y="8" width="18" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 18c1-5 5-8 10-9M8 18l4-1M8 18l1-4M40 30c-1 5-5 8-10 9M40 30l-4 1M40 30l-1 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  return (
    <section
      id="ubicacion"
      ref={rootRef}
      className={styles.section}
      aria-labelledby="ubicacion-title"
    >
      <div className={styles.shell}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>UBICACIÓN</span>

          <h2 id="ubicacion-title" className={styles.title}>
            El camino hacia
            <em>Zagari comienza aquí.</em>
          </h2>

          <p className={styles.description}>
            Recorre virtualmente el camino desde la Plaza de Armas de San Ramón
            hasta Zagari Resort Club. La cámara avanza en primera persona y el
            trazado se ilumina sobre la carretera.
          </p>

          <div className={styles.infoCard}>
            <span className={styles.locationMark}>
              <span />
            </span>
            <div className={styles.infoCopy}>
              <span className={styles.infoLabel}>PUNTO DE PARTIDA</span>
              <strong>Plaza de Armas de San Ramón</strong>
              <p>San Ramón · Chanchamayo · Junín</p>
            </div>
          </div>

          <div className={styles.routeSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}><RouteColorIcon /></span>
              <span><small>RECORRIDO</small><strong ref={distanceElementRef}>—</strong></span>
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryItem}>
              <span className={styles.summaryIcon}><span className={styles.clockDot} /></span>
              <span><small>TIEMPO VIAL</small><strong ref={durationElementRef}>—</strong></span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.primaryButton} ${isPlaying ? styles.primaryButtonActive : ""}`}
              onClick={startJourney}
              disabled={!routeReady}
              aria-pressed={isPlaying}
            >
              <span className={styles.buttonPlay}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
              <span>{isPlaying ? "PAUSAR RECORRIDO" : isPaused ? "REANUDAR RECORRIDO" : "INICIAR RECORRIDO"}</span>
              <span className={styles.buttonArrow}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
            </button>
          </div>

          <div className={styles.bottomLinks}>
            <button
              type="button"
              className={`${styles.utilityLink} ${showingFullTrack ? styles.utilityLinkActive : ""}`}
              onClick={toggleFullTrack}
              disabled={!routeReady}
            >
              <span className={`${styles.utilityIcon} ${styles.utilityIconTrack}`}><RouteColorIcon /></span>
              <span>{showingFullTrack ? "OCULTAR TRACK" : "VER TRACK COMPLETO"}</span>
            </button>

            <a className={styles.utilityLink} href={GOOGLE_MAPS_URL} target="_blank" rel="noreferrer">
              <span className={`${styles.utilityIcon} ${styles.utilityIconMaps}`}><GoogleMapsIcon /></span>
              <span>GOOGLE MAPS</span>
              <span className={styles.externalMini}><ExternalIcon /></span>
            </a>
          </div>

          {routeError ? (
            <p className={styles.routeError}>{routeError}</p>
          ) : null}
        </div>

        <div ref={mapFrameRef} className={`${styles.mapFrame} ${isFullscreen ? styles.mapFrameFullscreen : ""}`}>
          <div ref={mapContainerRef} className={styles.map} />

          {!mapLoaded ? (
            <div className={styles.mapLoading} role="status" aria-live="polite">
              <span className={styles.mapLoadingSpinner} aria-hidden="true" />
              <strong>Cargando recorrido</strong>
              <span>Preparando el mapa y la ruta.</span>
            </div>
          ) : null}

          {isMobilePortrait ? (
            <div className={styles.orientationOverlay} role="status" aria-live="polite">
              <div className={styles.orientationIcon}><RotatePhoneIcon /></div>
              <strong>Gira tu teléfono</strong>
              <span>Voltéalo horizontalmente para vivir el recorrido completo.</span>
            </div>
          ) : null}

          <div className={styles.mapControls}>
            <button
              type="button"
              className={styles.mapAction}
              onClick={startJourney}
              disabled={!routeReady}
              aria-label={isPlaying ? "Pausar recorrido" : isPaused ? "Reanudar recorrido" : "Iniciar recorrido"}
              title={isPlaying ? "Pausar" : isPaused ? "Reanudar" : "Reproducir"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              className={styles.mapAction}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver mapa en pantalla completa"}
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
