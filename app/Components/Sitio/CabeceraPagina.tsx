import Image from "next/image";
import type { ReactNode } from "react";

import styles from "./CabeceraPagina.module.css";

interface CabeceraPaginaProps {
  etiqueta: string;
  titulo: ReactNode;
  texto?: string;
  imagen: { src: string; alt: string; posicion?: string };
  children?: ReactNode;
}

/** Cabecera de las páginas internas: foto a sangre con el título encima. */
export default function CabeceraPagina({ etiqueta, titulo, texto, imagen, children }: CabeceraPaginaProps) {
  return (
    <section className={styles.cabecera}>
      <Image
        src={imagen.src}
        alt={imagen.alt}
        fill
        preload
        sizes="100vw"
        className={styles.imagen}
        style={imagen.posicion ? { objectPosition: imagen.posicion } : undefined}
      />
      <span className={styles.velo} aria-hidden="true" />
      <div className={styles.texto}>
        <p className={styles.etiqueta}>{etiqueta}</p>
        <h1 className={`display ${styles.titulo}`}>{titulo}</h1>
        {texto && <p className={styles.parrafo}>{texto}</p>}
        {children}
      </div>
    </section>
  );
}
