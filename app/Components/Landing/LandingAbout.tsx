"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Pause, Play } from "reicon-react";

import Reveal from "../Reveal/Reveal";

import styles from "./LandingAbout.module.css";

const DATOS = [
  { valor: "4", sufijo: "elementos", texto: "Agua, aire, fuego y tierra" },
  { valor: "17", sufijo: "espacios", texto: "Amenidades del club" },
  { valor: "8.7", sufijo: "km", texto: "Desde San Ramón" },
];

export default function LandingAbout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activo, setActivo] = useState(false);

  const alternar = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().catch(() => undefined);
      setActivo(true);
    } else {
      v.pause();
      setActivo(false);
    }
  };

  return (
    <Reveal as="section" className={styles.section} id="club">
      <div className={styles.inner}>

        <div className={styles.izquierda}>
          <h2 className={styles.titulo}>
            Encuentra tu calma donde{" "}
            <span className={styles.suave}>la montaña</span>{" "}
            se abre al valle.
          </h2>

          <a href="#experiencias" className={styles.cta}>
            Conocer más
          </a>

          <dl className={styles.datos}>
            {DATOS.map((d) => (
              <div key={d.sufijo} className={styles.dato}>
                <dt className={styles.datoValor}>
                  {d.valor}
                  <span className={styles.datoSufijo}>
                    {d.sufijo}
                  </span>
                </dt>
                <dd className={styles.datoTexto}>{d.texto}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.tarjeta}>
          <p className={styles.tarjetaTitulo}>
            Mira el club en vídeo
          </p>

          <button
            type="button"
            className={styles.marco}
            onClick={alternar}
            aria-pressed={activo}
            aria-label={
              activo ? "Pausar vídeo" : "Reproducir vídeo"
            }
          >
            <Image
              src="/assets/images/cabagnas/piscina-sunshine.jpeg"
              alt=""
              fill
              sizes="(min-width: 900px) 260px, 60vw"
              className={styles.poster}
            />

            <video
              ref={videoRef}
              className={`${styles.video} ${
                activo ? styles.videoActivo : ""
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source
                src="/assets/video/herovideo-main.mp4"
                type="video/mp4"
              />
            </video>

            <span className={styles.play}>
              {activo ? (
                <Pause size={16} weight="Filled" aria-hidden="true" />
              ) : (
                <Play size={16} weight="Filled" aria-hidden="true" />
              )}
            </span>
          </button>

          <a href="#reserva" className={styles.tarjetaCta}>
            Quiero visitarlo
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>

      </div>
    </Reveal>
  );
}
