 "use client";

import {
  ArrowDown,
  ArrowRight,
  Crown,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import styles from "./ElClubSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ElClubSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const firstSectionRef = useRef<HTMLDivElement | null>(null);
  const secondSectionRef = useRef<HTMLDivElement | null>(null);
  const firstContentRef = useRef<HTMLDivElement | null>(null);
  const secondContentRef = useRef<HTMLDivElement | null>(null);
  const firstImageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const firstSection = firstSectionRef.current;
    const secondSection = secondSectionRef.current;
    const firstContent = firstContentRef.current;
    const secondContent = secondContentRef.current;
    const firstImage = firstImageRef.current;

    if (
      !section ||
      !firstSection ||
      !secondSection ||
      !firstContent ||
      !secondContent ||
      !firstImage
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const introItems = firstContent.querySelectorAll(
        "[data-intro-item]",
      );
      const cards = secondContent.querySelectorAll(
        "[data-card]",
      );

      gsap.set(secondSection, {
        yPercent: 100,
        opacity: 1,
      });

      gsap.set(firstContent, {
        opacity: 1,
        y: 0,
      });

      gsap.set(secondContent, {
        opacity: 0,
        y: 50,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(firstImage, {
          scale: 1.04,
          duration: 0.45,
        })
        .to(
          introItems,
          {
            opacity: 0,
            y: -35,
            stagger: 0.035,
            duration: 0.18,
          },
          0.42,
        )
        .to(
          firstSection,
          {
            opacity: 0,
            duration: 0.22,
          },
          0.58,
        )
        .to(
          secondSection,
          {
            yPercent: 0,
            duration: 0.42,
          },
          0.48,
        )
        .to(
          secondContent,
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
          },
          0.72,
        )
        .fromTo(
          cards,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.22,
          },
          0.78,
        );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="el-club"
      ref={sectionRef}
      className={styles.section}
      aria-label="El Club Zagari"
    >
      {/* =====================================================
          SECCIÓN 1 — EL CLUB
      ====================================================== */}
      <div
        ref={firstSectionRef}
        className={styles.screen}
        data-section="club"
      >
        <div
          ref={firstImageRef}
          className={styles.backgroundImage}
          aria-hidden="true"
        />

        <div className={styles.overlay} aria-hidden="true" />

        <div
          ref={firstContentRef}
          className={`${styles.content} ${styles.firstContent}`}
        >
          <span
            className={styles.eyebrow}
            data-intro-item
          >
            EL CLUB
          </span>

          <h2
            className={styles.title}
            data-intro-item
          >
            <span>No es solo un resort.</span>
            <em>Es un lugar al que perteneces.</em>
          </h2>

          <p
            className={styles.description}
            data-intro-item
          >
            Zagari es un club privado donde los socios disfrutan de
            instalaciones de primer nivel, experiencias diseñadas para el
            bienestar y beneficios exclusivos según su categoría. No es un
            hotel al que llegas una vez. Es el lugar al que vuelves.
          </p>

          <div
            className={styles.scrollHint}
            data-intro-item
          >
            <span>DESCUBRE EL CLUB</span>
            <ArrowDown size={17} weight="regular" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* =====================================================
          SECCIÓN 2 — CÓMO FUNCIONA
      ====================================================== */}
      <div
        ref={secondSectionRef}
        className={`${styles.screen} ${styles.secondScreen}`}
        data-section="como-funciona"
      >
        <div className={styles.secondBackground} aria-hidden="true" />

        <div className={styles.secondOverlay} aria-hidden="true" />

        <div
          ref={secondContentRef}
          className={`${styles.content} ${styles.secondContent}`}
        >
          <div className={styles.secondHeader}>
            <div>
              <span className={styles.eyebrow}>
                CÓMO FUNCIONA
              </span>

              <h3 className={styles.sectionTitle}>
                Una experiencia que crece contigo.
              </h3>
            </div>

            <p className={styles.sectionDescription}>
              Tu membresía te permite disfrutar del club, acumular puntos
              y acceder progresivamente a mayores beneficios.
            </p>
          </div>

          <div className={styles.cards}>
            <article
              className={styles.card}
              data-card
            >
              <div className={styles.cardIcon}>
                <UsersThree
                  size={27}
                  weight="regular"
                  aria-hidden="true"
                />
              </div>

              <span className={styles.cardLabel}>
                ACCESO
              </span>

              <h4>Disfruta el club</h4>

              <p>
                Accede a las instalaciones y vive cada visita con los
                beneficios correspondientes a tu membresía.
              </p>
            </article>

            <article
              className={styles.card}
              data-card
            >
              <div className={styles.cardIcon}>
                <Sparkle
                  size={27}
                  weight="regular"
                  aria-hidden="true"
                />
              </div>

              <span className={styles.cardLabel}>
                PUNTOS
              </span>

              <h4>Acumula beneficios</h4>

              <p>
                Tus visitas, reservas, consumos y renovaciones pueden
                convertirse en puntos dentro del club.
              </p>
            </article>

            <article
              className={styles.card}
              data-card
            >
              <div className={styles.cardIcon}>
                <Crown
                  size={27}
                  weight="regular"
                  aria-hidden="true"
                />
              </div>

              <span className={styles.cardLabel}>
                CATEGORÍA
              </span>

              <h4>Crece dentro de Zagari</h4>

              <p>
                A medida que acumulas puntos puedes avanzar de categoría
                y acceder a una experiencia con más beneficios.
              </p>

              <a
                href="#membresias"
                className={styles.cardLink}
              >
                <span>Ver membresías</span>
                <ArrowRight
                  size={16}
                  weight="regular"
                  aria-hidden="true"
                />
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
