"use client";

import { useRef, type HTMLAttributes, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps extends HTMLAttributes<HTMLElement> {
  /** Solo etiquetas HTML: con R3F instalado, ElementType incluye también los
      elementos de three.js y las props se vuelven incompatibles. */
  as?: keyof HTMLElementTagNameMap;
  /** Segundos antes de arrancar. */
  delay?: number;
  /** Segundos, como todo GSAP. Antes eran milisegundos: 850 aquí duraba 14 min. */
  duration?: number;
  /** Desplazamiento vertical de entrada, en px. */
  distance?: number;
  /** Separación entre elementos marcados con data-reveal. */
  stagger?: number;
  /** Punto de disparo de ScrollTrigger. */
  start?: string;
}

export default function Reveal({
  children,
  as: Component = "div",
  delay = 0,
  duration = 0.9,
  distance = 34,
  stagger = 0.09,
  start = "top 84%",
  className = "",
  ...rest
}: RevealProps) {
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = raiz.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Si hay piezas marcadas, entran escalonadas; si no, entra la sección.
      const marcados = Array.from(
        el.querySelectorAll<HTMLElement>("[data-reveal]")
      );
      const objetivos = marcados.length > 0 ? marcados : [el];

      gsap.set(objetivos, {
        opacity: 0,
        y: distance,
        filter: marcados.length > 0 ? "blur(6px)" : "none",
      });

      gsap.to(objetivos, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        delay,
        stagger: marcados.length > 0 ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: raiz }
  );

  // Todas las etiquetas HTML comparten estas props; "div" solo fija el tipo.
  const Etiqueta = Component as "div";

  return (
    <Etiqueta
      ref={raiz as RefObject<HTMLDivElement | null>}
      className={className}
      {...rest}
    >
      {children}
    </Etiqueta>
  );
}
