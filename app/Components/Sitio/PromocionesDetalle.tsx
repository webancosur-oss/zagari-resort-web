import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Crown, Home, InfoCircle, StarFall, TickCircle } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { CAPITULOS, CONDICIONES_PROMOCIONES } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import styles from "./PromocionesDetalle.module.css";

const ICONOS = { propietario: Home, puntos: StarFall, exclusivos: Crown } as const;

/** Las promociones en tres capítulos: propietario, puntos y accesos exclusivos. */
export default function PromocionesDetalle() {
  return (
    <>
      <nav className={styles.indice} aria-label="Promociones">
        <ul>
          {CAPITULOS.map((c) => {
            const Icono = ICONOS[c.id];
            return (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  <Icono size={18} aria-hidden="true" />
                  {c.titulo}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {CAPITULOS.map((c, i) => {
        const Icono = ICONOS[c.id];
        return (
          <Reveal
            key={c.id}
            as="section"
            id={c.id}
            className={`${comun.seccion} ${styles.capitulo} ${i % 2 ? styles.alterno : ""}`}
            aria-labelledby={`titulo-${c.id}`}
          >
            <div className={`${comun.inner} ${styles.disposicion}`}>
              <div className={styles.fotos} data-reveal data-entrada="sube">
                <div className={styles.fotoGrande}>
                  <Image src={c.fotos[0].src} alt={c.fotos[0].alt} fill sizes="(min-width: 1024px) 45vw, 100vw" />
                </div>
                <div className={styles.fotoChica}>
                  <Image src={c.fotos[1].src} alt={c.fotos[1].alt} fill sizes="(min-width: 1024px) 20vw, 45vw" />
                </div>
                <span className={styles.sello} aria-hidden="true">
                  <Icono size={28} />
                </span>
              </div>

              <div className={styles.texto}>
                <h2 id={`titulo-${c.id}`} className={`display ${styles.titulo}`} data-reveal data-entrada="sube">
                  {c.titulo} — <em>{c.remate}</em>
                </h2>
                <p className={styles.parrafo} data-reveal data-entrada="sube">
                  {c.texto}
                </p>

                {c.grupos.map((g) => (
                  <div key={g.titulo} className={styles.grupo} data-reveal data-entrada="sube">
                    <h3 className={styles.grupoTitulo}>{g.titulo}</h3>
                    <ul className={styles.lista}>
                      {g.items.map((item) => (
                        <li key={item}>
                          <TickCircle size={18} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className={styles.acciones} data-reveal data-entrada="sube">
                  {c.acciones.map((a, j) =>
                    a.externo ? (
                      <a
                        key={a.label}
                        href={a.href}
                        className={j === 0 ? comun.boton : styles.secundario}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {a.label}
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </a>
                    ) : (
                      <Link key={a.label} href={a.href} className={j === 0 ? comun.boton : styles.secundario}>
                        {a.label}
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}

      <div className={comun.inner}>
        <ul className={styles.condiciones}>
          {CONDICIONES_PROMOCIONES.map((c) => (
            <li key={c}>
              <InfoCircle size={16} aria-hidden="true" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
