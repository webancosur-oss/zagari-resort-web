import type { ReactNode } from "react";
import Link from "next/link";

import styles from "./comercial.module.css";

interface CabeceraProps {
  etiqueta: string;
  /** Admite <em> para las palabras en gris. */
  titulo: ReactNode;
  intro?: ReactNode;
  /** Enlace a la derecha del titular, como el "Ver todo" de la referencia. */
  enlace?: { label: string; href: string };
  children?: ReactNode;
}

export default function Cabecera({ etiqueta, titulo, intro, enlace, children }: CabeceraProps) {
  return (
    <header className={styles.cabecera}>
      <div>
        <p className={styles.etiqueta} data-reveal data-entrada="sube">
          {etiqueta}
        </p>
        <h2 className={`display ${styles.titulo}`} data-reveal data-entrada="sube">
          {titulo}
        </h2>
        {intro && (
          <p className={styles.intro} data-reveal data-entrada="sube">
            {intro}
          </p>
        )}
        {children}
      </div>
      {enlace && (
        <Link href={enlace.href} className={styles.enlace} data-reveal data-entrada="sube">
          {enlace.label}
        </Link>
      )}
    </header>
  );
}
