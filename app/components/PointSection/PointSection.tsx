/* PointsSection_NuevoDiseno_GSAP.tsx */
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  CheckCircle,
  Crown,
  CalendarCheck,
  UserPlus,
  Sparkle,
} from "@phosphor-icons/react";
import styles from "./PointsSection.module.css";

gsap.registerPlugin(Flip, ScrollTrigger);

type PointRule = {
  points: string;
  title: string;
  detail: string;
  tag: string;
  icon: typeof CheckCircle;
};

const pointRules: PointRule[] = [
  {
    points: "+10",
    title: "Ingresar al club",
    detail: "Suma puntos por cada ingreso que realices a Zagari.",
    tag: "Cada visita",
    icon: CheckCircle,
  },
  {
    points: "+5",
    title: "Usar una reserva",
    detail: "Obtén puntos por cada reserva confirmada que utilices.",
    tag: "Reservas",
    icon: CalendarCheck,
  },
  {
    points: "+5",
    title: "Consumir en Zagari",
    detail: "Acumula 5 puntos por cada S/100 de consumo dentro del club.",
    tag: "Consumo",
    icon: Sparkle,
  },
  {
    points: "+50",
    title: "Recomendar a alguien",
    detail: "Recibe puntos cuando una persona recomendada se convierte en socio.",
    tag: "Referidos",
    icon: UserPlus,
  },
  {
    points: "+50",
    title: "Renovar antes",
    detail:
      "La renovación anticipada suma puntos adicionales y puede acercarte antes al siguiente nivel.",
    tag: "Renovación",
    icon: Crown,
  },
];

const levels = [
  {
    short: "P",
    name: "PLATA",
    threshold: "Inicio",
    description: "Categoría inicial",
  },
  {
    short: "O",
    name: "ORO",
    threshold: "300 puntos",
    description: "Acceso completo",
  },
  {
    short: "Pt",
    name: "PLATINO",
    threshold: "1,000 puntos",
    description: "Por invitación",
  },
];

const currentPoints = 720;
const platinumTarget = 1000;

export default function PointsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const pointsNumberRef = useRef<HTMLSpanElement | null>(null);
  const animatingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const deck = deckRef.current;
    const progress = progressRef.current;
    const pointsNumber = pointsNumberRef.current;

    if (!section || !deck || !progress || !pointsNumber) return;

    const ctx = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>(
        `.${styles.reveal}`
      );

      gsap.set(revealItems, {
        y: 42,
        opacity: 0,
      });

      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(pointsNumber, {
        textContent: 0,
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      introTimeline
        .to(revealItems, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
        })
        .to(
          progress,
          {
            scaleX: currentPoints / platinumTarget,
            duration: 1.3,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          pointsNumber,
          {
            textContent: currentPoints,
            duration: 1.2,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: () => {
              pointsNumber.textContent = Math.round(
                Number(pointsNumber.textContent)
              ).toLocaleString("es-PE");
            },
          },
          "<"
        );

      gsap.from(`.${styles.level}`, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.levels}`,
          start: "top 78%",
          once: true,
        },
      });

      gsap.from(deck, {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: deck,
          start: "top 82%",
          once: true,
        },
      });

      gsap.from(`.${styles.valueCard}`, {
        y: 25,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.valueCard}`,
          start: "top 84%",
          once: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  const moveCard = (clickedCard: HTMLElement) => {
    const deck = deckRef.current;

    if (!deck || animatingRef.current) return;

    const cards = Array.from(
      deck.querySelectorAll<HTMLElement>(`.${styles.pointCard}`)
    );

    if (cards.length < 2) return;

    // La interacción solo se permite sobre la tarjeta que ocupa
    // físicamente la primera posición de la pila.
    const frontCard = cards[0];

    if (clickedCard !== frontCard) return;

    animatingRef.current = true;
    deck.style.pointerEvents = "none";

    // 1. Capturamos el estado actual.
    const state = Flip.getState(cards, {
      props: "opacity,boxShadow",
      simple: true,
    });

    // 2. Modificamos el DOM: la tarjeta frontal pasa al último lugar.
    deck.appendChild(clickedCard);

    // 3. Flip anima todas las tarjetas hacia sus nuevas posiciones.
    Flip.from(state, {
      targets: cards,
      absolute: true,
      simple: true,
      duration: 0.72,
      ease: "power3.inOut",
      stagger: 0.025,
      onComplete: () => {
        // MUY IMPORTANTE:
        // No usamos cards[0] aquí porque ese array conserva
        // el orden anterior al appendChild().
        //
        // Buscamos nuevamente la primera tarjeta REAL del DOM.
        const newFrontCard = deck.querySelector<HTMLElement>(
          `.${styles.pointCard}:first-child`
        );

        deck.style.pointerEvents = "auto";

        if (newFrontCard) {
          newFrontCard.focus({ preventScroll: true });
        }

        animatingRef.current = false;
      },
    });

    setActiveIndex((current) => (current + 1) % pointRules.length);
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="puntos-zagari"
    >
      <div className={styles.noise} aria-hidden="true" />

      <div className={styles.container}>
        <header className={`${styles.header} ${styles.reveal}`}>
          <p className={styles.eyebrow}>PUNTOS ZAGARI</p>

          <h2 className={styles.title}>
            Cada visita <em>te acerca</em>
            <br />
            a una nueva categoría.
          </h2>

          <p className={styles.intro}>
            Tu actividad como socio se transforma en puntos. Mientras más
            participas, reservas, consumes y recomiendas, más cerca estás de
            desbloquear nuevos niveles dentro de Zagari.
          </p>
        </header>

        <div className={styles.mainGrid}>
          <div className={styles.progressPanel}>
            <div className={`${styles.progressTop} ${styles.reveal}`}>
              <div>
                <span className={styles.kicker}>TU PROGRESIÓN</span>
                <h3>
                  De Plata a <em>Platino.</em>
                </h3>
              </div>

              <div className={styles.counter}>
                <span ref={pointsNumberRef}>0</span>
                <small>/ 1,000 pts</small>
              </div>
            </div>

            <div className={`${styles.progressTrack} ${styles.reveal}`}>
              <div ref={progressRef} className={styles.progressFill} />
            </div>

            <div className={`${styles.progressLabels} ${styles.reveal}`}>
              <div>
                <span>PLATA</span>
                <small>0 puntos</small>
              </div>

              <div className={styles.currentMarker}>
                <span>ORO</span>
                <small>300 puntos</small>
              </div>

              <div>
                <span>PLATINO</span>
                <small>1,000 puntos</small>
              </div>
            </div>

            <div className={styles.levels}>
              {levels.map((level, index) => (
                <div
                  className={`${styles.level} ${
                    index === 1 ? styles.levelGold : ""
                  }`}
                  key={level.name}
                >
                  <div className={styles.levelCircle}>
                    <span>{level.short}</span>
                  </div>

                  <div className={styles.levelText}>
                    <strong>{level.name}</strong>
                    <span>{level.threshold}</span>
                    <small>{level.description}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.activitiesPanel}>
            <div className={`${styles.sectionHeading} ${styles.reveal}`}>
              <div>
                <span className={styles.kicker}>CÓMO ACUMULAR</span>
                <h3>
                  Cinco formas de <em>sumar puntos.</em>
                </h3>
              </div>
            </div>

            <div
              ref={deckRef}
              className={styles.deck}
              aria-live="polite"
            >
              {pointRules.map((rule, index) => {
                const Icon = rule.icon;

                return (
                  <article
                    key={rule.title}
                    className={styles.pointCard}
                    data-card-index={index}
                    data-flip-id={`zagari-point-card-${index}`}
                    tabIndex={index === 0 ? 0 : -1}
                    onClick={(event) =>
                      moveCard(event.currentTarget as HTMLElement)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        moveCard(event.currentTarget as HTMLElement);
                      }
                    }}
                    aria-label={`${rule.title}. ${rule.points} puntos`}
                  >
                    <div className={styles.cardMeta}>
                      <span>{rule.tag}</span>

                      <span className={styles.cardIcon}>
                        <Icon size={17} weight="regular" />
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.points}>{rule.points}</div>

                      <div>
                        <h4>{rule.title}</h4>
                        <p>{rule.detail}</p>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardLine} />

                      <span className={styles.cardAction}>
                        Explorar
                        <ArrowRight size={14} weight="regular" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className={styles.deckStatus}>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(pointRules.length).padStart(2, "0")}
              </span>

              <span>Haz clic en la tarjeta para continuar</span>
            </div>
          </div>
        </div>

        <div className={`${styles.bottomGrid} ${styles.reveal}`}>
          <div className={styles.valueCard}>
            <span className={styles.kicker}>VALOR DE TUS PUNTOS</span>

            <div className={styles.valueMain}>
              <strong>100</strong>
              <span>puntos</span>
              <b>=</b>
              <strong>S/10</strong>
              <span>de valor</span>
            </div>

            <p>
              Tus puntos pueden convertirse en saldo de consumo dentro de las
              opciones de canje definidas por Zagari.
            </p>
          </div>

          <div className={styles.ruleCard}>
            <span className={styles.kicker}>LA LÓGICA ES SIMPLE</span>

            <p>
              <strong>Participa.</strong> Acumula puntos.
              <br />
              <strong>Sube de categoría.</strong> Accede a una experiencia
              cada vez más completa.
            </p>

            <span className={styles.ruleArrow}>
              <ArrowRight size={22} weight="regular" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
