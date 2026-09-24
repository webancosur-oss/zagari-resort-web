"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import styles from "./ExperienciasSection.module.css";

gsap.registerPlugin(Flip, ScrollTrigger);

type Experience = {
  title: string;
  description: string;
  image: string;
};

const experiences = [
 
  {
    title: "Bar de piscina",
    image: "/assets/amenities/element-agua-bar-piscina.webp",
  },
  {
    title: "Lago",
    image: "/assets/amenities/element-agua-lago.webp",
  },
  {
    title: "Piscina de borde infinito",
    image: "/assets/amenities/element-agua-piscina-borde-infinito.webp",
  },
  {
    title: "Domo",
    image: "/assets/amenities/element-aire-domo.webp",
  },
  {
    title: "Mirador",
    image: "/assets/amenities/element-aire-mirador.webp",
  },
  {
    title: "Camping",
    image: "/assets/amenities/element-fuego-camping.webp",
  },
  {
    title: "Zona espiritual",
    image: "/assets/amenities/element-fuego-zona-espiritual.webp",
  },
  {
    title: "Bar restaurante",
    image: "/assets/amenities/element-tierra-bar-restaurante.webp",
  },
];

export default function ExperienciasSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;

    if (!section || !gallery) return;

    let flipContext: gsap.Context | null = null;
    let resizeTimer: number | undefined;

    const createAnimation = () => {
      // Limpia la animación anterior antes de reconstruirla.
      flipContext?.revert();
      flipContext = null;

      gallery.classList.remove(styles.galleryFinal);

      const items = Array.from(
        gallery.querySelectorAll<HTMLElement>("[data-gallery-item]"),
      );

      if (!items.length) return;

      flipContext = gsap.context(() => {
        /*
         * 1. Capturamos el layout Bento inicial.
         * 2. Aplicamos temporalmente el layout final.
         * 3. FLIP calcula la transformación entre ambos estados.
         * 4. ScrollTrigger scrubea esa transición con el scroll.
         */
        gallery.classList.add(styles.galleryFinal);

        const state = Flip.getState(items, {
          props: "borderRadius",
        });

        gallery.classList.remove(styles.galleryFinal);

        const flip = Flip.to(state, {
          simple: true,
          ease: "expoScale(1, 5)",
          duration: 1,
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: gallery,
            start: "center center",
            end: "+=130%",
            scrub: 1,
            pin: gallery.parentElement,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.add(flip);

        return () => {
          timeline.scrollTrigger?.kill();
          gsap.set(items, {
            clearProps: "width,height,top,left,x,y,transform,position",
          });
        };
      }, section);
    };

    createAnimation();

    const handleResize = () => {
      if (resizeTimer !== undefined) {
        window.clearTimeout(resizeTimer);
      }

      resizeTimer = window.setTimeout(() => {
        createAnimation();
        ScrollTrigger.refresh();
        resizeTimer = undefined;
      }, 180);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeTimer !== undefined) {
        window.clearTimeout(resizeTimer);
      }

      window.removeEventListener("resize", handleResize);
      flipContext?.revert();
      flipContext = null;
    };
  }, []);

  return (
    <section
        id="experiencias"
      ref={sectionRef}
      className={styles.section}
      aria-label="Experiencias de Zagari"
    >
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.eyebrow}>EXPERIENCIAS</span>

          <h2 className={styles.title}>
            Cada rincón de Zagari
            <em>tiene algo para ti.</em>
          </h2>
        </div>

        <p className={styles.intro}>
          Instalaciones diseñadas para el placer, el descanso y el encuentro.
          Para socios y sus invitados.
        </p>
      </header>

      <div className={styles.galleryWrap}>
        <div
          ref={galleryRef}
          className={styles.gallery}
          id="zagari-experiences-gallery"
        >
          {experiences.map((experience) => (
            <article
              key={experience.title}
              className={styles.item}
              data-gallery-item
            >
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url("${experience.image}")`,
                }}
                role="img"
                aria-label={experience.title}
              />

              <div className={styles.itemOverlay} />

              <div className={styles.itemContent}>
                <span className={styles.itemTitle}>
                  {experience.title}
                </span>
{/* 
                <span className={styles.itemDescription}>
                  {experience.description}
                </span> */}
              </div>

              <span className={styles.itemArrow} aria-hidden="true">
                <ArrowUpRight size={17} weight="regular" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
