"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CLUB, NAV } from "./landing.data";

import styles from "./LandingNav.module.css";

/** La ruta activa: "/membresias/…" también marca Membresías. */
const esActiva = (ruta: string, href: string) =>
  href === "/" ? ruta === "/" : ruta === href || ruta.startsWith(`${href}/`);

export default function LandingNav() {
  const [abierto, setAbierto] = useState(false);
  const [fijo, setFijo] = useState(false);
  const ruta = usePathname();

  useEffect(() => {
    const alScroll = () => setFijo(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const cerrar = () => setAbierto(false);

  return (
    <header className={`${styles.header} ${fijo ? styles.fijo : ""}`}>
      <span className={styles.espectro} aria-hidden="true" />

      <div className={styles.inner}>
        <Link href="/" className={styles.marca} onClick={cerrar}>
          <Image
            src="/assets/logo/zagari-logo-dark.svg"
            alt={CLUB.marca}
            width={872}
            height={170}
            loading="eager"
            className={styles.logo}
          />
        </Link>

        <nav
          id="menu-principal"
          className={`${styles.nav} ${abierto ? styles.navAbierta : ""}`}
          aria-label="Principal"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.enlace}
              aria-current={esActiva(ruta, item.href) ? "page" : undefined}
              onClick={cerrar}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contacto"
            className={styles.cta}
            aria-current={esActiva(ruta, "/contacto") ? "page" : undefined}
            onClick={cerrar}
          >
            Contáctanos
          </Link>
        </nav>

        <button
          type="button"
          className={`${styles.hamburguesa} ${abierto ? styles.activa : ""}`}
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
