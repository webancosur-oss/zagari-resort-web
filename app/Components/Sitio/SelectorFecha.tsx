"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft2, ArrowRight2, Calendar } from "reicon-react";

import styles from "./SelectorFecha.module.css";

const DIAS = ["L", "M", "M", "J", "V", "S", "D"];
const NOMBRES_DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const dos = (n: number) => String(n).padStart(2, "0");
const aIso = (f: Date) => `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;
const deIso = (iso: string) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const sumarDias = (iso: string, n: number) => {
  const f = deIso(iso);
  f.setDate(f.getDate() + n);
  return aIso(f);
};
const sumarMeses = (iso: string, n: number) => {
  const f = deIso(iso);
  const dia = f.getDate();
  f.setDate(1);
  f.setMonth(f.getMonth() + n);
  const ultimo = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
  f.setDate(Math.min(dia, ultimo));
  return aIso(f);
};

const corta = (iso: string) => {
  const t = deIso(iso).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const larga = (iso: string) =>
  deIso(iso).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

interface SelectorFechaProps {
  valor: string;
  alCambiar: (iso: string) => void;
  deshabilitado?: boolean;
  etiqueta: string;
}

/** Calendario propio: semanas desde el lunes, sin días pasados, con teclado. */
export default function SelectorFecha({ valor, alCambiar, deshabilitado, etiqueta }: SelectorFechaProps) {
  const id = useId();
  const raiz = useRef<HTMLDivElement>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const rejilla = useRef<HTMLDivElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [hoy, setHoy] = useState("");
  const [foco, setFoco] = useState("");

  // "Hoy" se calcula al abrir, en el navegador: así no cambia entre servidor y cliente.
  const abrir = () => {
    const actual = aIso(new Date());
    setHoy(actual);
    setFoco(valor && valor >= actual ? valor : actual);
    setAbierto(true);
  };

  const cerrar = (devolverFoco = true) => {
    setAbierto(false);
    if (devolverFoco) disparador.current?.focus();
  };

  const elegir = (iso: string) => {
    alCambiar(iso);
    cerrar();
  };

  // El día enfocado recibe el foco real del teclado.
  useEffect(() => {
    if (!abierto) return;
    rejilla.current?.querySelector<HTMLButtonElement>(`[data-dia="${foco}"]`)?.focus();
  }, [abierto, foco]);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]);

  const mover = (iso: string) => setFoco(iso < hoy ? hoy : iso);

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const acciones: Record<string, () => void> = {
      ArrowLeft: () => mover(sumarDias(foco, -1)),
      ArrowRight: () => mover(sumarDias(foco, 1)),
      ArrowUp: () => mover(sumarDias(foco, -7)),
      ArrowDown: () => mover(sumarDias(foco, 7)),
      PageUp: () => mover(sumarMeses(foco, -1)),
      PageDown: () => mover(sumarMeses(foco, 1)),
      Escape: () => cerrar(),
    };
    const accion = acciones[e.key];
    if (!accion) return;
    e.preventDefault();
    accion();
  };

  // Días del mes enfocado, con huecos para empezar en lunes.
  const base = foco ? deIso(foco) : new Date();
  const anio = base.getFullYear();
  const mes = base.getMonth();
  const inicio = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const total = new Date(anio, mes + 1, 0).getDate();
  const celdas: (string | null)[] = [
    ...Array.from({ length: inicio }, () => null),
    ...Array.from({ length: total }, (_, i) => aIso(new Date(anio, mes, i + 1))),
  ];
  const mesLargo = new Date(anio, mes, 1).toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  const titulo = mesLargo.charAt(0).toUpperCase() + mesLargo.slice(1);
  const enMesActual = hoy !== "" && hoy.slice(0, 7) === `${anio}-${dos(mes + 1)}`;

  return (
    <div ref={raiz} className={styles.raiz}>
      <button
        ref={disparador}
        type="button"
        className={styles.disparador}
        onClick={() => (abierto ? cerrar(false) : abrir())}
        disabled={deshabilitado}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-controls={`${id}-calendario`}
        aria-label={`${etiqueta}: ${valor ? larga(valor) : "sin elegir"}`}
      >
        <span className={valor ? styles.valor : styles.vacio}>{valor ? corta(valor) : "Elige una fecha"}</span>
        <Calendar size={18} aria-hidden="true" />
      </button>

      {abierto && (
        <>
          <span className={styles.fondo} aria-hidden="true" onClick={() => cerrar(false)} />
          <div
            id={`${id}-calendario`}
            role="dialog"
            aria-modal="false"
            aria-label={`Elegir ${etiqueta.toLowerCase()}`}
            className={styles.calendario}
            onKeyDown={alTeclear}
          >
            <div className={styles.cabecera}>
              <button
                type="button"
                className={styles.flecha}
                onClick={() => mover(sumarMeses(foco, -1))}
                disabled={enMesActual}
                aria-label="Mes anterior"
              >
                <ArrowLeft2 size={18} aria-hidden="true" />
              </button>
              <p className={styles.mes} aria-live="polite">
                {titulo}
              </p>
              <button type="button" className={styles.flecha} onClick={() => mover(sumarMeses(foco, 1))} aria-label="Mes siguiente">
                <ArrowRight2 size={18} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.semana} aria-hidden="true">
              {DIAS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div ref={rejilla} className={styles.dias} role="grid" aria-label={titulo}>
              {celdas.map((iso, i) =>
                iso === null ? (
                  <span key={`vacio-${i}`} />
                ) : (
                  <button
                    key={iso}
                    type="button"
                    data-dia={iso}
                    className={styles.dia}
                    disabled={iso < hoy}
                    tabIndex={iso === foco ? 0 : -1}
                    aria-pressed={iso === valor}
                    aria-current={iso === hoy ? "date" : undefined}
                    aria-label={`${NOMBRES_DIAS[(deIso(iso).getDay() + 6) % 7]} ${Number(iso.slice(8))}`}
                    onClick={() => elegir(iso)}
                  >
                    {Number(iso.slice(8))}
                  </button>
                )
              )}
            </div>

            <div className={styles.pie}>
              <button type="button" className={styles.texto} onClick={() => elegir(hoy)}>
                Hoy
              </button>
              {valor && (
                <button type="button" className={styles.texto} onClick={() => elegir("")}>
                  Borrar fecha
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
