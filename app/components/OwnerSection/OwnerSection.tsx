/* OwnerSection.tsx */
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  Crown,
  Key,
  UsersThree,
} from "@phosphor-icons/react";
import styles from "./OwnerSection.module.css";

gsap.registerPlugin(ScrollTrigger);

type OwnerBenefit = {
  text: string;
};

const ownerBenefits: OwnerBenefit[] = [
  { text: "Primer año de membresía: S/0" },
  { text: "Categoría ORO desde el primer día" },
  { text: "Desde el 2.º año: 30% de descuento permanente" },
  { text: "Ingreso todos los días del año" },
  { text: "6 invitados por año incluidos" },
  { text: "10% de descuento en consumo" },
  { text: "25% de descuento en cabañas" },
];

export default function OwnerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!section || !image || !content) return;

    const ctx = gsap.context(() => {
      const eyebrow = content.querySelector<HTMLElement>(
        `.${styles.eyebrow}`
      );
      const heading = content.querySelector<HTMLElement>(
        `.${styles.heading}`
      );
      const category = content.querySelector<HTMLElement>(
        `.${styles.category}`
      );
      const description = content.querySelector<HTMLElement>(
        `.${styles.description}`
      );
      const benefits = content.querySelectorAll<HTMLElement>(
        `.${styles.benefit}`
      );
      const cta = content.querySelector<HTMLElement>(
        `.${styles.cta}`
      );
      const stat = content.querySelector<HTMLElement>(
        `.${styles.stat}`
      );
      const imageVisual = image.querySelector<HTMLElement>(
        `.${styles.imageVisual}`
      );

      gsap.set(
        [
          eyebrow,
          heading,
          category,
          description,
          ...Array.from(benefits),
          cta,
          stat,
        ].filter(Boolean),
        {
          opacity: 0,
          y: 30,
        }
      );

      gsap.set(image, {
        opacity: 0,
        x: -45,
      });

      gsap.set(imageVisual, {
        scale: 1.08,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });

      timeline
        .to(image, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          imageVisual,
          {
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
          },
          "<"
        )
        .to(
          eyebrow,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.55"
        )
        .to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          category,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.42"
        )
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.38"
        )
        .to(
          benefits,
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.28"
        )
        .to(
          cta,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          stat,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.35"
        );

      gsap.to(imageVisual, {
        yPercent: -3,
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
    <section
      ref={sectionRef}
      className={styles.section}
      id="propietarios"
    >
      <div className={styles.backgroundShape} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.mediaColumn}>
          <div ref={imageRef} className={styles.imageFrame}>
            <div
              className={styles.imageVisual}
              style={{
                backgroundImage:
                  "url('/assets/experiences/experience10.webp')",
              }}
              role="img"
              aria-label="Experiencia de propietario en Zagari"
            />

            <div className={styles.imageShade} />

            <div className={styles.imageTop}>
              <span>01</span>
              <span>PROPIETARIOS</span>
            </div>

            <div className={styles.imageBottom}>
              <div className={styles.imageIcon}>
                <Key size={19} weight="regular" />
              </div>
              <span>Una propiedad.<br />Una membresía.</span>
            </div>
          </div>
        </div>

        <div ref={contentRef} className={styles.content}>
          <p className={styles.eyebrow}>PROPIETARIOS</p>

          <h2 className={styles.heading}>
            Ser propietario en Zagari
            <br />
            <em>es solo el comienzo.</em>
          </h2>

          <div className={styles.category}>
            <span className={styles.categoryLine} />
            <Crown size={15} weight="regular" />
            <span>SOCIO FUNDADOR</span>
            <span className={styles.categoryLine} />
          </div>

          <p className={styles.description}>
            Los propietarios de Zagari acceden a una categoría especial
            diseñada para reconocer su confianza y compromiso con el club
            desde el primer momento.
          </p>

          <div className={styles.benefits}>
            {ownerBenefits.map((benefit) => (
              <div className={styles.benefit} key={benefit.text}>
                <span className={styles.check}>
                  <Check size={12} weight="bold" />
                </span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <a
              href="#membresias"
              className={styles.cta}
            >
              <span>QUIERO SABER MÁS</span>
              <ArrowUpRight size={17} weight="regular" />
            </a>

            <div className={styles.stat}>
              <UsersThree size={18} weight="regular" />
              <div>
                <strong>ORO</strong>
                <span>Categoría de propietario</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
