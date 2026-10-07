import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { ELEMENTOS } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./ExperienciaZagari.module.css";

/** La experiencia del club por sus cuatro elementos y sus +20 amenidades. */
export default function ExperienciaZagari() {
  return (
    <Reveal as="section" id="experiencia" className={`${comun.seccion} ${comun.bosque}`}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Experiencia Zagari"
          titulo={
            <>
              Más de 20 amenidades — <em>conectadas con los elementos</em>
            </>
          }
          intro="Aire, fuego, tierra y agua ordenan el club: piscinas, miradores, biohuerto, deporte, descanso y gastronomía."
          enlace={{ label: "Ver todas las experiencias", href: "/experiencias" }}
        />

        <ul className={`${sitio.rejilla} ${sitio.cuatro}`}>
          {ELEMENTOS.map((e) => {
            const portada = e.amenidades[0];
            return (
              <li key={e.id} className={styles.elemento} data-reveal data-entrada="sube">
                <Image
                  src={portada.foto.src}
                  alt={portada.foto.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={styles.imagen}
                />
                <span className={styles.velo} aria-hidden="true" />
                <div className={styles.texto}>
                  <p className={styles.nombre}>{e.nombre}</p>
                  <p className={styles.lema}>{e.lema}</p>
                  <p className={styles.incluye}>{e.amenidades.map((a) => a.nombre).join(" · ")}</p>
                  <Link href={`/experiencias#${e.id}`} className={`${styles.enlace} ${sitio.cubre}`}>
                    Explorar {e.nombre.toLowerCase()}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
