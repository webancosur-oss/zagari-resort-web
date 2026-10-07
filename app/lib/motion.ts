/** Tokens de movimiento. Un solo sitio para el ritmo de toda la página. */
export const motion = {
  duration: {
    fast: 0.45,
    base: 0.8,
    cinematic: 1.4,
    slow: 2,
  },
  ease: {
    ui: "power2.out",
    cinematic: "power3.out",
    scrub: "none",
  },
  distance: {
    text: 40,
    imageParallax: 10,
  },
  /** Recorrido extra que consume una sección fijada, en % de viewport. */
  pin: {
    suave: 120,
    fuerte: 180,
    secuencia: 280,
  },
} as const;

/** Punto de disparo por defecto para entradas al hacer scroll. */
export const START = "top 84%";

/**
 * Escalera única de movimiento. Sin huecos sub-pixel entre condiciones y
 * pensada para gsap.matchMedia(). Las media queries de CSS que activen el
 * MISMO comportamiento deben usar estos mismos cortes.
 */
export const CORTE = {
  tablet: 700,
  escritorio: 1024,
} as const;

export const MEDIOS = {
  movil: `(max-width: ${CORTE.tablet - 0.02}px)`,
  tablet: `(min-width: ${CORTE.tablet}px) and (max-width: ${CORTE.escritorio - 0.02}px)`,
  escritorio: `(min-width: ${CORTE.escritorio}px)`,
  /** Todo lo que no es móvil, para las secciones que solo distinguen dos modos. */
  anchos: `(min-width: ${CORTE.tablet}px)`,
  reducido: "(prefers-reduced-motion: reduce)",
} as const;

export function sinMovimiento(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
