import Link from "next/link";
import { ArrowRight, TickCircle } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { BENEFICIOS, CATEGORIAS } from "../../lib/modelo";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./MembresiasResumen.module.css";

const CLAVE = ["Ingreso al club", "Invitados sin costo", "Restaurante, bar y market"];
const DESTACADOS = BENEFICIOS.filter((b) => CLAVE.includes(b.servicio));

/** Las tres categorías en corto; el detalle y la comparativa están en /membresias. */
export default function MembresiasResumen() {
  return (
    <Reveal as="section" id="membresias" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Membresías"
          titulo={
            <>
              Plata, Oro y Platino — <em>una para cada forma de vivir el club</em>
            </>
          }
          enlace={{ label: "Comparar beneficios", href: "/membresias#beneficios" }}
        />

        <ul className={`${sitio.rejilla} ${sitio.tres}`}>
          {CATEGORIAS.map((c) => (
            <li key={c.id} className={`${sitio.tarjeta} ${sitio.blanca}`} data-reveal data-entrada="sube">
              <span className={`${styles.franja} ${styles[c.id]}`} aria-hidden="true" />
              <div className={sitio.cuerpo}>
                <p className={sitio.etiqueta}>
                  {c.id === "oro" ? "Propietarios Zagari · 1.er año sin costo" : c.queEs}
                </p>
                <h3 className={`display ${styles.nombre}`}>{c.nombre}</h3>
                <ul className={sitio.lista}>
                  {DESTACADOS.map((b) => (
                    <li key={b.servicio}>
                      <TickCircle size={18} aria-hidden="true" />
                      <span>
                        <strong>{b.servicio}:</strong> {b[c.id]}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={`/membresias?categoria=${c.id}`} className={`${sitio.enlaceFlecha} ${sitio.cubre}`}>
                  Ver membresía {c.nombre}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
