"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { desplazarA } from "../SmoothScroll/SmoothScroll";
import { CLUB, NAV } from "./landing.data";

import styles from "./LandingNav.module.css";

/**
 * Todas las secciones de la portada en orden, también las que no tienen
 * enlace: si solo se vigilaran las del menú, al pasar de Experiencias a
 * Puntos la barra seguiría marcando Experiencias.
 */
const SECCIONES = [
  "inicio",
  "club",
  "membresias",
  "beneficios",
  "experiencias",
  "puntos",
  "visita",
  "preguntas",
  "ubicacion",
  "contacto",
];

const anclaDe = (href: string) => href.split("#")[1] ?? "";

export default function LandingNav() {
  const [abierto, setAbierto] = useState(false);
  const [fijo, setFijo] = useState(false);
  const [activa, setActiva] = useState<string | null>(null);

  // Sección activa: la última cuyo borde superior cruzó una línea bajo la barra.
  useEffect(() => {
    let cuadro = 0;

    const calcular = () => {
      cuadro = 0;
      const alto = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      const linea = alto + window.innerHeight * 0.3;
      const presentes = SECCIONES.filter((id) => document.getElementById(id));
      let actual: string | null = null;

      for (const id of presentes) {
        if (document.getElementById(id)!.getBoundingClientRect().top <= linea) actual = id;
      }

      // Al final de la página la última sección puede no llegar a la línea.
      const alFinal =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (alFinal && presentes.length) actual = presentes[presentes.length - 1];

      setActiva(actual);
    };

    const programar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(calcular);
    };

    programar();
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    // Abrir la comparativa cambia la altura de la página.
    document.addEventListener("toggle", programar, true);

    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      document.removeEventListener("toggle", programar, true);
    };
  }, []);

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

  // En la portada, las anclas se resuelven aquí; desde otra página, navega Next.
  const irA = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    cerrar();
    if (window.location.pathname !== "/" || !href.startsWith("/#")) return;
    if (desplazarA(href.slice(1))) e.preventDefault();
  };

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
              aria-current={activa === anclaDe(item.href) ? "true" : undefined}
              onClick={(e) => irA(e, item.href)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contacto"
            className={styles.cta}
            aria-current={activa === "contacto" ? "true" : undefined}
            onClick={(e) => irA(e, "/#contacto")}
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
