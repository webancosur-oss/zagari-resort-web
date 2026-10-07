"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { ArrowDown, ArrowRight, InfoCircle, TickCircle } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { desplazarA } from "../SmoothScroll/SmoothScroll";
import { useToast } from "../ui/Toast/ToastProvider";
import {
  AVISO_MODELO,
  AVISO_TARIFAS,
  BENEFICIOS,
  CATEGORIAS,
  soles,
  type Categoria,
} from "../../lib/modelo";
import Beneficios from "./Beneficios";
import Cabecera from "./Cabecera";
import { useCategoria } from "./CategoriaElegida";

import comun from "./comercial.module.css";
import styles from "./Membresias.module.css";

// Los cuatro beneficios que más distinguen una categoría de otra.
const CLAVE = ["Ingreso al club", "Invitados sin costo", "Restaurante, bar y market", "Cabañas"];
const DESTACADOS = BENEFICIOS.filter((b) => CLAVE.includes(b.servicio));

/** Inclinación máxima de la tarjeta, en grados. */
const INCLINACION = 9;

function puedeInclinar() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Se escribe en variables CSS y no en estado: mover el puntero no re-renderiza.
function inclinar(e: PointerEvent<HTMLDivElement>) {
  if (!puedeInclinar()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--ry", `${((x - 0.5) * 2 * INCLINACION).toFixed(2)}deg`);
  el.style.setProperty("--rx", `${((0.5 - y) * 2 * INCLINACION).toFixed(2)}deg`);
  el.style.setProperty("--bx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--by", `${(y * 100).toFixed(1)}%`);
}

function soltar(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

const ACCION: Record<Categoria["id"], string> = {
  plata: "Quiero Plata",
  oro: "Quiero Oro",
  platino: "Consultar Platino",
};

export default function Membresias() {
  const { categoria, elegir } = useCategoria();
  const { mostrar } = useToast();

  const alElegir = (c: Categoria) => {
    elegir(c.id);
    mostrar(
      "exito",
      c.id === "platino"
        ? "Platino es por invitación. Déjanos tus datos y un asesor te explica cómo se accede."
        : `${c.nombre} seleccionada. Completa tus datos y un asesor te contactará.`
    );
    desplazarA("#contacto");
  };

  return (
    <Reveal as="section" id="membresias" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Membresías"
          titulo={
            <>
              Tu tarjeta de <em>socio</em> — elige tu categoría
            </>
          }
        >
          <p className={comun.aviso} role="note" data-reveal data-entrada="sube">
            <InfoCircle size={17} aria-hidden="true" />
            {AVISO_TARIFAS}
          </p>
        </Cabecera>

        <ul className={styles.lista} data-reveal data-entrada="sube">
          {CATEGORIAS.map((c) => {
            const activa = categoria === c.id;
            return (
              <li
                key={c.id}
                className={`${styles.plan} ${c.id === "oro" ? styles.destacada : ""} ${activa ? styles.activa : ""}`}
              >
                {c.id === "oro" && (
                  <p className={styles.distintivo}>Propietarios Zagari · 1.er año sin costo</p>
                )}
                {/* La tarjeta física del socio: decorativa, el texto real va debajo. */}
                <div
                  className={`${styles.tarjeta} ${styles[c.id]}`}
                  aria-hidden="true"
                  onPointerMove={inclinar}
                  onPointerLeave={soltar}
                >
                  <div className={styles.tarjetaArriba}>
                    <Image
                      src={c.id === "platino" ? "/assets/logo/zagari-logo-light.svg" : "/assets/logo/zagari-logo-dark.svg"}
                      alt=""
                      width={872}
                      height={170}
                      className={styles.logo}
                    />
                    <span className={styles.socio}>Socio</span>
                  </div>
                  <span className={styles.chip} />
                  <div className={styles.tarjetaAbajo}>
                    <span className={styles.metal}>{c.nombre}</span>
                    <span className={styles.tipo}>{c.tarjeta}</span>
                  </div>
                </div>

                <div className={styles.cuerpo}>
                  <h3 className={`display ${styles.nombre}`}>Membresía {c.nombre}</h3>
                  <p className={styles.queEs}>{c.queEs}</p>

                  <p className={styles.precio}>
                    <span className={`display ${styles.monto}`}>{soles(c.precio)}</span>
                    <span className={styles.periodo}>al año · tarifa propuesta</span>
                  </p>

                  <ul className={styles.beneficios}>
                    {DESTACADOS.map((b) => (
                      <li key={b.servicio}>
                        <TickCircle size={18} aria-hidden="true" />
                        <span>
                          <strong>{b.servicio}:</strong> {b[c.id]}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={styles.accion}
                    aria-pressed={activa}
                    onClick={() => alElegir(c)}
                  >
                    {ACCION[c.id]}
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <details className={styles.desplegable} id="beneficios">
          <summary className={styles.desplegar}>
            Ver comparativa completa de beneficios
            <ArrowDown size={18} aria-hidden="true" className={styles.flecha} />
          </summary>
          <Beneficios />
        </details>

        <p className={comun.nota} data-reveal data-entrada="sube">
          {AVISO_MODELO} Cubren al titular, su cónyuge e hijos menores de 18 años.
        </p>
      </div>
    </Reveal>
  );
}
