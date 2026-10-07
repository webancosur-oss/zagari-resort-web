"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Gallery } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { CERCANOS } from "../../lib/contenido";
import { useSnapCarousel } from "../../lib/useSnapCarousel";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./Cercanos.module.css";

const CREDITOS = CERCANOS.flatMap((c) => (c.credito ? [{ lugar: c.nombre, ...c.credito }] : []));

interface CercanosProps {
  id?: string;
  etiqueta?: string;
}

/** Destinos recomendados cerca del club, en carrusel. */
export default function Cercanos({ id = "cercanos", etiqueta = "Destinos recomendados" }: CercanosProps) {
  const { trackRef, atStart, atEnd, next, prev } = useSnapCarousel(CERCANOS.length);

  return (
    <Reveal as="section" id={id} className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.cabecera}>
          <Cabecera
            etiqueta={etiqueta}
            titulo={
              <>
                Cerca de Zagari — <em>para completar tu viaje</em>
              </>
            }
            intro="Cataratas, miradores y lugares emblemáticos de San Ramón y Chanchamayo, a pocos minutos del club."
          />
          <div className={sitio.flechas}>
            <button type="button" className={sitio.flecha} onClick={prev} disabled={atStart} aria-label="Anterior">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className={sitio.flecha} onClick={next} disabled={atEnd} aria-label="Siguiente">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div ref={trackRef} className={sitio.carrusel} role="list" data-reveal data-entrada="sube">
          {CERCANOS.map((c) => (
            <article key={c.nombre} className={sitio.tarjeta} role="listitem">
              <div className={`${sitio.foto} ${c.foto ? "" : sitio.sinFoto}`}>
                {c.foto ? (
                  <Image src={c.foto.src} alt={c.foto.alt} fill sizes="(min-width: 1400px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 82vw" />
                ) : (
                  <Gallery size={44} aria-hidden="true" />
                )}
              </div>
              <div className={sitio.cuerpo}>
                <p className={sitio.etiqueta}>{c.distancia}</p>
                <h3 className={sitio.titulo}>{c.nombre}</h3>
                <p className={sitio.texto}>{c.texto}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Las licencias CC piden el crédito: va plegado, no sobre las fotos. */}
        <details className={styles.creditos}>
          <summary>Créditos de las fotos</summary>
          <p>
            Vía Wikimedia Commons:{" "}
            {CREDITOS.map((c, i) => (
              <span key={c.fuente}>
                {i > 0 && " · "}
                <a href={c.fuente} target="_blank" rel="noopener noreferrer">
                  {c.lugar}, {c.autor} ({c.licencia})
                </a>
              </span>
            ))}
            .
          </p>
        </details>
      </div>
    </Reveal>
  );
}
