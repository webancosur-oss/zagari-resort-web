import { DiscountShape, People, StarFall, Ticket } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { VENTAJAS } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./Ventajas.module.css";

const ICONOS = {
  entrada: Ticket,
  descuento: DiscountShape,
  puntos: StarFall,
  familia: People,
} as const;

/** Las ventajas de ser socio, como las "ventajas exclusivas" de la referencia. */
export default function Ventajas() {
  return (
    <Reveal as="section" id="ventajas" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={`${comun.panel} ${styles.panel}`}>
          <Cabecera
            etiqueta="Ventajas Zagari"
            titulo={
              <>
                Pagas una vez al año — <em>cada visita te conviene más</em>
              </>
            }
          />

          <ul className={`${sitio.rejilla} ${sitio.cuatro}`}>
            {VENTAJAS.map((v) => {
              const Icono = ICONOS[v.icono];
              return (
                <li key={v.titulo} className={styles.ventaja} data-reveal data-entrada="sube">
                  <span className={styles.icono}>
                    <Icono size={24} aria-hidden="true" />
                  </span>
                  <h3 className={sitio.titulo}>{v.titulo}</h3>
                  <p className={sitio.texto}>{v.texto}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
