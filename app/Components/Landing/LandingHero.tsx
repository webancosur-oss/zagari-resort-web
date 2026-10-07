"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "reicon-react";

import { CLUB } from "./landing.data";

import styles from "./LandingHero.module.css";

const VIDEO = "/assets/video/hero-tiger.mp4";
// Primer fotograma del video: lo que pinta primero es idéntico al arranque.
const POSTER = "/assets/images/heroes/hero-tiger-poster.jpg";

type Conexion = Navigator & { connection?: { saveData?: boolean } };

interface LandingHeroProps {
  lugar?: string;
  parrafo?: string;
  primario?: { label: string; href: string };
}

/** Hero del video del jaguar. Hoy es la cabecera de Experiencias. */
export default function LandingHero({
  lugar = "San Ramón · Selva Central",
  parrafo = "Vive diferente en San Ramón. Un club privado de naturaleza, descanso y experiencias.",
  primario = { label: "Hazte socio", href: "/membresias" },
}: LandingHeroProps) {
  const seccionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausaManual = useRef(false);
  const [enMarcha, setEnMarcha] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seccion = seccionRef.current;
    const video = videoRef.current;
    if (!seccion || !video) return;

    const reproducir = () => {
      video.preload = "auto";
      video.play().catch(() => undefined);
    };

    const alReproducir = () => setEnMarcha(true);
    const alPausar = () => setEnMarcha(false);
    // Hasta que hay imagen en pantalla se ve el póster: sin destello negro.
    const alMostrar = () => setVisible(true);

    video.addEventListener("play", alReproducir);
    video.addEventListener("pause", alPausar);
    video.addEventListener("playing", alMostrar);

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ahorroDatos = (navigator as Conexion).connection?.saveData === true;

    // Fuera de pantalla no tiene sentido seguir decodificando.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (pausaManual.current) return;
        if (entrada.isIntersecting) reproducir();
        else video.pause();
      },
      { threshold: 0.15 }
    );

    if (sinMovimiento || ahorroDatos) {
      pausaManual.current = true;
    } else {
      observador.observe(seccion);
    }

    return () => {
      observador.disconnect();
      video.removeEventListener("play", alReproducir);
      video.removeEventListener("pause", alPausar);
      video.removeEventListener("playing", alMostrar);
    };
  }, []);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausaManual.current = false;
      video.preload = "auto";
      video.play().catch(() => undefined);
    } else {
      pausaManual.current = true;
      video.pause();
    }
  };

  return (
    <section ref={seccionRef} className={styles.section}>
      <div className={styles.tarjeta}>
        <div className={styles.media}>
          <Image
            src={POSTER}
            alt="Escultura del jaguar sobre la roca junto al monolito de Zagari Resort Club, al atardecer"
            fill
            preload
            sizes="(min-width: 1240px) 1240px, 100vw"
            className={styles.imagen}
          />

          <video
            ref={videoRef}
            className={`${styles.video} ${visible ? styles.videoVisible : ""}`}
            src={VIDEO}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <span className={styles.velo} aria-hidden="true" />

        <h1 className={`display ${styles.titulo} ${styles.fadeRise}`}>
          Más cerca de <span className={styles.salto}>lo natural</span>
        </h1>

        <button
          type="button"
          className={styles.control}
          onClick={alternar}
          aria-label={enMarcha ? "Pausar el video" : "Reproducir el video"}
        >
          {enMarcha ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>

        <div className={`${styles.lateral} ${styles.fadeRiseDelay}`}>
          <p className={styles.lugar}>{lugar}</p>
          <p className={styles.parrafo}>{parrafo}</p>

          <div className={styles.acciones}>
            <Link href={primario.href} className={styles.primario}>
              {primario.label}
            </Link>

            <a
              href={CLUB.whatsapp}
              className={styles.secundario}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
