"use client";

import { ArrowRight, Check, Crown } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import styles from "./MembershipsSection.module.css";

gsap.registerPlugin(ScrollTrigger);

type Membership = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
};

const memberships: Membership[] = [
  {
    name: "PLATA",
    price: "S/890",
    description:
      "El punto de inicio para disfrutar Zagari los fines de semana con toda la familia.",
    features: [
      "Ingreso viernes, sábado, domingo y feriados",
      "2 invitados por año",
      "Tarjeta de membresía digital",
      "Acceso a piscinas y gimnasio",
      "Membresía familiar incluida",
    ],
    cta: "QUIERO PLATA",
  },
  {
    name: "ORO",
    price: "S/1,690",
    description:
      "Acceso completo para quienes hacen de Zagari su destino de descanso habitual.",
    features: [
      "Ingreso todos los días del año",
      "6 invitados por año",
      "10% de descuento en consumo",
      "Tarjeta digital y tarjeta física",
      "Canchas deportivas sin costo adicional",
      "Beneficios en cabañas y spa",
    ],
    cta: "QUIERO ORO",
  },
  {
    name: "PLATINO",
    price: "S/2,900",
    description:
      "La experiencia más completa de Zagari para quienes buscan el máximo nivel de pertenencia.",
    features: [
      "Ingreso todos los días del año",
      "Ingreso preferente sin espera",
      "12 invitados por año",
      "20% de descuento en consumo",
      "Zona reservada en piscinas",
      "Entrenador personal incluido",
      "Prioridad en reservas de horarios",
      "Parrillas sin costo adicional",
      "Beneficios exclusivos en eventos",
    ],
    cta: "QUIERO PLATINO",
    featured: true,
    badge: "POR INVITACIÓN",
  },
];

export default function MembershipsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current.filter(
      (card): card is HTMLTitleElement => Boolean(card)
    );

    if (!section || !header || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 901px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduced } = context.conditions as {
            desktop: boolean;
            reduced: boolean;
          };

          if (reduced) {
            gsap.set(cards, {
              clearProps: "transform,opacity,boxShadow",
            });
            return;
          }

          const eyebrow = header.querySelector<HTMLElement>("[data-eyebrow]");
          const title = header.querySelector<HTMLElement>("[data-title]");
          const intro = header.querySelector<HTMLElement>("[data-intro]");

          // La sección nunca queda opaca: solo se anima la posición.
          gsap.set(cards, {
            opacity: 1,
            y: desktop ? 36 : 24,
            scale: 1,
            rotateX: 0,
            transformPerspective: desktop ? 1200 : undefined,
          });

          gsap.set(eyebrow, {
            opacity: 1,
            y: 14,
          });

          gsap.set(title, {
            opacity: 1,
            y: 24,
          });

          gsap.set(intro, {
            opacity: 1,
            y: 14,
          });

          const entrance = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          });

          entrance
            .to(
              eyebrow,
              {
                y: 0,
                duration: 0.48,
                ease: "power3.out",
              },
              0
            )
            .to(
              title,
              {
                y: 0,
                duration: 0.72,
                ease: "power3.out",
              },
              0.05
            )
            .to(
              intro,
              {
                y: 0,
                duration: 0.55,
                ease: "power3.out",
              },
              0.15
            )
            .to(
              cards,
              {
                y: 0,
                duration: 0.72,
                stagger: 0.1,
                ease: "power3.out",
              },
              0.2
            );

          if (desktop) {
            cards.forEach((card) => {
              const cta = card.querySelector<HTMLElement>("[data-cta]");
              const icon = card.querySelector<HTMLElement>("[data-cta-icon]");
              const glow = card.querySelector<HTMLElement>("[data-glow]");

              const enter = () => {
                gsap.killTweensOf([card, cta, icon, glow]);

                gsap
                  .timeline()
                  .to(card, {
                    y: -13,
                    scale: 1.012,
                    duration: 0.18,
                    ease: "power3.out",
                    overwrite: "auto",
                  })
                  .to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.62,
                    ease: "bounce.out",
                    overwrite: "auto",
                  });

                gsap.to(card, {
                  boxShadow: card.classList.contains(styles.cardFeatured)
                    ? "0 34px 82px rgba(0,0,0,0.34), 0 0 0 1px rgba(220,199,154,0.42)"
                    : "0 30px 72px rgba(0,0,0,0.30), 0 0 0 1px rgba(206,195,165,0.22)",
                  duration: 0.32,
                  ease: "power2.out",
                  overwrite: "auto",
                });

                if (glow) {
                  gsap.to(glow, {
                    opacity: 1,
                    scale: 1.15,
                    duration: 0.45,
                    ease: "power2.out",
                    overwrite: "auto",
                  });
                }
              };

              const leave = () => {
                gsap.killTweensOf([card, cta, icon, glow]);

                gsap.to(card, {
                  y: 0,
                  scale: 1,
                  duration: 0.38,
                  ease: "elastic.out(1, 0.65)",
                  boxShadow: card.classList.contains(styles.cardFeatured)
                    ? "0 22px 58px rgba(0,0,0,0.22), 0 0 0 1px rgba(219,200,158,0.10)"
                    : "0 16px 38px rgba(0,0,0,0.12)",
                  overwrite: "auto",
                });

                if (glow) {
                  gsap.to(glow, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto",
                  });
                }
              };

              const ctaEnter = () => {
                if (!icon) return;

                gsap.to(icon, {
                  x: 5,
                  duration: 0.22,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              };

              const ctaLeave = () => {
                if (!icon) return;

                gsap.to(icon, {
                  x: 0,
                  duration: 0.25,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              };

              card.addEventListener("mouseenter", enter);
              card.addEventListener("mouseleave", leave);

              if (cta) {
                cta.addEventListener("mouseenter", ctaEnter);
                cta.addEventListener("mouseleave", ctaLeave);
              }

              return () => {
                card.removeEventListener("mouseenter", enter);
                card.removeEventListener("mouseleave", leave);

                if (cta) {
                  cta.removeEventListener("mouseenter", ctaEnter);
                  cta.removeEventListener("mouseleave", ctaLeave);
                }

                gsap.killTweensOf([card, cta, icon, glow]);
              };
            });
          }
        }
      );
    }, section);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="membresias"
      className={styles.section}
      aria-labelledby="membresias-title"
    >
      <div className={styles.backgroundAccent} aria-hidden="true" />

      <div className={styles.container}>
        <header ref={headerRef} className={styles.header}>
          <span data-eyebrow className={styles.eyebrow}>
            MEMBRESÍAS
          </span>

          <h2 data-title id="membresias-title" className={styles.title}>
            Elige cómo quieres
            <span>vivir Zagari.</span>
          </h2>

          <p data-intro className={styles.headerDescription}>
            Tres formas de pertenecer, pensadas para acompañar tu manera de
            disfrutar Zagari.
          </p>
        </header>

        <div className={styles.cards}>
          {memberships.map((membership, index) => (
            <article
              key={membership.name}
              ref={(element) => {
                cardsRef.current[index] = element;
              }}
              className={`${styles.card} ${
                membership.featured ? styles.cardFeatured : ""
              }`}
            >
              <div data-glow className={styles.hoverGlow} aria-hidden="true" />

              {/* <div className={styles.cardNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </div> */}

              {membership.badge ? (
                <span className={styles.badge}>{membership.badge}</span>
              ) : null}

              <div className={styles.cardHead}>
                <div className={styles.cardName}>{membership.name}</div>

                <div className={styles.priceRow}>
                  <span className={styles.price}>{membership.price}</span>
                  <span className={styles.period}>/año</span>
                </div>
              </div>

              <p className={styles.description}>{membership.description}</p>

              <div className={styles.featureArea}>
                <span className={styles.featureLabel}>INCLUYE</span>

                <ul className={styles.features}>
                  {membership.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <Check
                        size={12}
                        weight="regular"
                        className={styles.check}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button type="button" data-cta className={styles.cta}>
                <span>{membership.cta}</span>

                <span data-cta-icon className={styles.ctaIcon}>
                  <ArrowRight size={15} weight="regular" aria-hidden="true" />
                </span>
              </button>

              {membership.featured ? (
                <div className={styles.featuredMark} aria-hidden="true">
                  <Crown size={14} weight="regular" />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
