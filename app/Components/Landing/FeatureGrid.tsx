import Image from "next/image";

import Reveal from "../Reveal/Reveal";
import type { GalleryItem } from "../ExperienceGallery/experienceGallery.data";

import styles from "./FeatureGrid.module.css";

export interface FeatureGridProps {
  id?: string;
  eyebrow?: string;
  titulo?: string;
  texto?: string;
  items: readonly GalleryItem[];
  tono?: "claro" | "crema";
}

export default function FeatureGrid({
  id,
  eyebrow,
  titulo,
  texto,
  items,
  tono = "claro",
}: FeatureGridProps) {
  return (
    <Reveal as="section" id={id} className={`${styles.section} ${styles[tono]}`}>
      <div className={styles.inner}>
        {(eyebrow || titulo || texto) && (
          <header className={styles.cabecera}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            {titulo && <h2 className={`display ${styles.titulo}`}>{titulo}</h2>}
            {texto && <p className={styles.parrafo}>{texto}</p>}
          </header>
        )}

        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.title} className={styles.card}>
              <figure className={styles.media}>
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 92vw"
                  className={styles.imagen}
                />
              </figure>

              <div className={styles.cuerpo}>
                <h3 className={styles.cardTitulo}>{item.title}</h3>
                <p className={styles.cardTexto}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
