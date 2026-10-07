"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./BotonPropietario.module.css";

/** Botón flotante a la izquierda: lleva a la página de lotes. */
export default function BotonPropietario() {
  const ruta = usePathname();
  if (ruta === "/lotes") return null;

  return (
    <Link href="/lotes" className={styles.boton} aria-label="¿Cómo ser propietario? Conoce los lotes de Zagari">
      <span className={styles.icono}>
        {/* Ilustración de la cabaña tipo A del club. */}
        <Image
          src="/assets/icons/cabana-propietario.webp"
          alt=""
          width={256}
          height={256}
          sizes="(max-width: 639px) 64px, (max-width: 1023px) 80px, 92px"
          className={styles.cabana}
        />
      </span>
      <span className={styles.globo} aria-hidden="true">
        ¿Cómo ser <strong>propietario</strong>?
      </span>
    </Link>
  );
}
