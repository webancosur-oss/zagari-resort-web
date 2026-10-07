"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Gps,
  Map as IconoMapa,
  Maximize,
  Minimize,
  Pause,
  PhoneRotate,
  Play,
  Refresh,
} from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { bloquearDesplazamiento } from "../SmoothScroll/SmoothScroll";
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

/*
 * Aviso de girar el teléfono: se recuerda durante la visita. sessionStorage
 * puede fallar (navegación privada), por eso hay también una copia en memoria:
 * sin ella el aviso no se podría cerrar.
 */
const CLAVE_AVISO = "zagari:aviso-girar";
const oyentesAviso = new Set<() => void>();
let avisoCerradoEnMemoria = false;

function suscribirAviso(avisar: () => void) {
  oyentesAviso.add(avisar);
  return () => {
    oyentesAviso.delete(avisar);
  };
}

function leerAvisoCerrado(): boolean {
  if (avisoCerradoEnMemoria) return true;
  try {
    return sessionStorage.getItem(CLAVE_AVISO) === "1";
  } catch {
    return false;
  }
}

function cerrarAviso() {
  avisoCerradoEnMemoria = true;
  try {
    sessionStorage.setItem(CLAVE_AVISO, "1");
  } catch {
    // Sin almacenamiento basta la copia en memoria.
  }
  oyentesAviso.forEach((avisar) => avisar());
}

// Teléfono en horizontal: el mapa pasa a pantalla completa al girarlo.
const HORIZONTAL = "(orientation: landscape) and (max-height: 560px)";

const DURACION = 18; // segundos que dura el recorrido
const ZOOM = 2.6; // acercamiento de la cámara que sigue a la van
const PASO_MUESTRA = 2; // unidades del mapa entre muestras de la ruta
const ANTICIPO = 12; // muestras hacia delante y atrás para el rumbo
const RAMPA = 0.08; // fracción del tiempo que tarda en acelerar y en frenar

/**
 * Perfil de velocidad trapezoidal: acelera al salir y frena al llegar, en
 * lugar de arrancar a velocidad plena desde el punto de partida.
 */
function perfil(t: number): number {
  const vmax = 1 / (1 - RAMPA);
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < RAMPA) return (vmax * t * t) / (2 * RAMPA);
  if (t > 1 - RAMPA) return 1 - (vmax * (1 - t) * (1 - t)) / (2 * RAMPA);
  return vmax * (t - RAMPA / 2);
}

/** Diferencia angular más corta, en radianes. */
function giro(desde: number, hasta: number): number {
  return Math.atan2(Math.sin(hasta - desde), Math.cos(hasta - desde));
}

interface Muelle {
  valor: number;
  velocidad: number;
}

/**
 * Muelle con amortiguación crítica (SmoothDamp): arranca y se detiene con
 * suavidad, sin el salto del primer fotograma de un suavizado exponencial.
 * `tiempo` es, aproximadamente, lo que tarda en alcanzar el objetivo.
 */
function amortiguar(m: Muelle, objetivo: number, tiempo: number, dt: number) {
  if (dt === 0) {
    m.valor = objetivo;
    m.velocidad = 0;
    return;
  }
  const omega = 2 / tiempo;
  const x = omega * dt;
  const e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const cambio = m.valor - objetivo;
  const t = (m.velocidad + omega * cambio) * dt;
  m.velocidad = (m.velocidad - omega * t) * e;
  m.valor = objetivo + (cambio + t) * e;
}

// Estado inicial de las capas que se mueven por código: React no vuelve a
// escribirlas mientras sus props no cambien, así que el bucle manda sobre ellas.
const TRAZO_OCULTO = { strokeDasharray: "0 100000" };
const INICIO_VAN = `translate(${ROUTE.start.x} ${ROUTE.start.y})`;

interface Motor {
  despertar: () => void;
  reiniciar: () => void;
}

export default function LocationRoute() {
  const pathRef = useRef<SVGPathElement>(null);
  const camaraRef = useRef<HTMLDivElement>(null);
  const vanRef = useRef<SVGGElement>(null);
  const progresoRef = useRef<SVGPathElement>(null);
  const brilloRef = useRef<SVGPathElement>(null);
  const rellenoRef = useRef<HTMLSpanElement>(null);
  const motorRef = useRef<Motor | null>(null);
  const visorRef = useRef<HTMLDivElement>(null);
  const ordenRef = useRef({ enMarcha: false, seguir: true });

  const [enMarcha, setEnMarcha] = useState(false);
  const [seguir, setSeguir] = useState(true);
  const [estilo, setEstilo] = useState<"mapa" | "satelite">("mapa");
  // El avance llega a React solo unas veces por segundo: para la ficha y los
  // textos. El movimiento lo escribe el bucle directamente en el DOM.
  const [avance, setAvance] = useState(0);
  const [logoInvertido, setLogoInvertido] = useState(false);
  const [completa, setCompleta] = useState(false);
  const avisoCerrado = useSyncExternalStore(suscribirAviso, leerAvisoCerrado, () => false);

  useEffect(() => {
    const ruta = pathRef.current;
    const camara = camaraRef.current;
    const van = vanRef.current;
    if (!ruta || !camara || !van) return;

    // Muestras uniformes de la ruta, calculadas una sola vez.
    const largo = ruta.getTotalLength();
    const n = Math.max(2, Math.ceil(largo / PASO_MUESTRA) + 1);
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const p = ruta.getPointAtLength((i / (n - 1)) * largo);
      xs[i] = p.x;
      ys[i] = p.y;
    }

    const punto = (f: number) => {
      const i = Math.min(n - 2, Math.max(0, Math.floor(f)));
      const r = Math.min(1, Math.max(0, f - i));
      return { x: xs[i] + (xs[i + 1] - xs[i]) * r, y: ys[i] + (ys[i + 1] - ys[i]) * r };
    };

    // Rumbo con anticipación: atraviesa los quiebres de la ruta en curva.
    const rumboEn = (f: number) => {
      const a = punto(Math.max(0, f - ANTICIPO));
      const b = punto(Math.min(n - 1, f + ANTICIPO));
      return Math.atan2(b.y - a.y, b.x - a.x);
    };

    for (const trazo of [progresoRef.current, brilloRef.current]) {
      if (!trazo) continue;
      trazo.style.strokeDasharray = `${largo}`;
      trazo.style.strokeDashoffset = `${largo}`;
    }

    const W = ROUTE.width;
    const H = ROUTE.height;
    let tiempo = 0; // fracción del tiempo del recorrido, 0..1
    // El rumbo se amortigua como un ángulo sin envolver: se sigue al objetivo
    // por el giro más corto.
    const rumbo: Muelle = { valor: rumboEn(0), velocidad: 0 };
    let invertido = Math.cos(rumbo.valor) < 0;
    const zoom: Muelle = { valor: 1, velocidad: 0 };
    const camX: Muelle = { valor: W / 2, velocidad: 0 };
    const camY: Muelle = { valor: H / 2, velocidad: 0 };
    let marco = 0;
    let anterior = 0;
    let ultimoAviso = 0;

    const reducido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dibujar = (dt: number, ahora: number) => {
      const { enMarcha: andando, seguir: siguiendo } = ordenRef.current;

      if (andando) tiempo = Math.min(1, tiempo + dt / DURACION);
      const avanceActual = perfil(tiempo);
      const f = avanceActual * (n - 1);
      const aqui = punto(f);

      amortiguar(rumbo, rumbo.valor + giro(rumbo.valor, rumboEn(f)), 0.22, dt);
      van.setAttribute(
        "transform",
        `translate(${aqui.x.toFixed(2)} ${aqui.y.toFixed(2)}) rotate(${((rumbo.valor * 180) / Math.PI).toFixed(2)})`
      );

      const girado = Math.cos(rumbo.valor) < 0;
      if (girado !== invertido) {
        invertido = girado;
        setLogoInvertido(girado);
      }

      const resto = largo * (1 - avanceActual);
      if (progresoRef.current) progresoRef.current.style.strokeDashoffset = `${resto}`;
      if (brilloRef.current) brilloRef.current.style.strokeDashoffset = `${resto}`;
      if (rellenoRef.current) rellenoRef.current.style.width = `${avanceActual * 100}%`;

      // Cámara: se acerca y sigue a la van con amortiguación. Nunca sale del
      // mapa, así al pasar cerca de un borde no aparece una zona vacía.
      const acercar = andando && siguiendo && !reducido();
      const zoomObjetivo = acercar ? ZOOM : 1;
      amortiguar(zoom, zoomObjetivo, 0.7, dt);
      const z = Math.max(1, zoom.valor);
      const mx = W / (2 * z);
      const my = H / (2 * z);
      const limitar = (v: number, m: number, total: number) => Math.min(total - m, Math.max(m, v));
      amortiguar(camX, limitar(acercar ? aqui.x : W / 2, mx, W), 0.45, dt);
      amortiguar(camY, limitar(acercar ? aqui.y : H / 2, my, H), 0.45, dt);
      const cx = limitar(camX.valor, mx, W);
      const cy = limitar(camY.valor, my, H);
      const enReposo =
        !acercar &&
        Math.abs(zoom.valor - 1) < 0.0005 &&
        Math.abs(zoom.velocidad) < 0.001 &&
        Math.abs(camX.valor - W / 2) < 0.05 &&
        Math.abs(camY.valor - H / 2) < 0.05;
      camara.style.transform = enReposo
        ? ""
        : `scale(${z.toFixed(4)}) translate(${((0.5 - cx / W) * 100).toFixed(3)}%, ${((0.5 - cy / H) * 100).toFixed(3)}%)`;

      if (ahora - ultimoAviso > 150 || tiempo >= 1) {
        ultimoAviso = ahora;
        setAvance(avanceActual);
      }

      if (andando && tiempo >= 1) {
        ordenRef.current.enMarcha = false;
        setEnMarcha(false);
      }

      const quieta =
        !ordenRef.current.enMarcha &&
        (enReposo || (acercar && Math.abs(zoom.valor - zoomObjetivo) < 0.001)) &&
        Math.abs(giro(rumbo.valor, rumboEn(f))) < 0.001;
      return !quieta;
    };

    const bucle = (ahora: number) => {
      const dt = anterior ? Math.min(0.05, (ahora - anterior) / 1000) : 1 / 60;
      anterior = ahora;
      marco = dibujar(dt, ahora) ? requestAnimationFrame(bucle) : 0;
      if (!marco) anterior = 0;
    };

    const despertar = () => {
      if (!marco) marco = requestAnimationFrame(bucle);
    };

    motorRef.current = {
      despertar,
      reiniciar: () => {
        tiempo = 0;
        rumbo.valor = rumboEn(0);
        rumbo.velocidad = 0;
        despertar();
      },
    };

    dibujar(0, 0);

    return () => {
      cancelAnimationFrame(marco);
      motorRef.current = null;
    };
  }, []);

  // Al girar el teléfono con el mapa a la vista, se abre a pantalla completa;
  // al volver a vertical, se cierra.
  useEffect(() => {
    const visor = visorRef.current;
    if (!visor) return;
    const consulta = window.matchMedia(HORIZONTAL);
    let visible = false;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.intersectionRatio >= 0.3;
      },
      { threshold: [0, 0.3, 0.6] }
    );
    observador.observe(visor);
    const alGirar = () => {
      if (!consulta.matches) setCompleta(false);
      else if (visible) setCompleta(true);
    };
    consulta.addEventListener("change", alGirar);
    return () => {
      observador.disconnect();
      consulta.removeEventListener("change", alGirar);
    };
  }, []);

  useEffect(() => {
    const visor = visorRef.current;
    if (!completa || !visor) return;
    bloquearDesplazamiento(true);
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompleta(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      bloquearDesplazamiento(false);
      window.removeEventListener("keydown", alTeclear);
      visor.scrollIntoView({ block: "center" });
    };
  }, [completa]);

  // Las órdenes de la interfaz llegan al bucle por la ref y lo despiertan.
  useEffect(() => {
    ordenRef.current.enMarcha = enMarcha;
    ordenRef.current.seguir = seguir;
    motorRef.current?.despertar();
  }, [enMarcha, seguir]);

  const porcentaje = Math.round(avance * 100);
  const restanKm = (ROUTE.distanceKm * (1 - avance)).toFixed(1).replace(".", ",");
  const restanMin = Math.max(1, Math.round(ROUTE.durationMin * (1 - avance)));
  const info =
    avance >= 1
      ? "Llegaste a Zagari Resort Club"
      : avance > 0
        ? `Faltan ${restanKm} km · ${restanMin} min`
        : `${String(ROUTE.distanceKm).replace(".", ",")} km · ${ROUTE.durationMin} min`;
  // En móvil se oculta: la ficha corta cabe sin tapar los rótulos.
  const infoExtra = avance === 0 ? "por la Carretera Central" : "";

  const textoPrincipal = enMarcha
    ? "Pausar recorrido"
    : avance > 0 && avance < 1
      ? "Continuar recorrido"
      : "Iniciar recorrido";

  return (
    <Reveal
      as="section"
      className={`${styles.section} ${completa ? styles.seccionCompleta : ""}`}
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
            Unos {ROUTE.durationMin} minutos en coche por la carretera Central, entre el valle y la
            montaña.
          </p>
        </header>

        {/* En un teléfono en horizontal los controles van dentro del mapa. */}
        <div
          ref={visorRef}
          className={`${styles.visor} ${completa ? styles.completa : ""}`}
          data-lenis-prevent={completa ? "" : undefined}
        >
          <div className={styles.stage}>
            <div ref={camaraRef} className={styles.camara}>
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
                className={`${styles.overlay} ${seguir && enMarcha ? styles.siguiendo : ""}`}
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
                <path
                  ref={brilloRef}
                  d={ROUTE.path}
                  className={styles.brillo}
                  filter="url(#brilloRuta)"
                  style={TRAZO_OCULTO}
                />
                <path ref={progresoRef} d={ROUTE.path} className={styles.progreso} style={TRAZO_OCULTO} />

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

                <g ref={vanRef} className={styles.car} transform={INICIO_VAN}>
                  <CarroAnimado enMarcha={enMarcha} logoInvertido={logoInvertido} />
                </g>
              </svg>
            </div>

            <p className={styles.info} aria-hidden="true">
              {info}
              {infoExtra && <span className={styles.infoExtra}> {infoExtra}</span>}
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
              <span ref={rellenoRef} className={styles.barraRelleno} />
            </div>

            {/* Solo en móvil en vertical (CSS); al girar el teléfono desaparece. */}
            {!avisoCerrado && (
              <div className={styles.girar} role="note">
                <PhoneRotate size={30} aria-hidden="true" className={styles.girarIcono} />
                <p className={styles.girarTexto}>
                  Gira tu teléfono para una mejor experiencia
                </p>
                <button type="button" className={styles.girarCerrar} onClick={cerrarAviso}>
                  Continuar en vertical
                </button>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.control} ${styles.controlPrimary}`}
              onClick={() => {
                // Al terminar, el botón vuelve a empezar desde la salida.
                if (!enMarcha && avance >= 1) motorRef.current?.reiniciar();
                setEnMarcha((v) => !v);
              }}
              title={textoPrincipal}
            >
              {enMarcha ? (
                <Pause size={17} weight="Filled" aria-hidden="true" />
              ) : (
                <Play size={17} weight="Filled" aria-hidden="true" />
              )}
              <span className={styles.textoControl}>{textoPrincipal}</span>
            </button>

            <button
              type="button"
              className={styles.control}
              onClick={() => {
                ordenRef.current.enMarcha = false;
                setEnMarcha(false);
                setAvance(0);
                motorRef.current?.reiniciar();
              }}
              disabled={avance === 0}
              title="Reiniciar"
            >
              <Refresh size={17} aria-hidden="true" />
              <span className={styles.textoControl}>Reiniciar</span>
            </button>

            <button
              type="button"
              className={styles.control}
              onClick={() => setSeguir((v) => !v)}
              aria-pressed={seguir}
              title="Seguir la van"
            >
              <Gps size={17} aria-hidden="true" />
              <span className={styles.textoControl}>Seguir la van</span>
            </button>

            <button
              type="button"
              className={styles.control}
              onClick={() => setEstilo((e) => (e === "mapa" ? "satelite" : "mapa"))}
              aria-pressed={estilo === "satelite"}
              title="Satélite"
            >
              <IconoMapa size={17} aria-hidden="true" />
              <span className={styles.textoControl}>Satélite</span>
            </button>

            <a
              href={CLUB.maps}
              className={styles.control}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en Google Maps"
            >
              <ArrowUpRight size={17} aria-hidden="true" />
              <span className={styles.textoControl}>Abrir en Google Maps</span>
            </a>

            {/* Solo con el teléfono en horizontal (CSS). */}
            <button
              type="button"
              className={`${styles.control} ${styles.controlPantalla}`}
              onClick={() => setCompleta((v) => !v)}
              title={completa ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {completa ? (
                <Minimize size={17} aria-hidden="true" />
              ) : (
                <Maximize size={17} aria-hidden="true" />
              )}
              <span className={styles.textoControl}>
                {completa ? "Salir de pantalla completa" : "Pantalla completa"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
