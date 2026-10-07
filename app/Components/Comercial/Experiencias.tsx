import Image from "next/image";

import Reveal from "../Reveal/Reveal";
import { EXCLUSIVE_EXPERIENCES } from "../ExperienceGallery/experienceGallery.data";
import { ACCESOS } from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Experiencias.module.css";

// La tarjeta de oferta de la referencia, con un dato real del modelo.
const PROPIETARIO = ACCESOS[0];

export default function Experiencias() {
  const [a, b, c, d, e, f] = EXCLUSIVE_EXPERIENCES;
  const piezas = [
    { item: a, clase: styles.a },
    { item: b, clase: styles.b },
    { item: c, clase: styles.c },
    { item: d, clase: styles.d },
    { item: e, clase: styles.e },
    { item: f, clase: styles.f },
  ];

  return (
    <Reveal as="section" id="experiencias" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Experiencias exclusivas"
          titulo={
            <>
              Todo lo que <em>puedes ver</em> — en Zagari
            </>
          }
          enlace={{ label: "Ver membresías", href: "#membresias" }}
        />

        <ul className={styles.galeria} data-reveal data-entrada="sube">
          {piezas.map(({ item, clase }, i) => (
            <li key={item.title} className={`${styles.pieza} ${clase}`}>
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes={i === 2 ? "(min-width: 900px) 46vw, 92vw" : "(min-width: 900px) 30vw, 46vw"}
                className={styles.imagen}
              />
              <span className={styles.titulo}>{item.title}</span>
            </li>
          ))}

          <li className={styles.oferta}>
            <span className={styles.ofertaMarca}>Zagari Resort Club</span>
            <span className={styles.ofertaQuien}>{PROPIETARIO.quien}</span>
            <strong className={`display ${styles.ofertaDato}`}>
              1er año
              <br />
              sin costo
            </strong>
            <span className={styles.ofertaSello}>Membresía Oro</span>
          </li>
        </ul>

        <p className={comun.nota} data-reveal data-entrada="sube">
          Imágenes referenciales del proyecto.
        </p>
      </div>
    </Reveal>
  );
}
