import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { whatsapp } from "../../lib/contenido";

import comun from "../Comercial/comercial.module.css";
import styles from "./LlamadoFinal.module.css";

interface LlamadoFinalProps {
  titulo?: string;
  texto?: string;
  mensaje?: string;
  imagen?: { src: string; alt: string };
}

/** Cierre de página: WhatsApp o formulario. */
export default function LlamadoFinal({
  titulo = "¿Listo para vivir Zagari?",
  texto = "Escríbenos y un asesor te ayuda a elegir tu membresía, reservar tu cabaña o planear tu visita.",
  mensaje = "Hola Zagari Resort Club, quisiera recibir más información.",
  imagen = { src: "/assets/images/heroes/portico_familia.webp", alt: "Familia llegando al pórtico de Zagari Resort Club" },
}: LlamadoFinalProps) {
  return (
    <Reveal as="section" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.banda}>
          <Image src={imagen.src} alt={imagen.alt} fill sizes="100vw" className={styles.imagen} />
          <span className={styles.velo} aria-hidden="true" />
          <div className={styles.texto} data-reveal data-entrada="sube">
            <h2 className={`display ${styles.titulo}`}>{titulo}</h2>
            <p className={styles.parrafo}>{texto}</p>
            <div className={styles.acciones}>
              <a href={whatsapp(mensaje)} className={styles.primario} target="_blank" rel="noopener noreferrer">
                Escríbenos por WhatsApp
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <Link href="/contacto" className={styles.secundario}>
                Prefiero que me llamen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
