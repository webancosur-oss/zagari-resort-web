"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Pause, Play } from "reicon-react";

import Reveal from "../Reveal/Reveal";

import styles from "./HomeStatement.module.css";

export default function HomeStatement() {
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
    <Reveal as="section" className={styles.section}>
      <div className={styles.inner}>

        <div className={styles.texto}>
          <h2 className={styles.titulo}>
            Un club privado donde{" "}
            <span className={styles.suave}>
              la montaña y el río
            </span>{" "}
            marcan el ritmo.
          </h2>

          <p className={styles.lead}>
            Zagari Resort Club está en San Ramón,
            Chanchamayo. Piscinas, cabañas, senderos y
            espacios para compartir, pensados para volver
            cada fin de semana.
          </p>

          <Link href="/experiencias/exclusivas" className={styles.cta}>
            Conocer el club
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className={styles.media}>
          <div className={styles.videoCard}>
            <div className={styles.videoWrap}>
              <Image
                src="/assets/images/cabagnas/piscina-sunshine.jpeg"
                alt=""
                fill
                sizes="(min-width: 900px) 420px, 90vw"
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
                aria-label="Vídeo de la piscina de Zagari"
              >
                <source
                  src="/assets/video/herovideo-main.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <button
              type="button"
              className={styles.boton}
              onClick={alternar}
              aria-pressed={activo}
            >
              <span className={styles.botonIcono}>
                {activo ? (
                  <Pause size={15} weight="Filled" aria-hidden="true" />
                ) : (
                  <Play size={15} weight="Filled" aria-hidden="true" />
                )}
              </span>

              <span>
                {activo ? "Pausar vídeo" : "Ver el club en vídeo"}
              </span>
            </button>
          </div>
        </div>

      </div>
    </Reveal>
  );
}
