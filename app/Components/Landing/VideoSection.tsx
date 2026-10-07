"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Pause, Play } from "reicon-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MEDIOS, motion, START } from "../../lib/motion";

import styles from "./VideoSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface VideoSectionProps {
  id?: string;
  eyebrow?: string;
  titulo: string;
  texto?: string;
  video: string;
  poster: string;
  posterAlt: string;
}

/** Progreso normalizado dentro del recorrido fijado. */
// El texto entra pronto y se queda: si tarda o se retira, durante buena parte
// del pin solo se ve el video y la sección parece atascada.
const FRAMES = {
  sangre: 0,
  velo: 0.1,
  eyebrow: 0.14,
  titulo: 0.22,
  texto: 0.32,
  salida: 0.82,
} as const;

const DURACION = {
  sangre: 0.32,
  velo: 0.3,
  capa: 0.22,
  salida: 0.18,
} as const;

const OCULTO = "inset(0% -6% 100% -6%)";
const VISIBLE = "inset(-12% -6% -12% -6%)";
const A_SANGRE = "inset(0% 0% 0% 0% round 0px)";


/** Encuadre del FRAME A. Replica el clip-path que el módulo CSS ya sirve. */
const ENCUADRE = {
  escritorio: "inset(6% 8% 6% 8% round 24px)",
  tablet: "inset(4% 5% 4% 5% round 16px)",
} as const;

export default function VideoSection({
  id,
  eyebrow,
  titulo,
  texto,
  video,
  poster,
  posterAlt,
}: VideoSectionProps) {
  const raiz = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enMarcha, setEnMarcha] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    // Se reevalúa en vivo: si se activa el ajuste, el video se detiene.
    const sincronizar = () => {
      if (consulta.matches) {
        observer?.disconnect();
        observer = null;
        el.pause();
        return;
      }
      if (observer) return;

      observer = new IntersectionObserver(
        ([entrada]) => {
          if (entrada.isIntersecting) {
            el.play().catch(() => undefined);
          } else {
            el.pause();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
    };

    sincronizar();
    consulta.addEventListener("change", sincronizar);

    return () => {
      consulta.removeEventListener("change", sincronizar);
      observer?.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      const seccion = raiz.current;
      if (!seccion) return;

      const busca = (clase: string) =>
        seccion.querySelector<HTMLElement>(`.${clase}`);

      const marco = busca(styles.marco);
      const media = busca(styles.media);
      const velo = busca(styles.velo);
      const contenido = busca(styles.contenido);
      const interior = busca(styles.interior);
      if (!marco || !media || !velo || !contenido || !interior) return;

      const capas: Array<[HTMLElement, number]> = (
        [
          [busca(styles.eyebrow), FRAMES.eyebrow],
          [busca(styles.titulo), FRAMES.titulo],
          [busca(styles.parrafo), FRAMES.texto],
        ] as Array<[HTMLElement | null, number]>
      ).flatMap(([capa, progreso]) =>
        capa ? [[capa, progreso] as [HTMLElement, number]] : []
      );

      const piezas = capas.map(([capa]) => capa);
      const mm = gsap.matchMedia();

      // "reducido" es una condición de matchMedia, no un corte previo: así, si
      // el ajuste cambia en vivo, GSAP revierte sus estilos y el texto reaparece
      // a la vez que el CSS devuelve la sección a su alto normal.
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

          if (reducido) return;

          const salto =
            motion.distance.text * (escritorio ? 0.8 : tablet ? 0.6 : 0.4);

          // Móvil: el medio nace a sangre y el texto sólo hace una entrada corta.
          if (!escritorio && !tablet) {
            gsap
              .timeline({
                defaults: {
                  duration: motion.duration.base,
                  ease: motion.ease.cinematic,
                },
                scrollTrigger: { trigger: seccion, start: START, once: true },
              })
              // Sin clearProps: las capas llevan data-entrada y al limpiar los
              // estilos en línea volverían al estado oculto del contrato.
              .fromTo(
                piezas,
                { autoAlpha: 0, y: salto, clipPath: OCULTO },
                { autoAlpha: 1, y: 0, clipPath: VISIBLE, stagger: 0.1 }
              );

            gsap.to(media, {
              yPercent: -4,
              ease: motion.ease.scrub,
              scrollTrigger: {
                trigger: seccion,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
            return;
          }

          const encuadre = escritorio ? ENCUADRE.escritorio : ENCUADRE.tablet;
          const zoomA = escritorio ? 1.12 : 1.08;
          const zoomB = escritorio ? 1.04 : 1.03;
          const zoomD = escritorio ? 1.09 : 1.06;
          const fondoY = escritorio ? -10 : -7;
          const contenidoY = escritorio ? -5 : -3;

          gsap.set(marco, { clipPath: encuadre });
          gsap.set(media, { scale: zoomA, transformOrigin: "50% 50%" });
          gsap.set(velo, { opacity: 0 });
          gsap.set(piezas, { autoAlpha: 0, y: salto, clipPath: OCULTO });

          // Promueve el marco y el medio solo mientras la sección cruza el
          // viewport; el CSS cuelga los will-change de esta clase.
          ScrollTrigger.create({
            trigger: seccion,
            start: "top bottom",
            end: "bottom top",
            toggleClass: { targets: seccion, className: styles.enJuego },
          });

          const linea = gsap.timeline({
            defaults: { ease: motion.ease.scrub },
            scrollTrigger: {
              trigger: seccion,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });

          linea
            .to(
              marco,
              { clipPath: A_SANGRE, duration: DURACION.sangre },
              FRAMES.sangre
            )
            .to(media, { scale: zoomB, duration: DURACION.sangre }, FRAMES.sangre)
            .to(media, { yPercent: fondoY, duration: 1 }, 0)
            .to(contenido, { yPercent: contenidoY, duration: 1 }, 0)
            .to(velo, { opacity: 0.55, duration: DURACION.velo }, FRAMES.velo);

          capas.forEach(([capa, progreso]) => {
            linea.to(
              capa,
              {
                autoAlpha: 1,
                y: 0,
                clipPath: VISIBLE,
                duration: DURACION.capa,
              },
              progreso
            );
          });

          linea
            .to(media, { scale: zoomD, duration: DURACION.salida }, FRAMES.salida)
            // Cierra exactamente en 1 (0,82 + 0,18): si la línea durase más,
            // el mapa de frames se reescalaría.
            .to(velo, { opacity: 0.66, duration: DURACION.salida }, FRAMES.salida);
        }
      );

      return () => mm.revert();
    },
    { scope: raiz }
  );

  const alternar = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => undefined);
    else el.pause();
  };

  return (
    <section
      ref={raiz}
      className={styles.section}
      id={id}
      style={{ "--recorrido": `${motion.pin.suave}vh` } as CSSProperties}
    >
      <div className={styles.escena}>
        <div className={styles.marco}>
          <div className={styles.media}>
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="100vw"
              className={styles.poster}
            />

            <video
              ref={videoRef}
              className={`${styles.video} ${enMarcha ? styles.videoActivo : ""}`}
              src={video}
              muted
              loop
              playsInline
              preload="none"
              tabIndex={-1}
              aria-hidden="true"
              onPlay={() => setEnMarcha(true)}
              onPause={() => setEnMarcha(false)}
            />
          </div>

          <span className={styles.velo} aria-hidden="true" data-entrada="" />
        </div>

        <div className={styles.contenido}>
          <div className={styles.interior}>
            {eyebrow && (
              <p className={styles.eyebrow} data-entrada="">
                {eyebrow}
              </p>
            )}

            <h2 className={`display ${styles.titulo}`} data-entrada="">
              {titulo}
            </h2>

            {texto && (
              <p className={styles.parrafo} data-entrada="">
                {texto}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.control}
          onClick={alternar}
          aria-label={enMarcha ? "Pausar el video" : "Reproducir el video"}
        >
          {enMarcha ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
          <span>{enMarcha ? "Pausar" : "Reproducir"}</span>
        </button>
      </div>
    </section>
  );
}
