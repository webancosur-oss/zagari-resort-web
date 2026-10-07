"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { MEDIOS, motion, sinMovimiento } from "../../lib/motion";

import styles from "./SplitSection.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitSectionBase {
  id?: string;
  eyebrow?: string;
  titulo: string;
  texto: string;
  /** Segundo párrafo opcional. */
  texto2?: string;
  imagen: string;
  alt: string;
  enlace?: { label: string; href: string };
  /** Invierte el orden en escritorio. */
  invertido?: boolean;
  /** Fondo alterno. */
  tono?: "claro" | "crema";
  /** Dato destacado: "3.000 m²" + descripción. */
  dato?: { valor: string; texto: string };
}

/**
 * La imagen secundaria nunca es decorativa: su alt viaja con ella, así que el
 * tipo no permite pasar una sin la otra.
 */
export type SplitSectionProps =
  | (SplitSectionBase & { imagen2: string; alt2: string })
  | (SplitSectionBase & { imagen2?: never; alt2?: never });

/** Posición de cada capa en la línea de tiempo de entrada, en segundos. */
const FRAME = {
  principal: 0,
  eyebrow: 0.1,
  titulo: 0.2,
  parrafo: 0.32,
  dato: 0.44,
  enlace: 0.54,
  secundaria: 0.62,
} as const;

/** Desplazamiento inicial que declara el contrato para data-entrada="sube". */
const SUBE = 34;

interface Perfil {
  /** Altura del disparo de entrada, en % de viewport. */
  inicio: number;
  escala: number;
  desvio: number;
  fondo: number;
  frente: number;
  segunda: number;
}

const PERFILES: Record<"escritorio" | "tablet" | "movil", Perfil> = {
  escritorio: {
    inicio: 86,
    escala: 1.06,
    desvio: 26,
    fondo: 7,
    frente: 2.5,
    segunda: 14,
  },
  tablet: {
    inicio: 88,
    escala: 1.04,
    desvio: 0,
    fondo: 4,
    frente: 1.2,
    segunda: 0,
  },
  movil: {
    inicio: 92,
    escala: 1.02,
    desvio: 0,
    fondo: 2.5,
    frente: 0,
    segunda: 0,
  },
};

/**
 * La imagen secundaria solo se muestra en escritorio: montarla por debajo de
 * ese corte sería descargar un archivo que nadie llega a ver.
 */
function useEscritorio(): boolean {
  const [esEscritorio, setEsEscritorio] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia(MEDIOS.escritorio);
    const sincronizar = () => setEsEscritorio(consulta.matches);

    sincronizar();
    consulta.addEventListener("change", sincronizar);
    return () => consulta.removeEventListener("change", sincronizar);
  }, []);

  return esEscritorio;
}

export default function SplitSection(props: SplitSectionProps) {
  const {
    id,
    eyebrow,
    titulo,
    texto,
    texto2,
    imagen,
    alt,
    enlace,
    invertido = false,
    tono = "claro",
    dato,
  } = props;

  const raiz = useRef<HTMLElement>(null);
  const esEscritorio = useEscritorio();

  useGSAP(
    () => {
      const el = raiz.current;
      if (!el || sinMovimiento()) return;

      const espejo = invertido ? -1 : 1;
      const uno = (sel: string) => el.querySelector<HTMLElement>(sel);

      const bloque = uno("[data-escena='bloque']");
      const principal = uno("[data-escena='principal']");
      const capaPrincipal = uno("[data-escena='capaPrincipal']");
      const secundaria = uno("[data-escena='secundaria']");
      const capaSecundaria = uno("[data-escena='capaSecundaria']");
      const bloqueTexto = uno("[data-escena='texto']");
      const capas = Array.from(
        el.querySelectorAll<HTMLElement>("[data-capa]")
      );

      const mm = gsap.matchMedia();

      mm.add(
        {
          escritorio: MEDIOS.escritorio,
          tablet: MEDIOS.tablet,
          movil: MEDIOS.movil,
        },
        (contexto) => {
          const condiciones = contexto.conditions ?? {};
          const p = condiciones.escritorio
            ? PERFILES.escritorio
            : condiciones.tablet
              ? PERFILES.tablet
              : PERFILES.movil;

          // Las entradas no se revierten: el contenido editorial no puede
          // desaparecer al subir el scroll mientras sigue en pantalla.
          const entrada = (disparador: Element) => ({
            trigger: disparador,
            start: `top ${p.inicio}%`,
            once: true,
          });

          // Escena de las imágenes, anclada a la figura: apilada en móvil y
          // tablet queda muy por debajo del texto y necesita su propio disparo.
          if (principal) {
            const imagenes = gsap.timeline({
              defaults: { ease: motion.ease.cinematic },
              scrollTrigger: entrada(principal),
            });

            imagenes.fromTo(
              principal,
              { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
              {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: motion.duration.cinematic,
              },
              FRAME.principal
            );

            // La capa interior no declara su escala en CSS: la figura que la
            // contiene ya nace oculta por el contrato, así que no hay salto.
            if (capaPrincipal) {
              imagenes.fromTo(
                capaPrincipal,
                { scale: p.escala },
                { scale: 1, duration: motion.duration.cinematic },
                FRAME.principal
              );
            }

            if (secundaria) {
              imagenes.fromTo(
                secundaria,
                {
                  opacity: 0,
                  clipPath: "inset(0% 0% 100% 0%)",
                  x: -p.desvio * espejo,
                },
                {
                  opacity: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  x: 0,
                  duration: motion.duration.base,
                },
                FRAME.secundaria
              );

              if (capaSecundaria) {
                imagenes.fromTo(
                  capaSecundaria,
                  { scale: 1.08 },
                  { scale: 1, duration: motion.duration.base },
                  FRAME.secundaria
                );
              }
            }
          }

          // Escena del texto, anclada a la rejilla y no al bloque de texto:
          // ese lleva parallax y su transform falsearía la medida del disparo.
          if (bloque) {
            const textos = gsap.timeline({
              defaults: { ease: motion.ease.ui },
              scrollTrigger: entrada(bloque),
            });

            let parrafos = 0;
            capas.forEach((nodo) => {
              const nombre = nodo.dataset.capa as keyof typeof FRAME;
              const base = FRAME[nombre];
              if (base === undefined) return;

              const en = nombre === "parrafo" ? base + parrafos++ * 0.08 : base;

              if (nombre === "titulo") {
                textos.fromTo(
                  nodo,
                  { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
                  {
                    opacity: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: motion.duration.base,
                    ease: motion.ease.cinematic,
                  },
                  en
                );
                return;
              }

              // El enlace es enfocable: autoAlpha apaga también visibility.
              const invisible = nombre === "enlace" ? "autoAlpha" : "opacity";
              textos.fromTo(
                nodo,
                { [invisible]: 0, y: SUBE },
                { [invisible]: 1, y: 0, duration: motion.duration.base },
                en
              );
            });
          }

          // Parallax continuo: el único scrub reversible de la sección, donde
          // volver atrás al subir el scroll es justo lo que se espera.
          const deriva = gsap.timeline({
            defaults: { duration: 1, ease: motion.ease.scrub },
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });

          if (capaPrincipal) {
            deriva.fromTo(
              capaPrincipal,
              { yPercent: p.fondo },
              { yPercent: -p.fondo },
              0
            );
          }

          if (p.frente && bloqueTexto) {
            deriva.fromTo(
              bloqueTexto,
              { yPercent: p.frente },
              { yPercent: -p.frente },
              0
            );
          }

          if (p.segunda && capaSecundaria) {
            deriva.fromTo(
              capaSecundaria,
              { yPercent: p.segunda },
              { yPercent: -p.segunda },
              0
            );
          }
        }
      );

      return () => mm.revert();
    },
    { scope: raiz, dependencies: [invertido, esEscritorio] }
  );

  return (
    <section
      ref={raiz}
      id={id}
      className={`${styles.section} ${styles[tono]}`}
    >
      <div
        className={`${styles.inner} ${invertido ? styles.invertido : ""}`}
        data-escena="bloque"
      >
        <div className={styles.texto} data-escena="texto">
          {eyebrow && (
            <p
              className={styles.eyebrow}
              data-capa="eyebrow"
              data-entrada="sube"
            >
              {eyebrow}
            </p>
          )}

          <h2
            className={`display ${styles.titulo}`}
            data-capa="titulo"
            data-entrada="mascara"
          >
            {titulo}
          </h2>

          <p
            className={styles.parrafo}
            data-capa="parrafo"
            data-entrada="sube"
          >
            {texto}
          </p>

          {texto2 && (
            <p
              className={styles.parrafo}
              data-capa="parrafo"
              data-entrada="sube"
            >
              {texto2}
            </p>
          )}

          {dato && (
            <p className={styles.dato} data-capa="dato" data-entrada="sube">
              <span className={`display ${styles.datoValor}`}>
                {dato.valor}
              </span>
              <span className={styles.datoTexto}>
                {dato.texto}
              </span>
            </p>
          )}

          {enlace && (
            <Link
              href={enlace.href}
              className={styles.enlace}
              data-capa="enlace"
              data-entrada="sube"
            >
              {enlace.label}
            </Link>
          )}
        </div>

        <div className={styles.media}>
          <figure
            className={styles.principal}
            data-escena="principal"
            data-entrada="mascara"
          >
            <div className={styles.capa} data-escena="capaPrincipal">
              <Image
                src={imagen}
                alt={alt}
                fill
                sizes="(min-width: 900px) 48vw, 92vw"
                className={styles.imagen}
              />
            </div>
          </figure>

          {props.imagen2 && esEscritorio && (
            <figure
              className={styles.secundaria}
              data-escena="secundaria"
              data-entrada="mascara"
            >
              <div className={styles.capa} data-escena="capaSecundaria">
                <Image
                  src={props.imagen2}
                  alt={props.alt2}
                  fill
                  sizes="22vw"
                  className={styles.imagen}
                />
              </div>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
