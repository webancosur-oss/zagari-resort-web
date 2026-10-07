"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "reicon-react";

import styles from "./ExperienceStackedSlider.module.css";

interface Slide {
  image: string;
  title: string;
  description: string;
  imagePosition?: string;
}

const slides: Slide[] = [
  {
    image:
      "/assets/images/experiences/experience1.webp",
    title: "TU ESCAPADA COMIENZA AQUÍ",
    description:
      "Piscinas, naturaleza y espacios diseñados para disfrutar cada visita de una manera diferente.",
    imagePosition: "center center",
  },
  {
    image:
      "/assets/images/amenities/element-agua-lago.webp",
    title: "MOMENTOS PARA COMPARTIR",
    description:
      "Ambientes pensados para conectar, relajarte y disfrutar experiencias que permanecen.",
    imagePosition: "center center",
  },
  {
    image:
      "/assets/images/amenities/element-aire-mirador.webp",
    title: "UNA EXPERIENCIA DIFERENTE",
    description:
      "Espacios donde la naturaleza, el diseño y el descanso se encuentran.",
    imagePosition: "center center",
  },
  {
    image: "/assets/images/cabagnas/cabagna2.jpeg",
    title: "NATURALEZA Y DESCANSO",
    description:
      "Jardines abiertos y rincones tranquilos para desconectar sin prisa.",
    imagePosition: "center center",
  },
];

const PEEK_COUNT = 3;

export default function ExperienceStackedSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = slides.length;

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % total);
  };

  const previousSlide = () => {
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  const getSlideIndex = (offset: number) => {
    return (activeIndex + offset + total) % total;
  };

  const goToOffset = (offset: number) => {
    setActiveIndex(getSlideIndex(offset));
  };

  const activeSlide = slides[getSlideIndex(0)];

  const peeks = Array.from(
    { length: Math.min(PEEK_COUNT, total - 1) },
    (_, i) => ({
      offset: i + 1,
      slide: slides[getSlideIndex(i + 1)],
    })
  );

  return (
    <section className={styles.section}>
      <div className={styles.slider}>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={previousSlide}
          aria-label="Experiencia anterior"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div className={styles.viewport}>
          <div className={styles.track}>

            <div className={styles.mainImage}>
              <Image
                key={activeSlide.image}
                src={activeSlide.image}
                alt={activeSlide.title}
                fill
                sizes="(max-width: 700px) 100vw, 60vw"
                className={styles.image}
                style={{
                  objectPosition:
                    activeSlide.imagePosition || "center",
                }}
              />

              <div className={styles.imageOverlay} />
            </div>

            <div className={styles.info}>
              <div className={styles.infoContent}>
                <span className={styles.kicker}>
                  ZAGARI RESORT CLUB
                </span>

                <h2>{activeSlide.title}</h2>

                <p>{activeSlide.description}</p>

              </div>
            </div>

            {peeks.map(({ offset, slide }) => (
              <button
                key={`peek-${offset}-${slide.image}`}
                type="button"
                className={[
                  styles.nextPreview,
                  styles[`peek${offset}`],
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => goToOffset(offset)}
                aria-label={`Ir a: ${slide.title}`}
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="10vw"
                  className={styles.image}
                />

                <span className={styles.previewOverlay} />
              </button>
            ))}

          </div>
        </div>

        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={nextSlide}
          aria-label="Siguiente experiencia"
        >
          <ChevronRight size={22} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
