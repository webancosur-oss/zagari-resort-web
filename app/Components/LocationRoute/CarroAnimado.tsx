"use client";

import { memo, useId, useSyncExternalStore } from "react";
import { motion, type Variants } from "motion/react";

/**
 * La van del club de public/assets/icons/car.svg (vista cenital, mirando a
 * la derecha), en línea para poder animar sus partes con Motion (MIT).
 * Se dibuja centrada en el origen con 52×26 px.
 */

type Estado = "andando" | "quieto" | "fijo";

const BUCLE = { repeat: Infinity, ease: "easeInOut" } as const;

const CUERPO: Variants = {
  andando: {
    rotate: [0, -0.9, 0, 0.9, 0],
    y: [0, -0.35, 0, 0.35, 0],
    transition: { ...BUCLE, duration: 0.6 },
  },
  quieto: { rotate: 0, y: 0, transition: { duration: 0.4 } },
  fijo: { rotate: 0, y: 0, transition: { duration: 0 } },
};

const SOMBRA: Variants = {
  andando: { scaleX: [1, 1.04, 1], transition: { ...BUCLE, duration: 0.6 } },
  quieto: { scaleX: 1 },
  fijo: { scaleX: 1, transition: { duration: 0 } },
};

const HAZ: Variants = {
  andando: {
    opacity: [0.35, 0.65, 0.35],
    transition: { ...BUCLE, duration: 1.4 },
  },
  quieto: { opacity: 0.12, transition: { duration: 0.5 } },
  fijo: { opacity: 0.35, transition: { duration: 0 } },
};

// Luces de freno: se encienden al detenerse.
const FRENO: Variants = {
  andando: { opacity: 0.15, transition: { duration: 0.3 } },
  quieto: { opacity: [0.15, 1, 0.75], transition: { duration: 0.5 } },
  fijo: { opacity: 0.15, transition: { duration: 0 } },
};

function humo(retraso: number): Variants {
  return {
    andando: {
      cx: [5, -8],
      r: [1.4, 4.2],
      opacity: [0.5, 0],
      transition: {
        repeat: Infinity,
        ease: "easeOut",
        duration: 1.1,
        delay: retraso,
      },
    },
    quieto: { opacity: 0, transition: { duration: 0.3 } },
    fijo: { opacity: 0, transition: { duration: 0 } },
  };
}

const HUMO = [humo(0), humo(0.37), humo(0.74)];

const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribir(avisar: () => void) {
  const mq = window.matchMedia(CONSULTA);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
}

// Con valor fijo en el servidor la hidratación coincide; useReducedMotion de
// Motion devuelve null en el servidor y el valor real en el primer render
// del cliente, y el estado inicial del coche no coincidía.
function useMovimientoReducido() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}

interface CarroAnimadoProps {
  enMarcha: boolean;
  /** Cuando la van va hacia la izquierda, el logo del techo se gira para leerse. */
  logoInvertido?: boolean;
}

function CarroAnimado({ enMarcha, logoInvertido = false }: CarroAnimadoProps) {
  const reducido = useMovimientoReducido();
  const id = useId().replace(/:/g, "");
  const estado: Estado = reducido ? "fijo" : enMarcha ? "andando" : "quieto";

  return (
    // Posición y escala en un <g> estático: Motion escribe su propio transform
    // en los elementos que anima y pisaría este atributo.
    <g transform="translate(-26 -13) scale(0.8125)" aria-hidden="true">
      <motion.g initial={false} animate={estado}>
        <defs>
          <linearGradient id={`${id}-haz`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {HUMO.map((v, i) => (
          <motion.circle
            key={i}
            cx={5}
            cy={16}
            r={1.4}
            fill="#e9eeeb"
            variants={v}
            initial={{ opacity: 0 }}
          />
        ))}

        <motion.ellipse
          cx={32}
          cy={17}
          rx={28}
          ry={12.5}
          fill="rgba(0,0,0,.3)"
          variants={SOMBRA}
        />

        <motion.path
          d="M59 11 L80 5 L80 27 L59 21 Z"
          fill={`url(#${id}-haz)`}
          variants={HAZ}
        />

        <motion.g variants={CUERPO}>
          <rect x="11" y="4.2" width="7" height="3.2" rx="1.4" fill="#141a17" />
          <rect x="44" y="4.2" width="7" height="3.2" rx="1.4" fill="#141a17" />
          <rect
            x="11"
            y="24.6"
            width="7"
            height="3.2"
            rx="1.4"
            fill="#141a17"
          />
          <rect
            x="44"
            y="24.6"
            width="7"
            height="3.2"
            rx="1.4"
            fill="#141a17"
          />

          {/* Contorno blanco: sin él el verde se pierde sobre el satélite. */}
          <path
            d="M9 6H52c4.5 0 7 3 7 7v6c0 4-2.5 7-7 7H9c-2.2 0-4-1.8-4-4V10c0-2.2 1.8-4 4-4Z"
            fill="#0d6b47"
            stroke="#ffffff"
            strokeWidth="1"
          />

          <path
            d="M50 8h3c2.6 0 4 2.2 4 5v6c0 2.8-1.4 5-4 5h-3Z"
            fill="#1b2a24"
            opacity=".9"
          />

          <rect
            x="10"
            y="8.2"
            width="39"
            height="15.6"
            rx="2.5"
            fill="#0f7a52"
          />
          <rect
            x="11"
            y="8.9"
            width="37"
            height="0.9"
            rx="0.45"
            fill="#ffffff"
            opacity=".85"
          />
          <rect
            x="11"
            y="22.2"
            width="37"
            height="0.9"
            rx="0.45"
            fill="#ffffff"
            opacity=".85"
          />

          <image
            transform={logoInvertido ? "rotate(180 29.5 16.025)" : undefined}
            href="/assets/logo/zagari-logo-light.svg"
            x="14.5"
            y="13.1"
            width="30"
            height="5.85"
          />

          <rect
            x="49"
            y="4.4"
            width="2.6"
            height="1.8"
            rx="0.6"
            fill="#0a5236"
          />
          <rect
            x="49"
            y="25.8"
            width="2.6"
            height="1.8"
            rx="0.6"
            fill="#0a5236"
          />

          <line
            x1="8"
            y1="9"
            x2="8"
            y2="23"
            stroke="#ffffff"
            strokeOpacity=".35"
            strokeWidth=".5"
          />

          <circle cx="57.6" cy="10.2" r="1.5" fill="#fff3c4" />
          <circle cx="57.6" cy="21.8" r="1.5" fill="#fff3c4" />

          <motion.rect
            x="5.4"
            y="8.2"
            width="1.4"
            height="3"
            rx="0.6"
            fill="#ff3b30"
            variants={FRENO}
          />
          <motion.rect
            x="5.4"
            y="20.8"
            width="1.4"
            height="3"
            rx="0.6"
            fill="#ff3b30"
            variants={FRENO}
          />
        </motion.g>
      </motion.g>
    </g>
  );
}

export default memo(CarroAnimado);
