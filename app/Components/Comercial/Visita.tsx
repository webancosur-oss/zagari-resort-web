import Image from "next/image";

import Reveal from "../Reveal/Reveal";
import { VISITA } from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Visita.module.css";

const MINIATURAS = [
  { src: "/assets/images/cabagnas/cabagna3.jpeg", alt: "Cabaña del club entre la vegetación" },
  { src: "/assets/images/experiences/portico.webp", alt: "Pórtico de ingreso al club" },
  { src: "/assets/images/experiences/experience2.webp", alt: "Bar dentro de la piscina bajo la pérgola" },
  { src: "/assets/images/experiences/experience13.webp", alt: "Piscina con cascada rodeada de vegetación" },
];

export default function Visita() {
  return (
    <Reveal as="section" id="visita" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Tu visita"
          titulo={
            <>
              Un día en el club — <em>sin trámites</em>
            </>
          }
        />

        <div className={styles.disposicion}>
          <article className={styles.destacado} data-reveal data-entrada="sube">
            <div className={styles.foto}>
              <Image
                src="/assets/images/heroes/portico_familia.webp"
                alt="Familia caminando hacia el pórtico de ingreso de Zagari"
                fill
                sizes="(min-width: 900px) 50vw, 92vw"
                className={styles.imagen}
              />
            </div>
            <p className={styles.categoria}>Modelo propuesto</p>
            <h3 className={styles.tituloDestacado}>Del pórtico a la piscina, en cuatro pasos</h3>
            <p className={styles.meta}>La aplicación del socio forma parte del proyecto y aún no está disponible.</p>
          </article>

          <ol className={styles.pasos} data-reveal data-entrada="sube">
            {VISITA.map((v, i) => (
              <li key={v.paso} className={styles.paso}>
                <div className={styles.miniatura}>
                  <Image
                    src={MINIATURAS[i].src}
                    alt={MINIATURAS[i].alt}
                    fill
                    sizes="140px"
                    className={styles.imagen}
                  />
                </div>
                <div>
                  <h3 className={styles.tituloPaso}>
                    <span className={styles.numero}>Paso {i + 1}</span> {v.paso}
                  </h3>
                  <p className={styles.detalle}>{v.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Reveal>
  );
}
