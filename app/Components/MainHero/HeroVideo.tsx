"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "reicon-react";

import styles from "./MainHero.module.css";

interface HeroVideoProps {
  src: string;

  position?: string;
}

export default function HeroVideo({
  src,
  position = "center",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    setPlaying(!video.paused);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;

    if (reduced || connection?.saveData) return;

    video.play().catch(() => {
    });
  }, []);

  const toggle = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        style={{ objectPosition: position }}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Vídeo de presentación de Zagari Resort Club"
      >
        <source src={src} type="video/mp4" />
      </video>

      <button
        type="button"
        className={styles.videoToggle}
        onClick={toggle}
        aria-label={
          playing ? "Pausar vídeo" : "Reproducir vídeo"
        }
        aria-pressed={playing}
      >
        {playing ? (
          <Pause size={18} weight="Filled" aria-hidden="true" />
        ) : (
          <Play size={18} weight="Filled" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
