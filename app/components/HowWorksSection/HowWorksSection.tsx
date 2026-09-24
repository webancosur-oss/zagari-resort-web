/* HowItWorksSection.tsx */
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  CalendarCheck,
  DoorOpen,
  Sparkle,
  ChartLineUp,
} from "@phosphor-icons/react";
import styles from "./HowWorks.module.css";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  number: string;
  title: string;
  description: string;
  microcopy: string;
  icon: typeof CalendarCheck;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Antes de venir",
    description:
      "Reserva tu visita desde la app o la web, agrega a tus invitados y selecciona los servicios que quieres disfrutar.",
    microcopy: "Planifica tu visita",
    icon: CalendarCheck,
  },
  {
    number: "02",
    title: "En la puerta",
    description:
      "Al llegar, muestra tu código QR digital o tu tarjeta física de membresía. El ingreso es rápido y exclusivo para socios.",
    microcopy: "Acceso exclusivo",
    icon: DoorOpen,
  },
  {
    number: "03",
    title: "Adentro",
    description:
      "Disfruta las instalaciones según tu categoría: piscinas, gastronomía, spa, canchas, parrillas y mucho más.",
    microcopy: "Vive el club",
    icon: Sparkle,
  },
  {
    number: "04",
    title: "Al salir",
    description:
      "Consulta tus puntos acumulados y descubre cuánto te falta para acercarte a tu próxima categoría.",
    microcopy: "Tu progreso continúa",
    icon: ChartLineUp,
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const progress = progressRef.current;

    if (!section || !progress) return;

    // Importante:
    // Todo lo que GSAP crea queda dentro de este context.
    // No usamos ctx.add() dentro del callback, evitando
    // "Cannot access 'ctx' before initialization".
    const ctx = gsap.context(() => {
      const eyebrow = `.${styles.eyebrow}`;
      const heading = `.${styles.heading}`;
      const intro = `.${styles.intro}`;
      const step = `.${styles.step}`;
      const stepNumber = `.${styles.stepNumber}`;
      const icon = `.${styles.icon}`;
      const stepContent = `.${styles.stepContent}`;

      gsap.set([eyebrow, heading, intro], {
        opacity: 0,
        y: 35,
      });

      gsap.set(step, {
        opacity: 0,
        y: 50,
      });

      gsap.set(stepNumber, {
        opacity: 0.18,
        x: -18,
      });

      gsap.set(icon, {
        scale: 0.7,
        opacity: 0,
      });

      gsap.set(stepContent, {
        opacity: 0,
        x: 28,
      });

      gsap.set(progress, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      introTimeline
        .to(eyebrow, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        })
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          intro,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.45"
        );

      const stepsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.steps}`,
          start: "top 78%",
          once: true,
        },
      });

      stepsTimeline
        .to(step, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.16,
          ease: "power3.out",
        })
        .to(
          stepNumber,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.16,
            ease: "power3.out",
          },
          "<0.08"
        )
        .to(
          icon,
          {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            stagger: 0.16,
            ease: "back.out(1.7)",
          },
          "<0.04"
        )
        .to(
          stepContent,
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.16,
            ease: "power3.out",
          },
          "<0.04"
        );

      gsap.to(progress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.steps}`,
          start: "top 70%",
          end: "bottom 72%",
          scrub: 0.8,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleStepEnter = (element: HTMLElement) => {
    const card = element.querySelector<HTMLElement>(
      `.${styles.stepInner}`
    );
    const icon = element.querySelector<HTMLElement>(
      `.${styles.icon}`
    );

    if (!card || !icon) return;

    gsap.to(card, {
      x: 8,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });

    gsap.to(icon, {
      y: -3,
      rotate: -5,
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handleStepLeave = (element: HTMLElement) => {
    const card = element.querySelector<HTMLElement>(
      `.${styles.stepInner}`
    );
    const icon = element.querySelector<HTMLElement>(
      `.${styles.icon}`
    );

    if (!card || !icon) return;

    gsap.to(card, {
      x: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });

    gsap.to(icon, {
      y: 0,
      rotate: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="como-funciona"
    >
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.layout}>
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <p className={styles.eyebrow}>CÓMO FUNCIONA</p>

              <h2 className={styles.heading}>
                Simple.
                <br />
                Sin complicaciones.
                <br />
                <em>Solo disfruta.</em>
              </h2>

              <p className={styles.intro}>
                Desde que reservas hasta que termina tu visita, todo está
                pensado para que disfrutes más y gestiones menos.
              </p>

              <div className={styles.headerMark}>
                <span>01</span>
                <span className={styles.markLine} />
                <span>04</span>
              </div>
            </div>
          </header>

          <div className={styles.stepsWrapper}>
            <div className={styles.timeline} aria-hidden="true">
              <span
                ref={progressRef}
                className={styles.timelineProgress}
              />
            </div>

            <div className={styles.steps}>
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    className={styles.step}
                    key={step.number}
                    onMouseEnter={(event) =>
                      handleStepEnter(event.currentTarget)
                    }
                    onMouseLeave={(event) =>
                      handleStepLeave(event.currentTarget)
                    }
                  >
                    <div className={styles.stepInner}>
                      <div className={styles.stepNumber}>
                        <small>paso</small>
                        <span>{step.number}</span>
                      </div>

                      <div className={styles.stepIconColumn}>
                        <div className={styles.icon}>
                          <Icon size={24} weight="regular" />
                        </div>
                      </div>

                      <div className={styles.stepContent}>
                        <div className={styles.stepTopline}>
                          <span>{step.microcopy}</span>
                        </div>

                        <h3>{step.title}</h3>

                        <p>{step.description}</p>

                        <div className={styles.stepFooter}>
                          <span>0{Number(step.number)}</span>

                          <ArrowDownRight
                            size={17}
                            weight="regular"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
