"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Add, ArrowUpRight, Map as IconoMapa, Minus, X } from "reicon-react";

import { whatsapp } from "../../lib/contenido";
import { bloquearDesplazamiento } from "../SmoothScroll/SmoothScroll";

import styles from "./PlanoLotes.module.css";

const PLANO = "/assets/images/lotes/plano-lotes.svg";

/* El plano marca cada lote con una clase de color. */
const CLASES = {
  "cls-56": "disponible",
  "cls-53": "separado",
  "cls-54": "vendido",
} as const;

type Clase = keyof typeof CLASES;
type Estado = (typeof CLASES)[Clase];

const NOMBRES: Record<Estado, string> = {
  disponible: "Disponible",
  separado: "Separado",
  vendido: "Vendido",
};

const SELECTOR = Object.keys(CLASES)
  .map((c) => `.${c}`)
  .join(", ");

const ZOOMS = [1, 1.6, 2.4, 3.2];

function estadoDe(el: Element): Estado | null {
  for (const clase of Object.keys(CLASES) as Clase[]) {
    if (el.classList.contains(clase)) return CLASES[clase];
  }
  return null;
}

/** Plano interactivo de la II etapa: disponible, separado y vendido. */
export default function PlanoLotes() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const lienzo = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [elegido, setElegido] = useState<Estado | null>(null);
  const [conteo, setConteo] = useState<Record<Estado, number> | null>(null);

  // El plano pesa: se descarga solo al abrirlo por primera vez.
  useEffect(() => {
    if (!abierto || svg) return;
    const control = new AbortController();
    fetch(PLANO, { signal: control.signal })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(setSvg)
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => control.abort();
  }, [abierto, svg]);

  // Cuenta los lotes por estado; los fragmentos diminutos son decoración.
  useEffect(() => {
    if (!svg) return;
    const cuadro = requestAnimationFrame(() => {
      const raiz = lienzo.current?.querySelector("svg");
      if (!raiz) return;
      raiz.removeAttribute("width");
      raiz.removeAttribute("height");
      const cuenta: Record<Estado, number> = { disponible: 0, separado: 0, vendido: 0 };
      raiz.querySelectorAll<SVGGraphicsElement>(SELECTOR).forEach((el) => {
        const caja = el.getBBox();
        if (caja.width < 25 || caja.height < 25) return;
        el.dataset.lote = "";
        const estado = estadoDe(el);
        if (estado) cuenta[estado] += 1;
      });
      setConteo(cuenta);
    });
    return () => cancelAnimationFrame(cuadro);
  }, [svg]);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
    bloquearDesplazamiento(abierto);
    return () => bloquearDesplazamiento(false);
  }, [abierto]);

  const tocarPlano = (e: MouseEvent<HTMLDivElement>) => {
    const lote = (e.target as Element).closest("[data-lote]");
    lienzo.current?.querySelectorAll("[data-elegido]").forEach((el) => el.removeAttribute("data-elegido"));
    if (!lote) {
      setElegido(null);
      return;
    }
    lote.setAttribute("data-elegido", "");
    setElegido(estadoDe(lote));
  };

  const mensaje =
    elegido === "disponible"
      ? "Hola, estoy revisando el plano de lotes de Zagari Resort Club y elegí un lote disponible. ¿Me dan información de área y condiciones?"
      : "Hola, estoy revisando el plano de lotes de Zagari Resort Club. El lote que elegí no está disponible; ¿qué alternativas tienen?";

  return (
    <>
      <button type="button" className={styles.abrir} onClick={() => setAbierto(true)}>
        <span className={styles.abrirIcono}>
          <IconoMapa size={20} aria-hidden="true" />
        </span>
        <span className={styles.abrirTexto}>
          <small>Plano interactivo</small>
          <strong>Explorar disponibilidad</strong>
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogo}
        className={styles.dialogo}
        aria-labelledby="titulo-plano"
        onClose={() => setAbierto(false)}
        data-lenis-prevent=""
      >
        <header className={styles.barra}>
          <div>
            <h2 id="titulo-plano" className={styles.titulo}>
              Plano de lotes · II etapa
            </h2>
            <ul className={styles.leyenda}>
              {(Object.keys(NOMBRES) as Estado[]).map((e) => (
                <li key={e} className={styles[e]}>
                  {NOMBRES[e]}
                  {conteo && <strong>{conteo[e]}</strong>}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.herramientas}>
            <button
              type="button"
              className={styles.herramienta}
              onClick={() => setZoom((z) => Math.max(0, z - 1))}
              disabled={zoom === 0}
              aria-label="Alejar"
            >
              <Minus size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.herramienta}
              onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
              disabled={zoom === ZOOMS.length - 1}
              aria-label="Acercar"
            >
              <Add size={18} aria-hidden="true" />
            </button>
            <button type="button" className={styles.herramienta} onClick={() => setAbierto(false)} aria-label="Cerrar plano">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={styles.vista}>
          {error ? (
            <p className={styles.estado}>No se pudo cargar el plano. Inténtalo de nuevo más tarde.</p>
          ) : !svg ? (
            <p className={styles.estado}>Cargando plano…</p>
          ) : (
            // El SVG es un archivo propio del sitio, no contenido de usuarios.
            <div
              ref={lienzo}
              className={styles.lienzo}
              style={{ width: `${ZOOMS[zoom] * 100}%` }}
              onClick={tocarPlano}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>

        <footer className={styles.pie} aria-live="polite">
          {elegido ? (
            <>
              <p className={styles.eleccion}>
                Lote <span className={`${styles.sello} ${styles[elegido]}`}>{NOMBRES[elegido]}</span>
              </p>
              <a href={whatsapp(mensaje)} className={styles.consultar} target="_blank" rel="noopener noreferrer">
                {elegido === "disponible" ? "Consultar este lote" : "Ver alternativas"}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </>
          ) : (
            <p className={styles.ayuda}>Toca un lote para ver su estado. Disponibilidad referencial: confírmala con tu asesor.</p>
          )}
        </footer>
      </dialog>
    </>
  );
}
