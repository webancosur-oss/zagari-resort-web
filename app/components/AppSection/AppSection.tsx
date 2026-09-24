/* AppSection.tsx */
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarPlus,
  UsersThree,
  Star,
  Trophy,
  House,
  CalendarBlank,
  UserCircle,
  ArrowUpRight,
  Bell,
  CheckCircle,
  MapPin,
} from "@phosphor-icons/react";
import styles from "./AppSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const quickActions = [
  {
    label: "Reservar",
    description: "Canchas, parrillas y más",
    icon: CalendarPlus,
  },
  {
    label: "Invitar",
    description: "Agrega invitados fácilmente",
    icon: UsersThree,
  },
  {
    label: "Beneficios",
    description: "Consulta tus descuentos",
    icon: Star,
  },
  {
    label: "Mis puntos",
    description: "Seguimiento en tiempo real",
    icon: Trophy,
  },
];

export default function AppSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const phone = phoneRef.current;
    const screen = screenRef.current;

    if (!section || !phone || !screen) return;

    const ctx = gsap.context(() => {
      const eyebrow = `.${styles.eyebrow}`;
      const heading = `.${styles.heading}`;
      const description = `.${styles.description}`;
      const cards = `.${styles.actionCard}`;
      const note = `.${styles.note}`;
      const phoneParts = `.${styles.phoneReveal}`;

      gsap.set(
        [eyebrow, heading, description, cards, note],
        {
          opacity: 0,
          y: 35,
        }
      );

      gsap.set(phone, {
        opacity: 0,
        x: 60,
        rotateY: -8,
        scale: 0.94,
      });

      gsap.set(phoneParts, {
        opacity: 0,
        y: 14,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });

      timeline
        .to(phone, {
          opacity: 1,
          x: 0,
          rotateY: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          eyebrow,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.65"
        )
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.38"
        )
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.28"
        )
        .to(
          note,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          phoneParts,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power3.out",
          },
          "<"
        );

      gsap.to(screen, {
        yPercent: -2,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="app-zagari">
      <div className={styles.backgroundOrb} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.copy}>
          <div className={styles.copyInner}>
            <p className={styles.eyebrow}>APP ZAGARI</p>

            <h2 className={styles.heading}>
              Todo Zagari,
              <br />
              <em>en tu celular.</em>
            </h2>

            <p className={styles.description}>
              Gestiona tu membresía, reserva instalaciones, consulta tus
              puntos e invita a tus acompañantes desde una sola aplicación.
            </p>

            <div className={styles.actionsGrid}>
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <article className={styles.actionCard} key={action.label}>
                    <div className={styles.actionIcon}>
                      <Icon size={21} weight="regular" />
                    </div>

                    <div>
                      <h3>{action.label}</h3>
                      <p>{action.description}</p>
                    </div>

                    <ArrowUpRight
                      className={styles.actionArrow}
                      size={15}
                      weight="regular"
                    />
                  </article>
                );
              })}
            </div>

            <div className={styles.note}>
              <span className={styles.noteDot} />
              <span>Próximamente disponible para iOS y Android.</span>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.visualGlow} aria-hidden="true" />

          <div ref={phoneRef} className={styles.phone}>
            <div className={styles.phoneSpeaker} />

            <div ref={screenRef} className={styles.phoneScreen}>
              <div className={`${styles.statusBar} ${styles.phoneReveal}`}>
                <span>9:41</span>

                <div className={styles.statusIcons}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className={`${styles.appHeader} ${styles.phoneReveal}`}>
                <div>
                  <small>Bienvenido,</small>
                  <strong>Carlos Mendoza</strong>
                </div>

                <div className={styles.avatar}>CM</div>
              </div>

              <div className={`${styles.membershipCard} ${styles.phoneReveal}`}>
                <div className={styles.membershipTop}>
                  <div>
                    <small>ZAGARI RESORT CLUB</small>
                    <strong>ORO</strong>
                  </div>

                  <div className={styles.pointsCircle}>
                    <small>PUNTOS</small>
                    <strong>720</strong>
                  </div>
                </div>

                <div className={styles.membershipBottom}>
                  <span>ORO</span>
                  <span>Te faltan 280 pts para PLATINO</span>
                </div>

                <div className={styles.phoneProgress}>
                  <span />
                </div>
              </div>

              <div className={`${styles.phoneSectionTitle} ${styles.phoneReveal}`}>
                ACCIONES RÁPIDAS
              </div>

              <div className={`${styles.phoneActions} ${styles.phoneReveal}`}>
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <div className={styles.phoneAction} key={action.label}>
                      <div>
                        <Icon size={16} weight="fill" />
                      </div>
                      <span>{action.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className={`${styles.phoneSectionTitle} ${styles.phoneReveal}`}>
                PRÓXIMA VISITA
              </div>

              <div className={`${styles.visitCard} ${styles.phoneReveal}`}>
                <div>
                  <strong>Sábado 27 Sep</strong>
                  <small>
                    <MapPin size={11} weight="fill" />
                    2 invitados · Cancha Pádel
                  </small>
                </div>

                <span>
                  <CheckCircle size={12} weight="fill" />
                  Confirmada
                </span>
              </div>

              <div className={styles.phoneSpacer} />

              <nav className={`${styles.bottomNav} ${styles.phoneReveal}`}>
                <div className={styles.activeNav}>
                  <House size={18} weight="fill" />
                </div>
                <div>
                  <CalendarBlank size={18} weight="regular" />
                </div>
                <div>
                  <Bell size={18} weight="regular" />
                </div>
                <div>
                  <UserCircle size={18} weight="regular" />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
