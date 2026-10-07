"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instancia: Lenis | null = null;

/**
 * Desplaza a un ancla de la página actual respetando scroll-margin-top.
 * Pasa por Lenis cuando está activo: si se dejara al navegador saltar y Lenis
 * animar a la vez, la página saltaría, rebotaría y volvería a animar.
 */
export function desplazarA(selector: string): boolean {
  const destino = document.querySelector<HTMLElement>(selector);
  if (!destino) return false;

  // Si el destino está dentro de un desplegable cerrado, se abre antes.
  const desplegable = destino.closest("details");
  if (desplegable && !desplegable.open) desplegable.open = true;

  if (instancia) {
    instancia.scrollTo(destino);
  } else {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    destino.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
  }

  window.history.replaceState(null, "", selector);
  return true;
}

/** Detiene o reanuda el desplazamiento de la página (p. ej., bajo una vista a pantalla completa). */
export function bloquearDesplazamiento(bloquear: boolean) {
  document.documentElement.style.overflow = bloquear ? "hidden" : "";
  if (bloquear) instancia?.stop();
  else instancia?.start();
}

/**
 * Único punto de integración entre Lenis y GSAP.
 * Ningún otro componente debe instanciar Lenis ni tocar el ticker.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Los enlaces a anclas de la misma página también se desplazan con
      // Lenis; respeta scroll-margin-top, así nada queda bajo la barra.
      anchors: true,
    });

    instancia = lenis;

    const alScroll = () => ScrollTrigger.update();
    lenis.on("scroll", alScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Si la altura del documento cambia (fuentes, imágenes, secciones que
    // montan tarde), los disparadores ya calculados apuntarían a posiciones
    // viejas y algunos no llegarían a ejecutarse nunca.
    let pendiente = 0;
    const recalcular = () => {
      window.clearTimeout(pendiente);
      pendiente = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const alCargar = () => recalcular();
    window.addEventListener("load", alCargar);
    document.fonts?.ready.then(recalcular);
    let altoPrevio = document.documentElement.scrollHeight;
    const vigia = new ResizeObserver(() => {
      const alto = document.documentElement.scrollHeight;
      if (Math.abs(alto - altoPrevio) > 2) {
        altoPrevio = alto;
        recalcular();
      }
    });
    vigia.observe(document.body);

    return () => {
      window.removeEventListener("load", alCargar);
      window.clearTimeout(pendiente);
      vigia.disconnect();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", alScroll);
      lenis.destroy();
      instancia = null;
    };
  }, []);

  return null;
}
