"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CallCalling } from "reicon-react";

import { DESTINOS, whatsapp } from "../../lib/contenido";
import { PLANES, fechaLegible, personas, type IdPlan } from "../../lib/reservas";
import { useToast } from "../ui/Toast/ToastProvider";

import SelectorFecha from "./SelectorFecha";

import styles from "./Buscador.module.css";

const ABIERTO = DESTINOS.find((d) => d.estado === "abierto")!;

function hoyIso() {
  const h = new Date();
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${h.getFullYear()}-${dos(h.getMonth() + 1)}-${dos(h.getDate())}`;
}

/**
 * Buscador de reservas del inicio. Aún no hay motor de reservas: arma el
 * pedido y lo envía por WhatsApp, o lleva al formulario para que llamen.
 */
export default function Buscador() {
  const { mostrar } = useToast();
  const [plan, setPlan] = useState<IdPlan>("dia");
  const [fecha, setFecha] = useState("");
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);

  const nombrePlan = PLANES.find((p) => p.id === plan)!.nombre;
  const conFecha = plan === "dia" || plan === "cabana";

  const consulta = new URLSearchParams({
    interes: plan,
    destino: ABIERTO.id,
    ...(conFecha && fecha ? { fecha } : {}),
    adultos: String(adultos),
    ninos: String(ninos),
  });

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (conFecha && fecha && fecha < hoyIso()) {
      mostrar("error", "Elige una fecha desde hoy en adelante.");
      return;
    }

    const partes = [
      `Hola Zagari Resort Club, quiero reservar: ${nombrePlan} en ${ABIERTO.nombre}.`,
      conFecha && fecha ? `Fecha: ${fechaLegible(fecha)}.` : "",
      personas(adultos, ninos),
    ];
    window.open(whatsapp(partes.filter(Boolean).join(" ")), "_blank", "noopener,noreferrer");
  };

  return (
    <form className={styles.buscador} onSubmit={enviar} aria-label="Reserva tu visita">
      <div className={styles.campos}>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>Destino</span>
          <select className={styles.control} defaultValue={ABIERTO.id} name="destino">
            {DESTINOS.map((d) => (
              <option key={d.id} value={d.id} disabled={d.estado !== "abierto"}>
                {d.nombre}
                {d.estado === "proximamente" ? " (próximamente)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Qué buscas</span>
          <select
            className={styles.control}
            value={plan}
            onChange={(e) => setPlan(e.target.value as IdPlan)}
            name="plan"
          >
            {PLANES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <div className={`${styles.campo} ${conFecha ? "" : styles.inactivo}`}>
          <span className={styles.etiqueta} aria-hidden="true">
            Fecha
          </span>
          <SelectorFecha
            valor={conFecha ? fecha : ""}
            alCambiar={setFecha}
            deshabilitado={!conFecha}
            etiqueta="Fecha de visita"
          />
        </div>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Adultos</span>
          <select
            className={styles.control}
            value={adultos}
            onChange={(e) => setAdultos(Number(e.target.value))}
            name="adultos"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Niños</span>
          <select
            className={styles.control}
            value={ninos}
            onChange={(e) => setNinos(Number(e.target.value))}
            name="ninos"
          >
            {Array.from({ length: 9 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className={styles.reservar}>
          Reservar por WhatsApp
        </button>
      </div>

      <Link href={`/contacto?${consulta}`} className={styles.llamar}>
        <CallCalling size={16} aria-hidden="true" />
        Prefiero que me llamen
      </Link>
    </form>
  );
}
