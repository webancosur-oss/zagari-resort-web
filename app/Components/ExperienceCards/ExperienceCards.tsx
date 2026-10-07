"use client";

import Image from "next/image";

import { useSnapCarousel } from "../../lib/useSnapCarousel";
import Reveal from "../Reveal/Reveal";
import CarouselArrow from "../ui/CarouselArrow/CarouselArrow";

import type { ExperienceCard } from "./experienceCards.data";

import styles from "./ExperienceCards.module.css";

interface ExperienceCardsProps {
  cards: ExperienceCard[];

  label?: string;
}

export default function ExperienceCards({
  cards,
  label = "Experiencias de Zagari Resort Club",
}: ExperienceCardsProps) {
  const count = cards.length;

  const { trackRef, index, atStart, atEnd, next, prev } =
    useSnapCarousel(count);

  if (count === 0) return null;

  return (
    <Reveal
      as="section"
      className={styles.section}
      duration={0.85}
      distance={24}
      aria-roledescription="carrusel"
      aria-label={label}
    >
      <div className={styles.stage}>

        <div
          ref={trackRef}
          className={styles.track}
          tabIndex={0}
          role="group"
          aria-label={`${label}: ${index + 1} de ${count}`}
        >
          {cards.map((card, i) => (
            <article
              key={card.image}
              className={styles.card}
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${count}`}
            >
              <div className={styles.media}>
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(min-width: 1200px) 23vw, (min-width: 900px) 29vw, (min-width: 600px) 41vw, 74vw"
                  className={styles.image}
                  style={{
                    objectPosition:
                      card.imagePosition ?? "center",
                  }}
                />
              </div>

              <div className={styles.body}>
                <span
                  className={styles.accent}
                  aria-hidden="true"
                />

                <div className={styles.copy}>
                  <h3 className={styles.category}>
                    {card.category}
                  </h3>

                  <p className={styles.description}>
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {count > 1 && (
          <>
            <CarouselArrow
              direction="prev"
              onClick={prev}
              disabled={atStart}
              tone="plain"
              label="Experiencias anteriores"
              className={styles.navPrev}
            />

            <CarouselArrow
              direction="next"
              onClick={next}
              disabled={atEnd}
              tone="plain"
              label="Experiencias siguientes"
              className={styles.navNext}
            />
          </>
        )}

      </div>
    </Reveal>
  );
}
