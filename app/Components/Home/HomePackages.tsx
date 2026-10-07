import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "reicon-react";

import Reveal from "../Reveal/Reveal";

import styles from "./HomePackages.module.css";

const PAQUETES = [
  {
    href: "/experiencias/exclusivas",
    titulo: "Experiencias exclusivas",
    texto:
      "Piscinas, gastronomía de autor, spa y deporte con vista al valle.",
    imagen: "/assets/images/amenities/element-agua-bar-piscina.webp",
    alt: "Barra dentro de la piscina con vista a las montañas",
    etiquetas: ["Piscinas", "Gastronomía"],
  },
  {
    href: "/experiencias/familiares",
    titulo: "Experiencia familiar",
    texto:
      "Cabañas, miradores, biohuerto y senderos para toda la familia.",
    imagen: "/assets/images/amenities/cabanias-alojamiento.webp",
    alt: "Cabañas de madera del club entre la vegetación",
    etiquetas: ["Cabañas", "Naturaleza"],
  },
  {
    href: "/eventos/sociales",
    titulo: "Reuniones y eventos",
    texto:
      "Bodas, celebraciones y jornadas de empresa con montaje a medida.",
    imagen: "/assets/images/experiences/experience7.webp",
    alt: "Celebración bajo toldo blanco con vista al valle",
    etiquetas: ["Sociales", "Corporativos"],
  },
];

export default function HomePackages() {
  return (
    <section className={styles.section} id="experiencias">
      <div className={styles.inner}>

        <header className={styles.cabecera}>
          <p className={styles.eyebrow}>Qué puedes vivir</p>

          <h2 className={styles.titulo}>
            Experiencias{" "}
            <span className={styles.suave}>para ti</span>
          </h2>
        </header>

        <div className={styles.grid}>
          {PAQUETES.map((p, i) => (
            <Reveal
              key={p.href}
              as="article"
              className={styles.card}
              delay={i * 0.09}
            >
              <Link href={p.href} className={styles.enlace}>
                <Image
                  src={p.imagen}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1000px) 32vw, (min-width: 640px) 46vw, 90vw"
                  className={styles.imagen}
                />

                <span className={styles.velo} aria-hidden="true" />

                <span className={styles.contenido}>
                  <span className={styles.cardTitulo}>
                    {p.titulo}
                  </span>

                  <span className={styles.cardTexto}>
                    {p.texto}
                  </span>

                  <span className={styles.pie}>
                    <span className={styles.etiquetas}>
                      {p.etiquetas.map((e) => (
                        <span key={e} className={styles.etiqueta}>
                          {e}
                        </span>
                      ))}
                    </span>

                    <span className={styles.flecha}>
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
