import Image from "next/image";
import { Drop, Flame, Leaf, Wind } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { AMENIDADES, AVISO_IMAGENES, ELEMENTOS } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./Elementos.module.css";

const ICONOS = { agua: Drop, aire: Wind, fuego: Flame, tierra: Leaf } as const;

/** Las amenidades del club por elemento, y la lista completa al final. */
export default function Elementos() {
  return (
    <>
      <nav className={styles.indice} aria-label="Elementos">
        <ul className={styles.indiceLista}>
          {ELEMENTOS.map((e) => {
            const Icono = ICONOS[e.id];
            return (
              <li key={e.id}>
                <a href={`#${e.id}`} className={`${styles.indiceEnlace} ${styles[e.id]}`}>
                  <Icono size={18} aria-hidden="true" />
                  {e.nombre}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {ELEMENTOS.map((e, i) => {
        const Icono = ICONOS[e.id];
        return (
          <Reveal
            key={e.id}
            as="section"
            id={e.id}
            className={`${comun.seccion} ${styles.ancla} ${i % 2 ? styles.alterna : ""}`}
            aria-labelledby={`titulo-${e.id}`}
          >
            <div className={comun.inner}>
              <header className={styles.cabecera} data-reveal data-entrada="sube">
                <span className={`${styles.sello} ${styles[e.id]}`}>
                  <Icono size={26} aria-hidden="true" />
                </span>
                <div>
                  <h2 id={`titulo-${e.id}`} className={`display ${styles.nombre}`}>
                    {e.nombre}
                  </h2>
                  <p className={styles.lema}>{e.lema}</p>
                </div>
              </header>

              <ul className={`${sitio.rejilla} ${e.amenidades.length > 3 ? sitio.cuatro : sitio.tres}`}>
                {e.amenidades.map((a) => (
                  <li key={a.nombre} className={`${sitio.tarjeta} ${sitio.blanca}`} data-reveal data-entrada="sube">
                    <div className={sitio.foto}>
                      <Image src={a.foto.src} alt={a.foto.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                    </div>
                    <div className={sitio.cuerpo}>
                      <h3 className={sitio.titulo}>{a.nombre}</h3>
                      <p className={sitio.texto}>{a.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}

      <Reveal as="section" id="amenidades" className={comun.seccion}>
        <div className={comun.inner}>
          <div className={comun.panel}>
            <p className={comun.etiqueta} data-reveal data-entrada="sube">
              Resort Club
            </p>
            <h2 className={`display ${comun.titulo}`} data-reveal data-entrada="sube">
              Más de 20 amenidades — <em>todo en un mismo lugar</em>
            </h2>
            <ul className={`${sitio.chips} ${styles.amenidades}`} data-reveal data-entrada="sube">
              {AMENIDADES.map((a) => (
                <li key={a} className={sitio.chip}>
                  {a}
                </li>
              ))}
            </ul>
            <p className={sitio.referencial}>{AVISO_IMAGENES}</p>
          </div>
        </div>
      </Reveal>
    </>
  );
}
