"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Map as IconoMapa, Pause, Play, Refresh } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { CLUB } from "../Landing/landing.data";
import { ROUTE } from "./route.data";

import CarroAnimado from "./CarroAnimado";
import styles from "./LocationRoute.module.css";

const MAPAS = {
  mapa: {
    src: "/assets/map/zagari-ruta-mapa.webp",
    alt: "Mapa con relieve del recorrido desde San Ramón hasta Zagari Resort Club por la Carretera Central",
  },
  satelite: {
    src: "/assets/map/zagari-ruta.webp",
    alt: "Vista satelital del recorrido desde San Ramón hasta Zagari Resort Club",
  },
} as const;

/** Rótulo en píldora dentro del mapa; el ancho se estima por caracteres. */
function Etiqueta({
  x,
  y,
  texto,
  alinear,
  clase,
}: {
  x: number;
  y: number;
  texto: string;
  alinear: "inicio" | "fin";
  clase: string;
}) {
  const ancho = texto.length * 8.4 + 28;
  const izquierda = alinear === "inicio" ? x : x - ancho;
  return (
    <g className={clase} transform={`translate(${izquierda} ${y - 15})`}>
      <rect width={ancho} height="30" rx="15" />
      <text x={ancho / 2} y="15" textAnchor="middle" dominantBaseline="central">
        {texto}
      </text>
    </g>
  );
}

const DURACION = 18; // segundos que dura el recorrido
const ZOOM = 2.6; // acercamiento de la vista en primera persona

export default function LocationRoute() {
  const pathRef = useRef<SVGPathElement>(null);

  const [enMarcha, setEnMarcha] = useState(false);
  const [seguir, setSeguir] = useState(true);
  const [estilo, setEstilo] = useState<"mapa" | "satelite">("mapa");

  interface Posicion {
    avance: number;
    x: number;
    y: number;
    angulo: number;
    largo: number;
  }

  const [pos, setPos] = useState<Posicion>({
    avance: 0,
    x: ROUTE.start.x,
    y: ROUTE.start.y,
    angulo: 0,
    largo: 0,
  });

  const avanceRef = useRef(0);

  useEffect(() => {
    const trazo = pathRef.current;

    if (!trazo) return;

    const largo = trazo.getTotalLength();
    const inicio = trazo.getPointAtLength(0);

    setPos((p) => ({
      ...p,
      largo,
      x: inicio.x,
      y: inicio.y,
    }));
  }, []);

  // rAF + getPointAtLength: hace falta la posicion exacta para que la camara siga al coche.
  useEffect(() => {
    if (!enMarcha) return;

    const trazo = pathRef.current;

    if (!trazo) return;

    const largo = trazo.getTotalLength();

    let frame = 0;
    let inicio = 0;

    const paso = (ahora: number) => {
      if (!inicio) {
        inicio = ahora - avanceRef.current * DURACION * 1000;
      }

      const t = Math.min(
        (ahora - inicio) / (DURACION * 1000),
        1
      );

      const aqui = trazo.getPointAtLength(t * largo);
      const antes = trazo.getPointAtLength(
        Math.max(t * largo - 3, 0)
      );

      avanceRef.current = t;

      setPos({
        avance: t,
        x: aqui.x,
        y: aqui.y,
        angulo:
          (Math.atan2(aqui.y - antes.y, aqui.x - antes.x) *
            180) /
          Math.PI,
        largo,
      });

      if (t < 1) frame = requestAnimationFrame(paso);
      else setEnMarcha(false);
    };

    frame = requestAnimationFrame(paso);

    return () => cancelAnimationFrame(frame);
  }, [enMarcha]);

  const { avance, x, y, angulo, largo } = pos;

  const camara =
    seguir && enMarcha
      ? {
          transform: `scale(${ZOOM}) translate(${
            ROUTE.width / 2 - x
          }px, ${ROUTE.height / 2 - y}px)`,
        }
      : undefined;

  const porcentaje = Math.round(avance * 100);
  const trazo = { strokeDasharray: largo, strokeDashoffset: largo * (1 - avance) };
  const restanKm = (ROUTE.distanceKm * (1 - avance)).toFixed(1).replace(".", ",");
  const restanMin = Math.max(1, Math.round(ROUTE.durationMin * (1 - avance)));
  const info =
    avance >= 1
      ? "Llegaste a Zagari Resort Club"
      : avance > 0
        ? `Faltan ${restanKm} km · ${restanMin} min`
        : `${String(ROUTE.distanceKm).replace(".", ",")} km · ${ROUTE.durationMin} min por la Carretera Central`;

  return (
    <Reveal
      as="section"
      className={styles.section}
      duration={0.85}
      distance={24}
      aria-label="Cómo llegar a Zagari Resort Club"
    >
      <div className={styles.inner}>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Cómo llegar</p>

          <h2 className={styles.title}>
            A {String(ROUTE.distanceKm).replace(".", ",")} km de San Ramón
          </h2>

          <p className={styles.lead}>
            Unos {ROUTE.durationMin} minutos en coche por la
            carretera Central, entre el valle y la montaña.
          </p>
        </header>

        <div className={styles.stage}>
          <div
            className={`${styles.camara} ${
              seguir && enMarcha ? styles.camaraActiva : ""
            }`}
            style={camara}
          >
            <Image
              key={estilo}
              src={MAPAS[estilo].src}
              alt={MAPAS[estilo].alt}
              width={ROUTE.width}
              height={ROUTE.height}
              sizes="(min-width: 1100px) 1100px, 100vw"
              className={styles.map}
            />

            <svg
              className={styles.overlay}
              viewBox={`0 0 ${ROUTE.width} ${ROUTE.height}`}
              aria-hidden="true"
            >
              <defs>
                <filter id="brilloRuta" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>

              {/* Borde blanco: separa la ruta del mapa en ambos estilos. */}
              <path d={ROUTE.path} className={styles.borde} />
              {/* Tramo por recorrer, punteado. */}
              <path ref={pathRef} d={ROUTE.path} className={styles.pendiente} />
              <path d={ROUTE.path} className={styles.brillo} filter="url(#brilloRuta)" style={trazo} />
              <path d={ROUTE.path} className={styles.progreso} style={trazo} />

              <circle cx={ROUTE.start.x} cy={ROUTE.start.y} r="9" className={styles.pointStart} />
              <Etiqueta
                x={ROUTE.start.x - 16}
                y={ROUTE.start.y - 30}
                texto="Salida · San Ramón"
                alinear="fin"
                clase={styles.etiquetaInicio}
              />

              <circle cx={ROUTE.end.x} cy={ROUTE.end.y} r="13" className={styles.pulso} />
              <circle cx={ROUTE.end.x} cy={ROUTE.end.y} r="13" className={styles.pointEnd} />
              <circle cx={ROUTE.end.x} cy={ROUTE.end.y} r="5" className={styles.pointEndCore} />
              <Etiqueta
                x={ROUTE.end.x + 24}
                y={ROUTE.end.y}
                texto="Zagari Resort Club"
                alinear="inicio"
                clase={styles.etiquetaFin}
              />

              <g
                className={styles.car}
                transform={`translate(${x} ${y}) rotate(${angulo})`}
              >
                <CarroAnimado
                  enMarcha={enMarcha}
                  logoInvertido={Math.cos((angulo * Math.PI) / 180) < 0}
                />
              </g>
            </svg>
          </div>

          <p className={styles.info} aria-hidden="true">
            {info}
          </p>

          <p className={styles.atribucion}>
            <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer">
              © Mapbox
            </a>{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              © OpenStreetMap
            </a>
            {estilo === "satelite" && " © Maxar"}
          </p>

          <div
            className={styles.barra}
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Avance del recorrido"
          >
            <span
              className={styles.barraRelleno}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.control} ${styles.controlPrimary}`}
            onClick={() => setEnMarcha((v) => !v)}
            aria-pressed={enMarcha}
          >
            {enMarcha ? (
              <Pause size={17} weight="Filled" aria-hidden="true" />
            ) : (
              <Play size={17} weight="Filled" aria-hidden="true" />
            )}

            <span>
              {enMarcha
                ? "Pausar recorrido"
                : avance > 0
                  ? "Continuar recorrido"
                  : "Iniciar recorrido"}
            </span>
          </button>

          <button
            type="button"
            className={styles.control}
            onClick={() => {
              setEnMarcha(false);
              avanceRef.current = 0;
              setPos((p) => ({
                ...p,
                avance: 0,
                x: ROUTE.start.x,
                y: ROUTE.start.y,
                angulo: 0,
              }));
            }}
            disabled={avance === 0}
          >
            <Refresh size={17} aria-hidden="true" />
            <span>Reiniciar</span>
          </button>

          <button
            type="button"
            className={styles.control}
            onClick={() => setSeguir((v) => !v)}
            aria-pressed={seguir}
          >
            <span>Seguir la van</span>
          </button>

          <button
            type="button"
            className={styles.control}
            onClick={() => setEstilo((e) => (e === "mapa" ? "satelite" : "mapa"))}
            aria-pressed={estilo === "satelite"}
          >
            <IconoMapa size={17} aria-hidden="true" />
            <span>Satélite</span>
          </button>

          <a
            href={CLUB.maps}
            className={styles.control}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en Google Maps
          </a>
        </div>

      </div>
    </Reveal>
  );
}
