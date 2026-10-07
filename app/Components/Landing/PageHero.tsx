"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MEDIOS, motion, sinMovimiento } from "../../lib/motion";

import styles from "./PageHero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface PageHeroProps {
  eyebrow?: string;
  titulo: string;
  texto?: string;
  imagen: string;
  alt: string;
  posicion?: string;
  enlace?: { label: string; href: string };
}

/** Progreso normalizado de cada capa dentro de la entrada. */
const FRAMES = {
  imagen: 0,
  eyebrow: 0.18,
  titulo: 0.3,
  texto: 0.44,
  cta: 0.58,
  detalle: 0.72,
} as const;

// Máscara del titular: el estado oculto es el que declara el contrato para
// data-entrada="mascara", así que el HTML servido ya nace recortado.
const OCULTO = "inset(0 0 100% 0)";
// En reposo los insets son negativos: la máscara no recorta ni acentos ni colas.
const VISIBLE = "inset(-14% -6% -14% -6%)";

/** Desplazamiento que el contrato asigna a data-entrada="sube". */
const SUBE = 34;

/** Escala de partida del fondo; el módulo CSS repite estos valores. */
const ZOOM = { movil: 1.03, tablet: 1.05, escritorio: 1.08 } as const;

type Perfil = keyof typeof ZOOM;

/** Perfil del viewport al montar: la entrada es un disparo único. */
function perfilInicial(): Perfil {
  if (window.matchMedia(MEDIOS.escritorio).matches) return "escritorio";
  if (window.matchMedia(MEDIOS.anchos).matches) return "tablet";
  return "movil";
}

export default function PageHero({
  eyebrow,
  titulo,
  texto,
  imagen,
  alt,
  posicion = "center",
  enlace,
}: PageHeroProps) {
  const raiz = useRef<HTMLElement>(null);
  const entrada = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const seccion = raiz.current;
      if (!seccion) return;

      const busca = (clase: string) =>
        seccion.querySelector<HTMLElement>(`.${clase}`);

      const marco = busca(styles.marco);
      const contenido = busca(styles.contenido);
      const espectro = busca(styles.espectro);
      if (!marco || !contenido) return;

      // La entrada vive fuera de matchMedia: es un disparo único y cruzar un
      // breakpoint (girar el teléfono, redimensionar) no debe revertirla ni
      // volver a ocultar el texto.
      if (!sinMovimiento()) {
        const perfil = perfilInicial();
        const compas =
          motion.duration.cinematic * (perfil === "escritorio" ? 1 : 0.8);
        const en = (progreso: number) => progreso * compas;

        const linea = gsap.timeline({
          defaults: {
            duration: motion.duration.base,
            ease: motion.ease.cinematic,
          },
        });

        linea.fromTo(
          marco,
          { scale: ZOOM[perfil] },
          { scale: 1, duration: motion.duration.slow },
          en(FRAMES.imagen)
        );

        const rotulo = busca(styles.eyebrow);
        const titular = busca(styles.titulo);
        const parrafo = busca(styles.parrafo);
        const cta = busca(styles.cta);

        if (rotulo) {
          linea.fromTo(
            rotulo,
            { opacity: 0, y: SUBE },
            { opacity: 1, y: 0 },
            en(FRAMES.eyebrow)
          );
        }

        if (titular) {
          linea.fromTo(
            titular,
            { opacity: 0, clipPath: OCULTO },
            { opacity: 1, clipPath: VISIBLE },
            en(FRAMES.titulo)
          );
        }

        if (parrafo) {
          linea.fromTo(
            parrafo,
            { opacity: 0, y: SUBE },
            { opacity: 1, y: 0 },
            en(FRAMES.texto)
          );
        }

        if (cta) {
          linea.fromTo(
            cta,
            // autoAlpha: el enlace no es enfocable mientras está invisible.
            { autoAlpha: 0, y: SUBE },
            { autoAlpha: 1, y: 0 },
            en(FRAMES.cta)
          );
        }

        if (espectro) {
          linea.fromTo(
            espectro,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: motion.duration.cinematic,
              ease: motion.ease.ui,
            },
            en(FRAMES.detalle)
          );
        }

        entrada.current = linea;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          escritorio: MEDIOS.escritorio,
          tablet: MEDIOS.tablet,
          movil: MEDIOS.movil,
          reducido: MEDIOS.reducido,
        },
        (contexto) => {
          const {
            escritorio = false,
            tablet = false,
            reducido = false,
          } = contexto.conditions ?? {};

          // Si el usuario pide reducir movimiento en caliente, la entrada salta
          // a su último fotograma: deja estilos en línea, que mandan sobre el
          // contrato, y nada queda invisible ni recortado.
          if (reducido) {
            entrada.current?.progress(1);
            gsap.set(marco, { scale: 1, yPercent: 0 });
            gsap.set(contenido, { yPercent: 0 });
            return;
          }

          const recorrido = () => ({
            trigger: seccion,
            start: "top top",
            end: "bottom top",
            scrub: true,
          });

          gsap.to(marco, {
            yPercent: escritorio ? -8 : tablet ? -5 : -3,
            ease: motion.ease.scrub,
            scrollTrigger: recorrido(),
          });

          // En móvil el bloque de texto no se mueve: una capa de composición menos.
          if (escritorio || tablet) {
            gsap.to(contenido, {
              yPercent: escritorio ? -3 : -2,
              ease: motion.ease.scrub,
              scrollTrigger: recorrido(),
            });
          }
        }
      );

      return () => mm.revert();
    },
    { scope: raiz }
  );

  return (
    <section className={styles.section} ref={raiz}>
      <span className={styles.marco}>
        <Image
          src={imagen}
          alt={alt}
          fill
          preload
          sizes="100vw"
          className={styles.imagen}
          style={{ objectPosition: posicion }}
        />
      </span>

      <span className={styles.velo} aria-hidden="true" />

      <div className={styles.contenido}>
        {eyebrow && (
          <p className={styles.eyebrow} data-entrada="sube">
            {eyebrow}
          </p>
        )}

        <h1 className={`display ${styles.titulo}`} data-entrada="mascara">
          {titulo}
        </h1>

        {texto && (
          <p className={styles.parrafo} data-entrada="sube">
            {texto}
          </p>
        )}

        {enlace && (
          <Link href={enlace.href} className={styles.cta} data-entrada="sube">
            {enlace.label}
          </Link>
        )}
      </div>

      <span className={styles.espectro} aria-hidden="true" />
    </section>
  );
}
