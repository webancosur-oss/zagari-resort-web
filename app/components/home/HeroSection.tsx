"use client";

import {
  ArrowRight,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";

import styles from "./HeroSection.module.css";

/*
  Este estado vive en memoria mientras la aplicación Next.js
  permanece abierta.

  - El video termina -> se muestra la imagen final.
  - Ir a otra ruta y volver -> permanece la imagen final.
  - Recargar completamente el navegador -> vuelve a iniciar el video.
*/
let heroCompletedInApp = false;

const FINAL_IMAGE_URL =
  "/assets/hero/hero-image.webp";


type TypingLineProps = {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
};

function TypingLine({
  text,
  className,
  startDelay = 0,
  speed = 42,
}: TypingLineProps) {
  return (
    <span className={`${styles.typingLine} ${className ?? ""}`}>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={styles.typingChar}
          style={
            {
              animationDelay: `${startDelay + index * speed}ms`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isCompleted, setIsCompleted] = useState(
    heroCompletedInApp,
  );

  const [isPlaying, setIsPlaying] = useState(
    !heroCompletedInApp,
  );

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (heroCompletedInApp) {
      setIsCompleted(true);
      setIsPlaying(false);
      return;
    }

    const video = videoRef.current;

    if (!video) return;

    video.currentTime = 0;

    const startVideo = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    void startVideo();
  }, []);

  const handleSkipVideo = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    handleVideoEnded();
  };

  const handleVideoEnded = () => {
    heroCompletedInApp = true;

    setIsCompleted(true);
    setIsPlaying(false);
  };

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video || isCompleted) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error(
        "No se pudo reproducir el video:",
        error,
      );
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video || isCompleted) return;

    const nextMuted = !video.muted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className={styles.hero}>
      {!isCompleted && (
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.video}
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/assets/images/zagari-hero-poster.webp"
            aria-hidden="true"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleVideoEnded}
            onVolumeChange={(event) => {
              setIsMuted(event.currentTarget.muted);
            }}
          >
            <source
              src="/assets/videos/zagari-hero.webp"
              type="video/webm"
            />

            <source
              src="/assets/hero/herovideo-main.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      )}

      <div
        className={`${styles.finalImage} ${
          isCompleted
            ? styles.finalImageVisible
            : ""
        }`}
        style={{
          backgroundImage:
            `url("${FINAL_IMAGE_URL}")`,
        }}
        aria-hidden={!isCompleted}
      />

      <div
        className={styles.overlay}
        aria-hidden="true"
      />

      <div
        className={styles.overlayBottom}
        aria-hidden="true"
      />

      <div
        className={styles.overlayTop}
        aria-hidden="true"
      />

      {!isCompleted && (
        <div
          className={styles.videoControls}
          aria-label="Controles del video"
        >
          <button
            type="button"
            className={styles.videoControl}
            onClick={togglePlayback}
            aria-label={
              isPlaying
                ? "Pausar video"
                : "Reproducir video"
            }
            title={
              isPlaying
                ? "Pausar video"
                : "Reproducir video"
            }
          >
            {isPlaying ? (
              <Pause
                size={17}
                weight="fill"
              />
            ) : (
              <Play
                size={17}
                weight="fill"
              />
            )}
          </button>

          <button
            type="button"
            className={styles.videoControl}
            onClick={toggleMute}
            aria-label={
              isMuted
                ? "Activar sonido"
                : "Silenciar video"
            }
            title={
              isMuted
                ? "Activar sonido"
                : "Silenciar video"
            }
          >
            {isMuted ? (
              <SpeakerSlash
                size={18}
                weight="regular"
              />
            ) : (
              <SpeakerHigh
                size={18}
                weight="regular"
              />
            )}
          </button>
        </div>
      )}

      {!isCompleted && (
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleSkipVideo}
          aria-label="Saltar video"
        >
          <span>Saltar video</span>
          <ArrowRight size={16} weight="regular" aria-hidden="true" />
        </button>
      )}

      {isCompleted && (
        <div className={styles.container}>
        <div
          className={`${styles.content} ${
            isCompleted
              ? styles.contentCompleted
              : ""
          }`}
        >
          <div className={styles.eyebrow}>
            <TypingLine
              text="RESORT CLUB PRIVADO"
              startDelay={120}
              speed={28}
            />
          </div>

          <h1 className={styles.title}>
            <TypingLine
              text="Tu lugar para"
              startDelay={520}
              speed={48}
            />

            <TypingLine
              text="escapar,"
              className={styles.titleAccent}
              startDelay={1120}
              speed={58}
            />

            <TypingLine
              text="disfrutar"
              startDelay={1660}
              speed={48}
            />

            <TypingLine
              text="y volver."
              className={styles.titleLast}
              startDelay={2180}
              speed={58}
            />
          </h1>

          <p className={styles.description}>
            <TypingLine
              text="Un club privado donde cada visita se convierte en una experiencia."
              startDelay={2740}
              speed={24}
            />
          </p>

          <div className={styles.actions}>
            <Link
              href="#membresias"
              className={`${styles.primaryButton} ${styles.animatedButton}`}
              style={
                {
                  "--button-delay": "4300ms",
                } as CSSProperties
              }
            >
              <span>
                Conoce las membresías
              </span>

              <span
                className={styles.buttonIcon}
                aria-hidden="true"
              >
                <ArrowRight
                  size={18}
                  weight="regular"
                />
              </span>
            </Link>

            <Link
              href="#experiencias"
              className={`${styles.secondaryButton} ${styles.animatedButton}`}
              style={
                {
                  "--button-delay": "4450ms",
                } as CSSProperties
              }
            >
              Descubre Zagari
            </Link>
          </div>
        </div>

        <button
          type="button"
          className={styles.scrollButton}
            onClick={() => {
              document
                .getElementById("experiencia")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            aria-label="Descubrir la experiencia Zagari"
          >
            <span>SCROLL</span>

            <span
              className={styles.scrollLine}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </section>
  );
}
