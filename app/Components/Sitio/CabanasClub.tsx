"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Bed, Building, Gallery, Maximize, Ruler } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { AVISO_IMAGENES, CABANAS, TIPOS_CABANA, whatsapp } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./CabanasClub.module.css";

/** Tipos de cabaña del club en pestañas: fotos, plano y ambientes. */
export default function CabanasClub() {
  const base = useId();
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);
  const [activa, setActiva] = useState(0);
  const [foto, setFoto] = useState(0);
  const [verPlano, setVerPlano] = useState(false);
  const tipo = TIPOS_CABANA[activa];
  const imagen = verPlano ? tipo.plano : tipo.fotos[foto];

  const elegir = (i: number) => {
    setActiva(i);
    setFoto(0);
    setVerPlano(false);
    // En móvil las pestañas se desplazan: la elegida queda a la vista.
    pestanas.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    const paso = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const siguiente = (activa + paso + TIPOS_CABANA.length) % TIPOS_CABANA.length;
    elegir(siguiente);
    pestanas.current[siguiente]?.focus({ preventScroll: true });
  };

  return (
    <Reveal as="section" id="cabanas" className={comun.seccion}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Cabañas del club"
          titulo={
            <>
              Quédate una noche más — <em>elige tu cabaña</em>
            </>
          }
          intro={CABANAS.texto}
        />

        <div
          className={`${sitio.pestanas} ${styles.pestanas}`}
          role="tablist"
          aria-label="Tipos de cabaña"
          onKeyDown={alTeclear}
          data-reveal
          data-entrada="sube"
        >
          {TIPOS_CABANA.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                pestanas.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-${t.id}`}
              aria-selected={i === activa}
              aria-controls={`${base}-panel`}
              tabIndex={i === activa ? 0 : -1}
              className={sitio.pestana}
              onClick={() => elegir(i)}
            >
              {t.nombre}
            </button>
          ))}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-${tipo.id}`}
          className={styles.panel}
          data-reveal
          data-entrada="sube"
        >
          <div className={styles.visor}>
            <div
              className={`${styles.principal} ${verPlano ? styles.plano : ""}`}
              // El plano manda su propia proporción: los de dos pisos son altos.
              style={verPlano ? { aspectRatio: `${tipo.plano.ancho} / ${tipo.plano.alto}` } : undefined}
            >
              <Image
                key={imagen.src}
                src={imagen.src}
                alt={imagen.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={styles.imagen}
              />
            </div>

            <div className={styles.miniaturas}>
              {tipo.fotos.map((f, i) => (
                <button
                  key={f.src}
                  type="button"
                  className={styles.miniatura}
                  aria-pressed={!verPlano && foto === i}
                  aria-label={`Ver foto ${i + 1} de ${tipo.nombre}`}
                  onClick={() => {
                    setFoto(i);
                    setVerPlano(false);
                  }}
                >
                  <Image src={f.src} alt="" fill sizes="120px" />
                </button>
              ))}
              <button
                type="button"
                className={`${styles.miniatura} ${styles.miniaturaPlano}`}
                aria-pressed={verPlano}
                onClick={() => setVerPlano(true)}
              >
                <Maximize size={18} aria-hidden="true" />
                Plano
              </button>
            </div>
          </div>

          <div className={styles.ficha}>
            <h3 className={`display ${styles.nombre}`}>{tipo.nombre}</h3>
            <p className={sitio.texto}>{tipo.resumen}</p>

            <dl className={styles.datos}>
              <div>
                <dt>
                  <Ruler size={18} aria-hidden="true" /> Área
                </dt>
                <dd>{tipo.area} m²</dd>
              </div>
              <div>
                <dt>
                  <Building size={18} aria-hidden="true" /> Pisos
                </dt>
                <dd>{tipo.pisos}</dd>
              </div>
              <div>
                <dt>
                  <Bed size={18} aria-hidden="true" /> Habitaciones
                </dt>
                <dd>{tipo.habitaciones}</dd>
              </div>
            </dl>

            {tipo.ambientes.map((a) => (
              <div key={a.piso ?? "unico"} className={styles.ambientes}>
                <p className={sitio.etiqueta}>{a.piso ?? "Ambientes"}</p>
                <ul className={sitio.chips}>
                  {a.lista.map((x) => (
                    <li key={x} className={sitio.chip}>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={sitio.acciones}>
              <a
                href={whatsapp(`Hola Zagari Resort Club, quiero reservar la ${tipo.nombre}. ¿Qué fechas tienen disponibles?`)}
                className={comun.boton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reservar {tipo.nombre}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              {verPlano ? (
                <button type="button" className={sitio.botonClaro} onClick={() => setVerPlano(false)}>
                  <Gallery size={18} aria-hidden="true" />
                  Ver fotos
                </button>
              ) : (
                <button type="button" className={sitio.botonClaro} onClick={() => setVerPlano(true)}>
                  <Maximize size={18} aria-hidden="true" />
                  Ver plano
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.descuentos} data-reveal data-entrada="sube">
          <p className={sitio.etiqueta}>
            <Bed size={16} aria-hidden="true" /> Descuento para socios en todas las cabañas
          </p>
          <ul className={styles.tabla}>
            {CABANAS.descuentos.map((d) => (
              <li key={d.categoria}>
                <span className={styles.categoria}>{d.categoria}</span>
                <span>{d.detalle}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={sitio.referencial}>
          {AVISO_IMAGENES} Áreas aproximadas según los planos de venta.
        </p>
      </div>
    </Reveal>
  );
}
