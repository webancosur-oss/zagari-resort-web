import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { PROMOCIONES } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import styles from "./Promociones.module.css";

/** Promociones del inicio: un mosaico de tres fotos, el detalle vive en /promociones. */
export default function Promociones() {
  return (
    <Reveal as="section" id="promociones" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Promociones"
          titulo={
            <>
              Beneficios que empiezan <em>desde el primer día</em>
            </>
          }
          enlace={{ label: "Ver todas las promociones", href: "/promociones" }}
        />

        <ul className={styles.mosaico}>
          {PROMOCIONES.map((p, i) => (
            <li key={p.id} className={`${styles.pieza} ${i === 0 ? styles.grande : ""}`} data-reveal data-entrada="sube">
              <Image
                src={p.foto.src}
                alt={p.foto.alt}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
                className={styles.imagen}
              />
              <span className={styles.velo} aria-hidden="true" />
              <div className={styles.texto}>
                <h3 className={`display ${styles.titulo}`}>{p.titulo}</h3>
                <p className={styles.parrafo}>{p.texto}</p>
                <Link href={p.enlace.href} className={styles.enlace}>
                  {p.enlace.label}
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
