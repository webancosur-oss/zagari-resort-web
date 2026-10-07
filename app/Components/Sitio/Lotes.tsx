import Image from "next/image";
import { Award, CardTick, Crown, DiscountShape, Leaf, TickCircle, Ticket } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import Cabecera from "../Comercial/Cabecera";
import { AVISO_IMAGENES, LOTES } from "../../lib/contenido";
import PlanoLotes from "./PlanoLotes";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./Lotes.module.css";

const AL_SER_PROPIETARIO = [
  { icono: Crown, titulo: "Membresía Oro", texto: "Automática al firmar: recibes tu tarjeta con el lote, el primer año sin costo." },
  { icono: DiscountShape, titulo: "30 % de descuento permanente", texto: "Desde el segundo año renuevas tu membresía Oro con descuento, siempre." },
  { icono: Award, titulo: "Socio Fundador", texto: "Una distinción permanente que no se pierde aunque tu categoría cambie." },
  { icono: Ticket, titulo: "Acceso al Resort Club", texto: "Más de 20 amenidades: piscina infinita, mirador, canchas, gimnasio, spa y más." },
  { icono: Leaf, titulo: "Biohuerto", texto: "Acceso al biohuerto más grande de San Ramón para sembrar y cosechar." },
  { icono: CardTick, titulo: "Descuentos adentro", texto: "Además, 30 % de descuento en productos seleccionados del club." },
];

/** Al ser propietario: lo que recibe quien compra su lote. */
export function Propietario() {
  return (
    <Reveal as="section" id="propietario" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.dorado}>
          <Cabecera
            etiqueta="Al ser propietario"
            titulo={
              <>
                Compra tu lote y <em>obtén acceso al Resort Club</em>
              </>
            }
            intro="Ser propietario en Zagari no es solo tener un terreno: es entrar al club desde el primer día."
          />
          <ul className={`${sitio.rejilla} ${sitio.tres}`}>
            {AL_SER_PROPIETARIO.map(({ icono: Icono, titulo, texto }) => (
              <li key={titulo} className={styles.beneficio} data-reveal data-entrada="sube">
                <span className={styles.icono}>
                  <Icono size={22} aria-hidden="true" />
                </span>
                <h3 className={sitio.titulo}>{titulo}</h3>
                <p className={sitio.texto}>{texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

/** Datos de la II etapa, el plan maestro y el plano interactivo. */
export function PlanMaestro() {
  return (
    <Reveal as="section" id="plano" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.plan}>
          <div className={styles.planTexto}>
            <Cabecera
              etiqueta={LOTES.etapa}
              titulo={
                <>
                  Tu espacio en <em>Zagari</em>
                </>
              }
              intro={LOTES.resumen}
            />

            <p className={styles.area} data-reveal data-entrada="sube">
              <span>Lotes desde</span>
              <strong className="display">{LOTES.area.desde}</strong>
              <span>hasta</span>
              <strong className="display">{LOTES.area.hasta}</strong>
              <span>m²</span>
            </p>

            <ul className={sitio.lista} data-reveal data-entrada="sube">
              {LOTES.zonas.map((z) => (
                <li key={z}>
                  <TickCircle size={18} aria-hidden="true" />
                  {z}
                </li>
              ))}
            </ul>

            <div className={styles.plano} data-reveal data-entrada="sube">
              <PlanoLotes />
            </div>
          </div>

          <figure className={styles.planImagen} data-reveal data-entrada="sube">
            <Image
              src="/assets/images/lotes/plan-maestro.webp"
              alt="Plan maestro de Zagari: el Resort Club arriba a la derecha, las etapas de lotes en el centro y el biohuerto a la izquierda"
              width={765}
              height={749}
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <figcaption className={sitio.referencial}>{AVISO_IMAGENES}</figcaption>
          </figure>
        </div>

        <ul className={`${sitio.rejilla} ${sitio.tres} ${styles.ventajas}`}>
          {LOTES.ventajas.map((v) => (
            <li key={v.titulo} className={`${sitio.tarjeta} ${sitio.cuerpo}`} data-reveal data-entrada="sube">
              <h3 className={sitio.titulo}>{v.titulo}</h3>
              <p className={sitio.texto}>{v.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/** Modelos de cabaña lodge para construir y alquilar. */
export function Modelos() {
  return (
    <Reveal as="section" id="cabanas-lodge" className={`${comun.seccion} ${comun.bosque}`}>
      <div className={comun.inner}>
        <div className={styles.modelos}>
          <div className={styles.lodge} data-reveal data-entrada="sube">
            <Image
              src="/assets/images/lotes/cabana-lodge.webp"
              alt="Cabaña tipo lodge de dos pisos entre la vegetación de la Selva Central"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </div>

          <div>
            <Cabecera
              etiqueta="Vacaciona, construye y gana"
              titulo={
                <>
                  Una cabaña tipo lodge — <em>para tus vacaciones soñadas</em>
                </>
              }
              intro={LOTES.alquiler}
            />
            <ul className={`${sitio.rejilla} ${sitio.tres}`}>
              {LOTES.modelos.map((m) => (
                <li key={m.nombre} className={styles.modelo} data-reveal data-entrada="sube">
                  <div className={styles.modeloFoto}>
                    <Image src={m.foto.src} alt={m.foto.alt} fill sizes="(min-width: 1024px) 18vw, (min-width: 640px) 33vw, 100vw" />
                  </div>
                  <p>{m.nombre}</p>
                </li>
              ))}
            </ul>
            <p className={styles.nota}>{AVISO_IMAGENES}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
