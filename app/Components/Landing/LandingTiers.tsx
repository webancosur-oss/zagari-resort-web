import { TickCircle } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { NIVELES } from "./landing.data";

import styles from "./LandingTiers.module.css";

export default function LandingTiers() {
  return (
    <section className={styles.section} id="membresias">
      <div className={styles.inner}>

        <header className={styles.cabecera}>
          <p className={styles.eyebrow}>Membresías</p>

          <h2 className={styles.titulo}>
            Elige tu{" "}
            <span className={styles.suave}>categoría</span>
          </h2>

          <p className={styles.lead}>
            Cada visita suma. Avanza de categoría y descubre
            nuevos privilegios dentro del club.
          </p>
        </header>

        <div className={styles.grid}>
          {NIVELES.map((n, i) => (
            <Reveal
              key={n.nombre}
              as="article"
              className={`${styles.card} ${styles[n.tono]} ${
                n.destacado ? styles.destacado : ""
              }`}
              delay={i * 0.09}
            >
              {n.destacado && (
                <span className={styles.insignia}>
                  La más elegida
                </span>
              )}

              <h3 className={styles.nombre}>{n.nombre}</h3>

              <p className={styles.resumen}>{n.resumen}</p>

              <ul className={styles.puntos}>
                {n.puntos.map((p) => (
                  <li key={p} className={styles.punto}>
                    <TickCircle
                      size={17}
                      weight="Filled"
                      aria-hidden="true"
                    />
                    {p}
                  </li>
                ))}
              </ul>

              <a href="#reserva" className={styles.cardCta}>
                Quiero ser {n.nombre}
              </a>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
