import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "reicon-react";

import Reveal from "../Reveal/Reveal";

import styles from "./HomeGallery.module.css";

const A = "/assets/images/amenities";
const E = "/assets/images/experiences";

const FOTOS = [
  {
    src: `${A}/element-agua-piscina-borde-infinito.webp`,
    alt: "Piscina de borde infinito con palmeras",
    clase: "alta",
  },
  {
    src: `${A}/element-aire-mirador.webp`,
    alt: "Torre mirador de madera sobre el bosque",
    clase: "normal",
  },
  {
    src: `${A}/element-fuego-camping.webp`,
    alt: "Zona de camping de noche con fogata",
    clase: "normal",
  },
  {
    src: `${A}/element-tierra-restaurant.webp`,
    alt: "Salón del restaurante de madera",
    clase: "ancha",
  },
  {
    src: `${E}/experience9.webp`,
    alt: "Vista aérea de la piscina y los espacios del club",
    clase: "normal",
  },
];

export default function HomeGallery() {
  return (
    <section className={styles.section} id="galeria">
      <div className={styles.inner}>

        <header className={styles.cabecera}>
          <div>
            <p className={styles.eyebrow}>El club</p>

            <h2 className={styles.titulo}>
              Galería{" "}
              <span className={styles.suave}>de Zagari</span>
            </h2>
          </div>

          <Link href="/experiencias/exclusivas" className={styles.verTodo}>
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <Reveal className={styles.mosaico}>
          {FOTOS.map((f) => (
            <figure
              key={f.src}
              className={`${styles.celda} ${styles[f.clase]}`}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes="(min-width: 900px) 40vw, 92vw"
                className={styles.imagen}
              />
            </figure>
          ))}

          <div className={styles.promo}>
            <p className={styles.promoEyebrow}>
              Membresías Zagari
            </p>

            <p className={styles.promoTitulo}>
              Plata, Oro y Platino
            </p>

            <p className={styles.promoTexto}>
              Cada visita suma. Avanza de categoría y
              descubre nuevos privilegios.
            </p>

            <Link
              href="/membresias/niveles"
              className={styles.promoCta}
            >
              Ver niveles
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
