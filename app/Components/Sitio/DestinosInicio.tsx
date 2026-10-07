"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Location } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { DESTINOS } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./DestinosInicio.module.css";

/** Destinos del club en pestañas, como el carrusel de destinos de la referencia. */
export default function DestinosInicio() {
  const base = useId();
  const [activo, setActivo] = useState(0);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const destino = DESTINOS[activo];
  const abierto = destino.estado === "abierto";

  // Flechas entre pestañas, como pide el patrón de pestañas accesibles.
  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const siguiente = (activo + paso + DESTINOS.length) % DESTINOS.length;
    setActivo(siguiente);
    pestanas.current[siguiente]?.focus();
  };

  return (
    <Reveal as="section" id="destinos" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Destinos"
          titulo={
            <>
              Elige dónde <em>vivir lo natural</em>
            </>
          }
          enlace={{ label: "Ver destinos y cabañas", href: "/destinos" }}
        />

        <div
          className={sitio.pestanas}
          role="tablist"
          aria-label="Destinos"
          onKeyDown={alTeclear}
          data-reveal
          data-entrada="sube"
        >
          {DESTINOS.map((d, i) => (
            <button
              key={d.id}
              ref={(el) => {
                pestanas.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${d.id}`}
              aria-selected={i === activo}
              aria-controls={`${base}-panel`}
              tabIndex={i === activo ? 0 : -1}
              className={sitio.pestana}
              onClick={() => setActivo(i)}
            >
              {d.nombre}
              {d.estado === "proximamente" && <span className={sitio.pildora}>Próximamente</span>}
            </button>
          ))}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${destino.id}`}
          className={styles.panel}
          data-reveal
          data-entrada="sube"
        >
          <div className={styles.foto}>
            <Image
              key={destino.id}
              src={destino.foto.src}
              alt={destino.foto.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={styles.imagen}
            />
            {!abierto && <span className={styles.sello}>Próximamente</span>}
          </div>

          <div className={styles.cuerpo}>
            <p className={styles.region}>
              <Location size={16} aria-hidden="true" />
              {destino.region}
            </p>
            <h3 className={`display ${styles.nombre}`}>{destino.nombre}</h3>
            <p className={styles.resumen}>{destino.resumen}</p>

            <ul className={sitio.chips}>
              {destino.datos.map((d) => (
                <li key={d} className={sitio.chip}>
                  {d}
                </li>
              ))}
            </ul>

            <div className={sitio.acciones}>
              <Link
                href={abierto ? `/destinos#${destino.id}` : "/destinos#oxapampa"}
                className={comun.boton}
              >
                {abierto ? "Ver destino" : "Avísame cuando abra"}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
