"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import styles from "./ZagariManifesto.module.css";

/* ==========================================================
   PALABRAS
========================================================== */

const slides = [
  {
    word: "DESCUBRE",

    description:
      "Descubre un refugio rodeado de naturaleza, experiencias y rincones que invitan a vivir San Ramón de una manera diferente.",

    className:
      "discover",
  },

  {
    word: "CONECTA",

    description:
      "Conecta contigo, con quienes más quieres y con un entorno creado para bajar el ritmo y disfrutar cada momento.",

    className:
      "connect",
  },

  {
    word: "DISFRUTA",

    description:
      "Disfruta espacios, sabores y experiencias pensadas para transformar una escapada en un recuerdo que permanece.",

    className:
      "enjoy",
  },

  {
    word: "VIVE",

    description:
      "Vive la Selva Central con libertad, bienestar y una forma más auténtica de conectar con la naturaleza.",

    className:
      "live",
  },

  {
    word: "ZAGARI",

    description:
      "Un lugar para descubrir, conectar, disfrutar y vivir diferente.",

    className:
      "zagari",
  },
] as const;

/* ==========================================================
   TYPES
========================================================== */

type Slide =
  (typeof slides)[number];

type PinMode =
  | "before"
  | "fixed"
  | "after";

type ManifestoSlideProps = {
  slide: Slide;
  index: number;
  progress: MotionValue<number>;
};

/* ==========================================================
   SLIDE
========================================================== */

function ManifestoSlide({
  slide,
  index,
  progress,
}: ManifestoSlideProps) {
  const total =
    slides.length;

  const step =
    1 / total;

  const start =
    index * step;

  /* =========================================
     ENTRADA
  ========================================= */

  const enterStart =
    Math.max(
      0,
      start - 0.04
    );

  const enterEnd =
    index === 0
      ? 0
      : start + 0.04;

  /* =========================================
     SALIDA
  ========================================= */

  const exitStart =
    Math.min(
      1,
      start +
        step -
        0.07
    );

  const exitEnd =
    Math.min(
      1,
      start +
        step +
        0.025
    );

  /* =========================================
     OPACITY
  ========================================= */

  const opacity =
    index === 0
      ? useTransform(
          progress,

          [
            0,
            exitStart,
            exitEnd,
          ],

          [
            1,
            1,
            0,
          ],

          {
            clamp: true,
          }
        )
      : index ===
          total - 1
        ? useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              1,
            ],

            [
              0,
              1,
              1,
            ],

            {
              clamp: true,
            }
          )
        : useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              exitStart,
              exitEnd,
            ],

            [
              0,
              1,
              1,
              0,
            ],

            {
              clamp: true,
            }
          );

  /* =========================================
     MOVIMIENTO VERTICAL
  ========================================= */

  const y =
    index === 0
      ? useTransform(
          progress,

          [
            0,
            exitStart,
            exitEnd,
          ],

          [
            0,
            0,
            -70,
          ],

          {
            clamp: true,
          }
        )
      : index ===
          total - 1
        ? useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              1,
            ],

            [
              70,
              0,
              0,
            ],

            {
              clamp: true,
            }
          )
        : useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              exitStart,
              exitEnd,
            ],

            [
              70,
              0,
              0,
              -70,
            ],

            {
              clamp: true,
            }
          );

  /* =========================================
     SCALE
  ========================================= */

  const scale =
    index === 0
      ? useTransform(
          progress,

          [
            0,
            exitStart,
            exitEnd,
          ],

          [
            1,
            1,
            1.06,
          ],

          {
            clamp: true,
          }
        )
      : index ===
          total - 1
        ? useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              1,
            ],

            [
              0.92,
              1,
              1,
            ],

            {
              clamp: true,
            }
          )
        : useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              exitStart,
              exitEnd,
            ],

            [
              0.92,
              1,
              1,
              1.06,
            ],

            {
              clamp: true,
            }
          );

  /* =========================================
     BLUR
  ========================================= */

  const blur =
    index === 0
      ? useTransform(
          progress,

          [
            0,
            exitStart,
            exitEnd,
          ],

          [
            0,
            0,
            7,
          ]
        )
      : index ===
          total - 1
        ? useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              1,
            ],

            [
              7,
              0,
              0,
            ]
          )
        : useTransform(
            progress,

            [
              enterStart,
              enterEnd,
              exitStart,
              exitEnd,
            ],

            [
              7,
              0,
              0,
              7,
            ]
          );

  const filter =
    useTransform(
      blur,
      (value) =>
        `blur(${value}px)`
    );

  return (
    <motion.article
      className={`${styles.slide} ${
        styles[
          slide.className
        ]
      }`}
      style={{
        opacity,
        y,
        scale,
        filter,
      }}
    >
      {/* =====================================
          PALABRA FANTASMA
      ====================================== */}

      <span
        className={
          styles.ghostWord
        }
        aria-hidden="true"
      >
        {slide.word}
      </span>

      {/* =====================================
          PALABRA PRINCIPAL
      ====================================== */}

      {slide.word ===
      "ZAGARI" ? (
        <h2
          className={`${styles.word} ${styles.zagariWord}`}
        >
          <span
            className={
              styles.zPink
            }
          >
            Z
          </span>

          <span
            className={
              styles.zOrange
            }
          >
            A
          </span>

          <span
            className={
              styles.zYellow
            }
          >
            G
          </span>

          <span
            className={
              styles.zGreen
            }
          >
            A
          </span>

          <span
            className={
              styles.zCyan
            }
          >
            R
          </span>

          <span
            className={
              styles.zBlue
            }
          >
            I
          </span>
        </h2>
      ) : (
        <h2
          className={
            styles.word
          }
        >
          {slide.word}
        </h2>
      )}

      {/* =====================================
          TEXTO
      ====================================== */}

      <p
        className={
          styles.description
        }
      >
        {
          slide.description
        }
      </p>
    </motion.article>
  );
}

/* ==========================================================
   MAIN
========================================================== */

export default function ZagariManifesto() {
  const sectionRef =
    useRef<HTMLElement | null>(
      null
    );

  const frameRef =
    useRef<number | null>(
      null
    );

  const progress =
    useMotionValue(0);

  const [
    pinMode,
    setPinMode,
  ] =
    useState<PinMode>(
      "before"
    );

  const [
    mounted,
    setMounted,
  ] =
    useState(false);

  /* ========================================================
     MOUNT
  ======================================================== */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ========================================================
     SCROLL
  ======================================================== */

  useEffect(() => {
    const update =
      () => {
        const section =
          sectionRef.current;

        if (!section) {
          return;
        }

        const rect =
          section.getBoundingClientRect();

        const viewportHeight =
          window.innerHeight;

        const scrollDistance =
          Math.max(
            section.offsetHeight -
              viewportHeight,
            1
          );

        /* =====================================
           ANTES
        ====================================== */

        if (rect.top > 0) {
          progress.set(0);

          setPinMode(
            (current) =>
              current ===
              "before"
                ? current
                : "before"
          );

          return;
        }

        /* =====================================
           DESPUÉS
        ====================================== */

        if (
          rect.bottom <=
          viewportHeight
        ) {
          progress.set(1);

          setPinMode(
            (current) =>
              current ===
              "after"
                ? current
                : "after"
          );

          return;
        }

        /* =====================================
           FIXED
        ====================================== */

        setPinMode(
          (current) =>
            current ===
            "fixed"
              ? current
              : "fixed"
        );

        const travelled =
          Math.min(
            Math.max(
              -rect.top,
              0
            ),

            scrollDistance
          );

        const value =
          travelled /
          scrollDistance;

        progress.set(
          value
        );
      };

    const requestUpdate =
      () => {
        if (
          frameRef.current !==
          null
        ) {
          cancelAnimationFrame(
            frameRef.current
          );
        }

        frameRef.current =
          requestAnimationFrame(
            update
          );
      };

    update();

    window.addEventListener(
      "scroll",
      requestUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      requestUpdate
    );

    window.addEventListener(
      "orientationchange",
      requestUpdate
    );

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }

      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      window.removeEventListener(
        "resize",
        requestUpdate
      );

      window.removeEventListener(
        "orientationchange",
        requestUpdate
      );
    };
  }, [progress]);

  /* ========================================================
     FONDO CONTINUO
     IMPORTANTE:
     YA NO EXISTEN 5 CAPAS QUE PUEDAN QUEDAR EN OPACITY 0.
  ======================================================== */

  const backgroundColor =
    useTransform(
      progress,

      [
        0,
        0.18,
        0.25,
        0.38,
        0.45,
        0.58,
        0.65,
        0.78,
        0.85,
        1,
      ],

      [
        "#D3207F",
        "#D3207F",

        "#EF762C",
        "#EF762C",

        "#F4C63D",
        "#F4C63D",

        "#17A857",
        "#17A857",

        "#1297A6",
        "#176B8E",
      ],

      {
        clamp: true,
      }
    );

  /* ========================================================
     COLOR DEL GLOW
  ======================================================== */

  const glowColor =
    useTransform(
      progress,

      [
        0,
        0.25,
        0.45,
        0.65,
        0.85,
        1,
      ],

      [
        "rgba(255,190,225,.52)",

        "rgba(255,218,178,.52)",

        "rgba(255,247,186,.58)",

        "rgba(184,245,198,.45)",

        "rgba(98,224,216,.38)",

        "rgba(82,167,222,.40)",
      ],

      {
        clamp: true,
      }
    );

  /* ========================================================
     ORB
  ======================================================== */

  const orbX =
    useTransform(
      progress,

      [
        0,
        1,
      ],

      [
        "-12vw",
        "12vw",
      ]
    );

  const orbY =
    useTransform(
      progress,

      [
        0,
        0.5,
        1,
      ],

      [
        "-5vh",
        "6vh",
        "-2vh",
      ]
    );

  const orbRotate =
    useTransform(
      progress,

      [
        0,
        1,
      ],

      [
        -8,
        14,
      ]
    );

  /* ========================================================
     GRID
  ======================================================== */

  const gridRotate =
    useTransform(
      progress,

      [
        0,
        1,
      ],

      [
        -8,
        4,
      ]
    );

  /* ========================================================
     VISUAL
  ======================================================== */

  const visual = (
    <motion.div
      className={`${styles.visual} ${
        pinMode ===
        "fixed"
          ? styles.visualFixed
          : pinMode ===
              "after"
            ? styles.visualAfter
            : styles.visualBefore
      }`}
      style={{
        backgroundColor,
      }}
    >
      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div
        className={
          styles.background
        }
        aria-hidden="true"
      >
        {/* -----------------------------------
            GLOW
        ------------------------------------ */}

        <motion.div
          className={
            styles.glow
          }
          style={{
            backgroundColor:
              glowColor,

            x:
              orbX,

            y:
              orbY,
          }}
        />

        {/* -----------------------------------
            FORMA ORGÁNICA
        ------------------------------------ */}

        <motion.div
          className={
            styles.orb
          }
          style={{
            x:
              orbX,

            y:
              orbY,

            rotate:
              orbRotate,
          }}
        />

        {/* -----------------------------------
            GRID
        ------------------------------------ */}

        <motion.div
          className={
            styles.grid
          }
          style={{
            rotate:
              gridRotate,
          }}
        />

        {/* -----------------------------------
            LUCES
        ------------------------------------ */}

        <div
          className={
            styles.lightOne
          }
        />

        <div
          className={
            styles.lightTwo
          }
        />

        {/* -----------------------------------
            NOISE
        ------------------------------------ */}

        <div
          className={
            styles.noise
          }
        />

        {/* -----------------------------------
            VIGNETTE
        ------------------------------------ */}

        <div
          className={
            styles.vignette
          }
        />
      </div>

      {/* =====================================
          SCENES
      ====================================== */}

      <div
        className={
          styles.stage
        }
      >
        {slides.map(
          (
            slide,
            index
          ) => (
            <ManifestoSlide
              key={
                slide.word
              }
              slide={
                slide
              }
              index={
                index
              }
              progress={
                progress
              }
            />
          )
        )}
      </div>

      {/* =====================================
          SCROLL
      ====================================== */}

      <div
        className={
          styles.scrollIndicator
        }
        aria-hidden="true"
      >
        <span
          className={
            styles.scrollLine
          }
        >
          <i />
        </span>

        <small>
          SCROLL
        </small>
      </div>
    </motion.div>
  );

  return (
    <section
    id="manifesto"
      ref={
        sectionRef
      }
      className={
        styles.section
      }
      aria-label="Descubre conecta disfruta vive Zagari"
    >
      {mounted &&
      pinMode ===
        "fixed"
        ? createPortal(
            visual,
            document.body
          )
        : visual}
    </section>
  );
}