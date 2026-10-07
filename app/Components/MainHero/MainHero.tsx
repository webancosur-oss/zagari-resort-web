import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "reicon-react";

import HeroVideo from "./HeroVideo";

import styles from "./MainHero.module.css";

interface MainHeroButton {
  label: string;
  href: string;
}

interface MainHeroProps {
  title?: React.ReactNode;
  description?: string;

  backgroundImage?: string;

  video?: string;

  imageAlt?: string;

  imagePosition?: string;

  button?: MainHeroButton;

  eyebrow?: string;

  position?: "right" | "left" | "center";

  imageAspectRatio?: "native" | "3/2" | "16/9";

  preload?: boolean;
}

const RATIO_CLASS = {
  native: "ratioNative",
  "3/2": "ratio32",
  "16/9": "ratio169",
} as const;

export default function MainHero({
  title,
  description,
  backgroundImage,
  video,
  imageAlt = "",
  imagePosition = "center",
  button,
  eyebrow,
  position = "right",
  imageAspectRatio = "native",
  preload = true,
}: MainHeroProps) {
  return (
    <section
      className={`${styles.hero} ${styles[position]} ${
        styles[RATIO_CLASS[imageAspectRatio]]
      }`}
      style={
        {
          "--hero-image-position": imagePosition,
        } as React.CSSProperties
      }
    >

      <div className={styles.media}>
        {/* La imagen se mantiene con video: es la que pinta el LCP. */}
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt={imageAlt}
            fill
            preload={preload}
            sizes="100vw"
            className={styles.heroImage}
          />
        )}

        {video && (
          <HeroVideo
            src={video}
            position={imagePosition}
          />
        )}

        <div
          className={styles.imageOverlay}
          aria-hidden="true"
        />
      </div>

      {(eyebrow || title || description || button) && (
        <div className={styles.contentWrapper}>
          <div className={styles.content}>

            {eyebrow && (
              <span className={styles.eyebrow}>
                {eyebrow}
              </span>
            )}

            <h1 className={styles.title}>
              {title}
            </h1>

            {description && (
              <p className={styles.description}>
                {description}
              </p>
            )}

            {button && (
              <Link
                href={button.href}
                className={styles.button}
              >
                <span>{button.label}</span>

                <ArrowRight
                  size={20}
                  className={styles.arrow}
                  aria-hidden="true"
                />
              </Link>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
