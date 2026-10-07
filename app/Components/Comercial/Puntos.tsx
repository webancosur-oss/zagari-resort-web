"use client";

import { Calendar, CalendarTick, Profile2user, Scan, Wallet } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import CarouselArrow from "../ui/CarouselArrow/CarouselArrow";
import { useSnapCarousel } from "../../lib/useSnapCarousel";
import { PUNTOS } from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Puntos.module.css";

const ICONOS = [Scan, Calendar, Wallet, Profile2user, CalendarTick];

const dinero = (puntos: number) => `S/ ${(puntos * PUNTOS.valor).toFixed(2).replace(".", ",")}`;

export default function Puntos() {
  const { trackRef, atStart, atEnd, next, prev } = useSnapCarousel(PUNTOS.ganar.length);
  const subir = PUNTOS.movimientos.filter((m) => m.sube);

  return (
    <Reveal as="section" id="puntos" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.cabecera}>
          <Cabecera
            etiqueta="Puntos Zagari"
            titulo={
              <>
                Lo que <em>ganas</em> — en cada visita
              </>
            }
            intro={PUNTOS.resumen}
          />
          <div className={styles.flechas} data-reveal data-entrada="sube">
            <CarouselArrow direction="prev" onClick={prev} disabled={atStart} tone="plain" label="Anteriores" />
            <CarouselArrow direction="next" onClick={next} disabled={atEnd} tone="dark" label="Siguientes" />
          </div>
        </div>

        <div
          ref={trackRef}
          className={styles.pista}
          role="list"
          aria-label="Cómo se ganan los Puntos Zagari"
          data-reveal
          data-entrada="sube"
        >
          {PUNTOS.ganar.map((g, i) => {
            const Icono = ICONOS[i % ICONOS.length];
            return (
              <article key={g.accion} className={styles.tarjeta} role="listitem">
                <div className={styles.arriba}>
                  <span className={styles.icono} aria-hidden="true">
                    <Icono size={20} />
                  </span>
                  <span className={styles.insignia}>+{g.puntos} puntos</span>
                </div>
                <p className={`display ${styles.cifra}`} aria-hidden="true">
                  +{g.puntos}
                </p>
                <h3 className={styles.accion}>{g.accion}</h3>
                <p className={styles.equivale}>
                  Equivale a {dinero(g.puntos)} de saldo para usar dentro del club
                </p>
              </article>
            );
          })}
        </div>

        <ul className={styles.datos} data-reveal data-entrada="sube">
          <li>
            <strong>1 punto = S/ 0,10</strong>
            <span>100 puntos son S/ 10 de saldo</span>
          </li>
          {subir.map((m) => (
            <li key={`${m.de}-${m.a}`}>
              <strong>
                {m.de} → {m.a}
              </strong>
              <span>{m.requisito}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
