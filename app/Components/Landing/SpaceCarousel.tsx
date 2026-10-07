"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "../Reveal/Reveal";
import { useSnapCarousel } from "../../lib/useSnapCarousel";
import CarouselArrow from "../ui/CarouselArrow/CarouselArrow";
import { MEDIOS, motion, START, sinMovimiento } from "../../lib/motion";
import { ESPACIOS } from "./secciones.data";

import styles from "./SpaceCarousel.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CERRADO = "inset(0 0 100% 0)";
const ABIERTO = "inset(0 0 0% 0)";

/** Mismo alzado que declara el contrato para data-entrada="sube". */
const ALZADA = 34;

const ESCALA_ACTIVA = 1.04;
const DERIVA_CABECERA = -6;

export default function SpaceCarousel() {
  const [galeria, setGaleria] = useState(false);

  // Fuera del modo galería la pista es un contenedor con scroll y el hook la
  // gobierna. Dentro, la ref se suelta: su efecto encuentra la pista a null y
  // no instala listeners, y el recuento a 0 es lo que le hace reevaluarse al
  // entrar y salir del modo.
  const { trackRef, atStart, atEnd, next, prev } = useSnapCarousel(
    galeria ? 0 : ESPACIOS.length
  );

  const raiz = useRef<HTMLElement>(null);
  const progreso = useRef<HTMLSpanElement>(null);

  // Misma condición que consume gsap.matchMedia, para que el marcado y la
  // coreografía no puedan discrepar.
  useEffect(() => {
    const ancho = window.matchMedia(MEDIOS.escritorio);
    const reducido = window.matchMedia(MEDIOS.reducido);

    const sincronizar = () =>
      setGaleria(ancho.matches && !reducido.matches);

    sincronizar();
    ancho.addEventListener("change", sincronizar);
    reducido.addEventListener("change", sincronizar);

    return () => {
      ancho.removeEventListener("change", sincronizar);
      reducido.removeEventListener("change", sincronizar);
    };
  }, []);

  useGSAP(
    () => {
      if (sinMovimiento()) return;

      const seccion = raiz.current;
      if (!seccion) return;

      // La pista se busca en el DOM: su ref pertenece al hook y desaparece en
      // modo galería.
      const pista = seccion.querySelector<HTMLElement>(`.${styles.track}`);
      if (!pista) return;

      const tarjetas = Array.from(
        seccion.querySelectorAll<HTMLElement>(`.${styles.card}`)
      );
      if (tarjetas.length === 0) return;

      const cabecera = seccion.querySelector<HTMLElement>(
        `.${styles.cabecera}`
      );

      // La entrada vive fuera de matchMedia: es un disparo único y no debe
      // repetirse al cruzar un breakpoint ni al girar el dispositivo.
      const entrada = gsap.timeline({
        defaults: { ease: motion.ease.cinematic },
        scrollTrigger: { trigger: seccion, start: START, once: true },
      });

      tarjetas.forEach((tarjeta, i) => {
        const media = tarjeta.querySelector<HTMLElement>(`.${styles.media}`);
        const nombre = tarjeta.querySelector<HTMLElement>(`.${styles.nombre}`);
        const detalle = tarjeta.querySelector<HTMLElement>(
          `.${styles.detalle}`
        );
        if (!media || !nombre || !detalle) return;

        const t = i * 0.07;

        // El contrato sirve estos nodos ya en opacidad 0, así que la opacidad
        // forma parte del tween: sin ella nunca volverían a verse.
        entrada.fromTo(
          media,
          { clipPath: CERRADO, y: ALZADA, opacity: 0 },
          {
            clipPath: ABIERTO,
            y: 0,
            opacity: 1,
            duration: motion.duration.cinematic,
          },
          t
        );

        entrada.fromTo(
          nombre,
          { clipPath: CERRADO, opacity: 0 },
          { clipPath: ABIERTO, opacity: 1, duration: motion.duration.base },
          t + 0.14
        );

        entrada.fromTo(
          detalle,
          { opacity: 0 },
          { opacity: 1, duration: motion.duration.base },
          t + 0.22
        );
      });

      const mm = gsap.matchMedia();

      // Un solo corte: la galería fijada empieza en CORTE.escritorio, el mismo
      // valor que abre el bloque de galería del CSS. Por debajo no se crea
      // nada y el carrusel táctil se queda tal cual.
      mm.add(MEDIOS.escritorio, () => {
        // El bloque de galería del CSS (pista desbordada, flechas ocultas)
        // depende de esta marca: si el script no corre, queda el carrusel
        // con scroll nativo y nada se vuelve inalcanzable.
        seccion.dataset.galeria = "activa";

        // El recorrido no depende de scrollWidth: se mide con las cajas
        // reales, así la transformación activa no falsea la medida.
        const medirDistancia = () => {
          const ultima = tarjetas[tarjetas.length - 1];
          const caja = pista.getBoundingClientRect();
          const margen = parseFloat(getComputedStyle(pista).paddingRight) || 0;

          return Math.max(
            1,
            Math.round(
              ultima.getBoundingClientRect().right - caja.right + margen
            )
          );
        };

        // Doce tarjetas miden casi tres pantallas de desplazamiento: el pin se
        // acota al token de recorrido y el scrub reparte la misma distancia en
        // menos scroll secuestrado.
        const medirRecorrido = () =>
          Math.min(
            medirDistancia(),
            Math.round((window.innerHeight * motion.pin.fuerte) / 100)
          );

        let distancia = 0;
        let anclaje = 0;
        let anchoVentana = 0;
        let centros: number[] = [];
        let activa = -1;

        const medirEstado = () => {
          const x = (gsap.getProperty(pista, "x") as number) || 0;
          const caja = pista.getBoundingClientRect();

          anclaje = caja.left - x;
          anchoVentana = document.documentElement.clientWidth;
          distancia = medirDistancia();

          centros = tarjetas.map((tarjeta) => {
            const c = tarjeta.getBoundingClientRect();
            return c.left - caja.left + c.width / 2;
          });
        };

        const marcarActiva = (p: number) => {
          if (centros.length === 0) return;

          const objetivo = anchoVentana / 2 - anclaje + distancia * p;

          let mejor = 0;
          let minima = Number.POSITIVE_INFINITY;

          centros.forEach((centro, i) => {
            const d = Math.abs(centro - objetivo);
            if (d < minima) {
              minima = d;
              mejor = i;
            }
          });

          if (mejor === activa) return;

          const anterior = activa;
          activa = mejor;

          [anterior, mejor].forEach((i) => {
            if (i < 0) return;

            const media = tarjetas[i].querySelector<HTMLElement>(
              `.${styles.media}`
            );
            if (!media) return;

            gsap.to(media, {
              scale: i === mejor ? ESCALA_ACTIVA : 1,
              duration: motion.duration.fast,
              ease: motion.ease.ui,
              overwrite: "auto",
            });
          });
        };

        const escena = gsap.timeline({
          scrollTrigger: {
            trigger: seccion,
            start: "top top",
            end: () => "+=" + medirRecorrido(),
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              medirEstado();
              marcarActiva(self.progress);
            },
            onUpdate: (self) => marcarActiva(self.progress),
          },
        });

        // fromTo fija el origen en 0 aunque el refresco llegue a mitad del
        // recorrido; sin él el scrub re-grabaría la x actual como inicio.
        escena.fromTo(
          pista,
          { x: 0 },
          { x: () => -medirDistancia(), ease: motion.ease.scrub },
          0
        );

        if (cabecera) {
          escena.fromTo(
            cabecera,
            { yPercent: 0 },
            { yPercent: DERIVA_CABECERA, ease: motion.ease.scrub },
            0
          );
        }

        // La barra va en la misma línea de tiempo que la pista: el scrub la
        // deja exacta en 0 y en 1, sin depender de un onUpdate suelto.
        if (progreso.current) {
          escena.fromTo(
            progreso.current,
            { scaleX: 0 },
            { scaleX: 1, ease: motion.ease.scrub },
            0
          );
        }

        return () => seccion.removeAttribute("data-galeria");
      });

      return () => mm.revert();
    },
    { scope: raiz }
  );

  return (
    <section ref={raiz} className={styles.section} id="espacios">
      <div className={styles.escena}>
        <Reveal as="header" className={styles.cabecera}>
          <div>
            <p className={styles.eyebrow} data-reveal data-entrada="sube">
              Los espacios
            </p>

            <h2
              className={`display ${styles.titulo}`}
              data-reveal
              data-entrada="sube"
            >
              Todo lo que encontrarás dentro
            </h2>
          </div>

          {/* Las flechas no entran con la cabecera: son botones y no deben
              existir mientras están invisibles. */}
          {!galeria && (
            <div className={styles.flechas}>
              <CarouselArrow
                direction="prev"
                onClick={prev}
                disabled={atStart}
                tone="plain"
                label="Espacios anteriores"
              />
              <CarouselArrow
                direction="next"
                onClick={next}
                disabled={atEnd}
                tone="plain"
                label="Espacios siguientes"
              />
            </div>
          )}
        </Reveal>

        <div
          ref={galeria ? null : trackRef}
          className={styles.track}
          tabIndex={galeria ? undefined : 0}
          role="group"
          aria-label="Galería de espacios del club"
        >
          {ESPACIOS.map((e) => (
            <article key={e.nombre} className={styles.card}>
              <div className={styles.media} data-entrada="sube">
                <Image
                  src={e.imagen}
                  alt={e.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 700px) 44vw, 78vw"
                  className={styles.imagen}
                />
              </div>

              <h3 className={styles.nombre} data-entrada="mascara">
                {e.nombre}
              </h3>
              <p className={styles.detalle} data-entrada>
                {e.detalle}
              </p>
            </article>
          ))}
        </div>

        <div className={styles.barra} aria-hidden="true">
          <span ref={progreso} className={styles.barraRelleno} />
        </div>
      </div>
    </section>
  );
}
