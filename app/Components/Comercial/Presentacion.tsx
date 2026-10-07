"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { desplazarA } from "../SmoothScroll/SmoothScroll";
import { VIDEO } from "../Landing/secciones.data";
import { ROUTE } from "../LocationRoute/route.data";
import { CATEGORIAS } from "../../lib/modelo";

import comun from "./comercial.module.css";
import styles from "./Presentacion.module.css";

// Fotograma de los 4,5 s del propio video: la miniatura muestra lo que se verá.
const POSTER = "/assets/images/heroes/recorrido-poster.jpg";

const CIFRAS = [
  { valor: String(CATEGORIAS.length), texto: "Categorías de socio" },
  { valor: "4", texto: "Elementos que ordenan el club" },
  { valor: `${ROUTE.distanceKm.toString().replace(".", ",")} km`, texto: "Desde San Ramón" },
];

export default function Presentacion() {
  const video = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  // El video se reproduce en la propia tarjeta y solo se descarga al pulsar.
  const reproducir = () => {
    const v = video.current;
    if (!v) return;
    setReproduciendo(true);
    v.play().catch(() => undefined);
    v.focus();
  };

  return (
    <Reveal as="section" id="club" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={`${comun.panel} ${styles.disposicion}`}>
          <div className={styles.texto}>
            <div>
              <h2 className={`display ${styles.frase}`} data-reveal data-entrada="sube">
                Naturaleza, descanso y experiencias — <em>una misma manera</em> de vivir.
              </h2>

              <p className={styles.parrafo} data-reveal data-entrada="sube">
                Un lugar que nace de su entorno: piscinas, cabañas, senderos y
                espacios para compartir en San Ramón, en plena Selva Central.
              </p>

              <a
                href="#membresias"
                className={comun.boton}
                data-reveal
                data-entrada="sube"
                onClick={(e) => {
                  if (desplazarA("#membresias")) e.preventDefault();
                }}
              >
                Ver membresías
              </a>
            </div>

            <dl className={styles.cifras} data-reveal data-entrada="sube">
              {CIFRAS.map((c) => (
                <div key={c.texto}>
                  <dt className={`display ${styles.valor}`}>{c.valor}</dt>
                  <dd className={styles.etiqueta}>{c.texto}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className={styles.reproductor} data-reveal data-entrada="sube">
            <video
              ref={video}
              className={styles.video}
              src={VIDEO.piscina}
              poster={POSTER}
              controls={reproduciendo}
              playsInline
              preload="none"
              // Enfocable por código: el botón de portada desaparece al pulsarlo.
              tabIndex={-1}
              aria-label="Recorrido en video por Zagari Resort Club"
            />

            {!reproduciendo && (
              <button
                type="button"
                className={styles.portada}
                onClick={reproducir}
                aria-label="Reproducir el recorrido por el club en video, 44 segundos"
              >
                <Image
                  src={POSTER}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className={styles.imagen}
                />
                <span className={styles.play} aria-hidden="true">
                  <Play size={26} />
                </span>
                <span className={styles.leyenda} aria-hidden="true">
                  <strong>Recorrido por el club</strong>
                  <span>0:44 · Imágenes referenciales del proyecto</span>
                </span>
              </button>
            )}
          </figure>
        </div>
      </div>
    </Reveal>
  );
}
