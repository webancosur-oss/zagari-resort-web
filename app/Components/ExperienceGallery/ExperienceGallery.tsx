"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "reicon-react";

import Reveal from "../Reveal/Reveal";

import type { GalleryItem } from "./experienceGallery.data";

import styles from "./ExperienceGallery.module.css";

interface ExperienceGalleryProps {
  items: GalleryItem[];

  label?: string;
}

const SWIPE_THRESHOLD = 50;

export default function ExperienceGallery({
  items,
  label = "Galería de experiencias exclusivas",
}: ExperienceGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [index, setIndex] = useState<number | null>(null);

  const count = items.length;

  // <dialog> nativo: aporta foco atrapado, Escape y devolver el foco.
  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const go = useCallback(
    (delta: number) =>
      setIndex((current) =>
        current === null
          ? null
          : (current + delta + count) % count
      ),
    [count]
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const onClose = () => setIndex(null);

    dialog.addEventListener("close", onClose);

    return () =>
      dialog.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    if (index === null) return;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [index]);

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDialogElement>
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  const onTouchStart = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (
    event: React.TouchEvent<HTMLElement>
  ) => {
    const start = touchStartX.current;

    if (start === null) return;

    const delta =
      (event.changedTouches[0]?.clientX ?? start) - start;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }

    touchStartX.current = null;
  };

  if (count === 0) return null;

  const active = index === null ? null : items[index];

  return (
    <section className={styles.section} aria-label={label}>
      <div className={styles.grid}>
        {items.map((item, i) => (
          <Reveal
            key={item.image}
            as="article"
            className={styles.card}
            delay={(i % 3) * 0.09}
            duration={0.85}
            distance={24}
          >
            <button
              type="button"
              className={styles.media}
              onClick={() => open(i)}
              aria-label={`Ampliar imagen: ${item.title}`}
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 1100px) 32vw, (min-width: 700px) 46vw, 92vw"
                className={styles.image}
              />

              <span
                className={styles.zoomHint}
                aria-hidden="true"
              />
            </button>

            <div className={styles.body}>
              <h3 className={styles.title}>
                {item.title}
              </h3>

              <p className={styles.description}>
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="Visor de imágenes"
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {active && (
          <div
            className={styles.viewer}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button
              type="button"
              className={`${styles.viewerNav} ${styles.viewerClose}`}
              onClick={close}
              aria-label="Cerrar visor"
            >
              <X size={22} aria-hidden="true" />
            </button>

            <div className={styles.viewerStage}>
              <Image
                key={active.image}
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(min-width: 900px) 80vw, 100vw"
                className={styles.viewerImage}
              />
            </div>

            <figcaption className={styles.viewerCaption}>
              <span className={styles.viewerTitle}>
                {active.title}
              </span>

              <span className={styles.viewerCount}>
                {(index ?? 0) + 1} / {count}
              </span>
            </figcaption>

            {count > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.viewerNav} ${styles.viewerPrev}`}
                  onClick={() => go(-1)}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={`${styles.viewerNav} ${styles.viewerNext}`}
                  onClick={() => go(1)}
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
