"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "../Reveal/Reveal";
import { MEDIOS, motion, sinMovimiento } from "../../lib/motion";
import type { GalleryItem } from "../ExperienceGallery/experienceGallery.data";

import styles from "./StackedScroll.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface StackedScrollProps {
  id?: string;
  eyebrow?: string;
  titulo: string;
  texto?: string;
  items: readonly GalleryItem[];
  enlace?: { label: string; href: string };
  tono?: "claro" | "crema" | "tinta";
}

/** Disparo de la cabecera; lo comparten Reveal y la máscara del titular. */
const DISPARO = "top 92%";

/** Recorrido de entrada del titular; el módulo CSS lo replica en px. */
const TITULAR_Y = motion.distance.text * 0.6;

/** Máscara del titular: cerrada igual que data-entrada="mascara". */
const TITULAR_MASCARA = {
  cerrada: "inset(0 0 100% 0)",
  /** Los insets negativos dejan respirar acentos y descendentes. */
  abierta: "inset(-12% -4% -12% -4%)",
} as const;

/** Posición de cada gesto dentro de un paso de baraja (1 = un paso entero). */
const FRAME = {
  salida: 0,
  avance: 0,
  mascara: 0.15,
  /** Relativo al índice de la tarjeta, no al paso. */
  deriva: -0.5,
} as const;

const DURACION = {
  paso: 1,
  mascara: 0.7,
  deriva: 0.9,
} as const;

interface Perfil {
  /** Separación en Z entre huecos de la baraja, en px. */
  prof: number;
  giro: number;
  salidaY: number;
  salidaZ: number;
  salidaGiro: number;
  /** Deriva vertical de la foto mientras la tarjeta está al frente. */
  deriva: number;
  /** Inset lateral de la máscara con que se abre la foto. */
  mascara: number;
  escala: number;
}

/** prof, giro y mascara replican las variables del módulo CSS por breakpoint. */
const PERFILES: Record<"escritorio" | "tablet" | "movil", Perfil> = {
  escritorio: {
    prof: 120,
    giro: 2,
    salidaY: -118,
    salidaZ: 320,
    salidaGiro: -16,
    deriva: -6,
    mascara: 26,
    escala: 1.14,
  },
  tablet: {
    prof: 90,
    giro: 1.6,
    salidaY: -112,
    salidaZ: 240,
    salidaGiro: -12,
    deriva: -4.5,
    mascara: 20,
    escala: 1.11,
  },
  movil: {
    prof: 60,
    giro: 1.2,
    salidaY: -106,
    salidaZ: 150,
    salidaGiro: -9,
    deriva: -3,
    mascara: 16,
    escala: 1.08,
  },
};

export default function StackedScroll({
  id,
  eyebrow,
  titulo,
  texto,
  items,
  enlace,
  tono = "claro",
}: StackedScrollProps) {
  const raiz = useRef<HTMLElement>(null);
  const ultima = useRef(0);
  const [activa, setActiva] = useState(0);

  useGSAP(
    () => {
      const el = raiz.current;
      if (!el || sinMovimiento()) return;

      const cabecera = el.querySelector<HTMLElement>(`.${styles.cabecera}`);
      const titular = el.querySelector<HTMLElement>(`.${styles.titulo}`);

      const mm = gsap.matchMedia();

      // La máscara del titular también vive en matchMedia: si el ajuste se
      // activa en caliente, mm.revert() borra el clip-path en línea.
      // El estado de partida es el que el contrato ya pintó (data-entrada
      // ="mascara" más el translate del módulo CSS), así que no hay salto; y
      // por eso tampoco puede llevar clearProps.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!titular) return;

        gsap.fromTo(
          titular,
          { clipPath: TITULAR_MASCARA.cerrada, opacity: 0, y: TITULAR_Y },
          {
            clipPath: TITULAR_MASCARA.abierta,
            opacity: 1,
            y: 0,
            duration: motion.duration.cinematic,
            delay: 0.08,
            ease: motion.ease.cinematic,
            scrollTrigger: {
              trigger: cabecera ?? el,
              start: DISPARO,
              once: true,
            },
          }
        );
      });

      const panel = el.querySelector<HTMLElement>(`.${styles.sticky}`);

      const tarjetas = Array.from(
        el.querySelectorAll<HTMLElement>(`.${styles.card}`)
      );
      const total = tarjetas.length;
      if (total === 0) return () => mm.revert();

      const marcos = tarjetas.map((t) =>
        t.querySelector<HTMLElement>(`.${styles.marco}`)
      );
      const fotos = tarjetas.map((t) =>
        t.querySelector<HTMLElement>(`.${styles.imagen}`)
      );

      // Escalera única: los mismos cortes que el perfil de la baraja en CSS.
      mm.add(
        {
          escritorio: MEDIOS.escritorio,
          tablet: MEDIOS.tablet,
          movil: MEDIOS.movil,
          reducido: MEDIOS.reducido,
        },
        (contexto) => {
          const condiciones = contexto.conditions ?? {};
          if (condiciones.reducido) return;

          // Al cruzar un corte el contexto se reconstruye desde cero: el
          // índice memorizado ya no describe esta escena.
          ultima.current = -1;

          const p = condiciones.movil
            ? PERFILES.movil
            : condiciones.tablet
              ? PERFILES.tablet
              : PERFILES.escritorio;

          const abierta = "inset(0% 0% 0% 0%)";
          const cerrada = `inset(0% 0% 0% ${p.mascara}%)`;
          const entrada = -p.deriva / 2;

          // Cada tarjeta ocupa un "hueco" de la baraja: 0 es la de delante.
          const hueco = (s: number) => ({
            z: -s * p.prof,
            yPercent: s * 7.5,
            rotateX: s * p.giro,
            opacity: s > 3 ? 0 : 1 - s * 0.22,
          });

          gsap.set(tarjetas, {
            zIndex: (i) => total - i,
            transformOrigin: "50% 90%",
          });

          tarjetas.forEach((tarjeta, i) => gsap.set(tarjeta, hueco(i)));

          marcos.forEach((marco, i) => {
            if (marco) gsap.set(marco, { clipPath: i === 0 ? abierta : cerrada });
          });

          fotos.forEach((foto, i) => {
            if (foto) {
              gsap.set(foto, {
                scale: p.escala,
                yPercent: i === 0 ? 0 : entrada,
              });
            }
          });

          const duracion = Math.max(
            total - 1,
            Math.max(0, total - 1 + FRAME.deriva) + DURACION.deriva
          );

          const sincroniza = (self: ScrollTrigger) => {
            const n = gsap.utils.clamp(
              0,
              total - 1,
              Math.round(self.progress * duracion)
            );
            if (ultima.current === n) return;
            ultima.current = n;
            setActiva(n);
          };

          const escena = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              // El recorrido es el que el panel pasa fijado, medido sobre los
              // elementos: "bottom bottom" lo mide contra el viewport real y
              // en móvil sobra la diferencia entre ese alto y los 100svh del
              // panel, que es scroll con la baraja ya terminada.
              end: () =>
                panel
                  ? `+=${Math.max(1, el.offsetHeight - panel.offsetHeight)}`
                  : "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: sincroniza,
              onRefresh: sincroniza,
            },
          });

          for (let paso = 0; paso < total - 1; paso += 1) {
            // La de delante sale hacia arriba y hacia el espectador.
            // Duración 1 = un paso entero, así cada gesto encadena con el
            // siguiente y no queda media pantalla de scroll con la baraja quieta.
            escena.to(
              tarjetas[paso],
              {
                yPercent: p.salidaY,
                z: p.salidaZ,
                rotateX: p.salidaGiro,
                opacity: 0,
                duration: DURACION.paso,
                ease: "power2.in",
              },
              paso + FRAME.salida
            );

            // Las de atrás avanzan un hueco.
            for (let i = paso + 1; i < total; i += 1) {
              escena.to(
                tarjetas[i],
                {
                  ...hueco(i - paso - 1),
                  duration: DURACION.paso,
                  ease: "power2.inOut",
                },
                paso + FRAME.avance
              );
            }

            // La que llega al frente abre su foto con máscara lateral.
            const marco = marcos[paso + 1];
            if (marco) {
              escena.to(
                marco,
                {
                  clipPath: abierta,
                  duration: DURACION.mascara,
                  ease: motion.ease.cinematic,
                },
                paso + FRAME.mascara
              );
            }
          }

          fotos.forEach((foto, i) => {
            if (!foto) return;
            escena.to(
              foto,
              {
                yPercent: p.deriva,
                duration: DURACION.deriva,
                ease: motion.ease.scrub,
              },
              Math.max(0, i + FRAME.deriva)
            );
          });
        }
      );

      return () => mm.revert();
    },
    { scope: raiz, dependencies: [items] }
  );

  return (
    <section
      ref={raiz}
      id={id}
      className={`${styles.section} ${styles[tono]}`}
      style={{ "--pasos": items.length } as React.CSSProperties}
    >
      <div className={styles.sticky}>
        <div className={styles.inner}>
          <Reveal
            as="header"
            className={styles.cabecera}
            start={DISPARO}
            stagger={0.16}
          >
            {eyebrow && (
              <p className={styles.eyebrow} data-reveal data-entrada="sube">
                {eyebrow}
              </p>
            )}

            <h2 className={`display ${styles.titulo}`} data-entrada="mascara">
              {titulo}
            </h2>

            {texto && (
              <p className={styles.parrafo} data-reveal data-entrada="sube">
                {texto}
              </p>
            )}

            <ol
              className={styles.pasos}
              aria-hidden="true"
              data-reveal
              data-entrada="sube"
            >
              {items.map((item, i) => (
                <li
                  key={item.title}
                  className={`${styles.paso} ${
                    i === activa ? styles.pasoActivo : ""
                  }`}
                >
                  <span className={styles.pasoNumero}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.pasoNombre}>{item.title}</span>
                </li>
              ))}
            </ol>

            {enlace && (
              <Link
                href={enlace.href}
                className={styles.enlace}
                data-reveal
                data-entrada="sube"
              >
                {enlace.label}
              </Link>
            )}
          </Reveal>

          <div className={styles.escena}>
            <ul className={styles.pila}>
              {items.map((item, i) => (
                <li
                  key={item.title}
                  className={`${styles.card} ${
                    i >= activa - 1 && i <= activa + 2 ? styles.enJuego : ""
                  }`}
                >
                  <figure className={styles.media}>
                    <span className={styles.marco}>
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1000px) 46vw, 92vw"
                        className={styles.imagen}
                      />
                    </span>
                    <span className={styles.indice} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figure>

                  <div className={styles.cuerpo}>
                    <h3 className={styles.cardTitulo}>{item.title}</h3>
                    <p className={styles.cardTexto}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
