/* Navbar.tsx */
"use client";

import {
  ArrowRight,
  List,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./Navbar.module.css";

/* ==========================================================
   SINGLE PAGE NAVIGATION

   Todas las secciones pertenecen a la HOME (/).
   La única ruta externa del navbar es /contacto.
========================================================== */

const leftNavigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "El Club", href: "#el-club" },
  { label: "Experiencias", href: "#experiencias" },
  { label: "Propietarios", href: "#propietarios" },
] as const;

const rightNavigation = [
  { label: "Membresías", href: "#membresias" },
  { label: "Ubicación", href: "#ubicacion" },
] as const;

const mobileNavigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "El Club", href: "#el-club" },
  { label: "Experiencias", href: "#experiencias" },
  { label: "Membresías", href: "#membresias" },
  { label: "Puntos Zagari", href: "#puntos-zagari" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Propietarios", href: "#propietarios" },
  { label: "Ubicación", href: "#ubicacion" },
  { label: "Manifiesto", href: "#manifesto" },
  { label: "Preguntas frecuentes", href: "#preguntas-frecuentes" },
] as const;

/*
 * Todas las secciones reales de la single page.
 * No se usa /faq ni ninguna otra ruta para estas secciones.
 */
const HOME_SECTIONS = [
  "el-club",
  "experiencias",
  "membresias",
  "puntos-zagari",
  "como-funciona",
  "propietarios",
  "ubicacion",
  "preguntas-frecuentes",
  "manifesto",
] as const;

type SectionId = (typeof HOME_SECTIONS)[number];

const SCROLL_OFFSET_DESKTOP = 108;
const SCROLL_OFFSET_MOBILE = 82;

function getScrollOffset() {
  return window.innerWidth <= 700
    ? SCROLL_OFFSET_MOBILE
    : SCROLL_OFFSET_DESKTOP;
}

function getActiveSection(): string {
  const activationLine = getScrollOffset() + window.innerHeight * 0.25;
  let active = "";
  let closest = Number.POSITIVE_INFINITY;

  for (const id of HOME_SECTIONS) {
    const element = document.getElementById(id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();

    if (rect.top <= activationLine && rect.bottom > getScrollOffset()) {
      const distance = Math.abs(rect.top - activationLine);
      if (distance < closest) {
        closest = distance;
        active = id;
      }
    }
  }

  if (active) return active;

  // Si ninguna sección está dentro de la zona activa, estamos en el inicio.
  return window.scrollY < activationLine ? "inicio" : "";
}

function scrollToSection(id: string, updateUrl = true) {
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (updateUrl) {
      window.history.pushState({}, "", window.location.pathname);
    }

    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    getScrollOffset();

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });

  if (updateUrl) {
    window.history.pushState({}, "", `#${id}`);
  }
}

/* ==========================================================
   COMPONENT
========================================================== */

export default function Navbar() {
  const frameRef = useRef<number | null>(null);
  const footerFrameRef = useRef<number | null>(null);
  const initialHashFrameRef = useRef<number | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [isFooterDocked, setIsFooterDocked] = useState(false);

  /* ========================================================
     WHATSAPP
  ======================================================== */

  const whatsappNumber =
    process.env.NEXT_PUBLIC_ZAGARI_WHATSAPP || "971069763";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(
      "Hola Zagari Resort Club, quisiera recibir más información.",
    )}`;

  /* ========================================================
     NORMAL SCROLL + ACTIVE SECTION

     La navegación es una single page. El estado activo se
     determina por la posición real de cada sección, no por
     usePathname ni por rutas de Next.js.
  ======================================================== */

  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 70);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const activeId = getActiveSection();
        setActiveHash(activeId ? `#${activeId}` : "");
      });
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);

  /* ========================================================
     INITIAL HASH

     Si el usuario entra directamente a /#propietarios,
     esperamos a que la single page esté montada y hacemos
     scroll a la sección.
  ======================================================== */

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    if (id !== "inicio" && !HOME_SECTIONS.includes(id as SectionId)) {
      return;
    }

    let attempts = 0;
    let frame = 0;

    const restore = () => {
      const element = id === "inicio"
        ? document.body
        : document.getElementById(id);

      if (element) {
        scrollToSection(id, false);
        setActiveHash(id === "inicio" ? "" : `#${id}`);
        return;
      }

      attempts += 1;
      if (attempts < 30) {
        frame = requestAnimationFrame(restore);
      }
    };

    initialHashFrameRef.current = requestAnimationFrame(restore);

    return () => {
      cancelAnimationFrame(frame);
      if (initialHashFrameRef.current !== null) {
        cancelAnimationFrame(initialHashFrameRef.current);
      }
    };
  }, []);

  /* ========================================================
     FOOTER DOCK
  ======================================================== */

  useEffect(() => {
    const updateFooterDock = () => {
      const footer =
        document.querySelector<HTMLElement>("[data-zagari-footer]");

      if (!footer) {
        setIsFooterDocked(false);
        return;
      }

      const rect = footer.getBoundingClientRect();
      const reachedTop = rect.top <= 12;
      const footerVisible = rect.bottom > 0;

      setIsFooterDocked(reachedTop && footerVisible);
    };

    const requestUpdate = () => {
      if (footerFrameRef.current !== null) {
        cancelAnimationFrame(footerFrameRef.current);
      }

      footerFrameRef.current = requestAnimationFrame(updateFooterDock);
    };

    updateFooterDock();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (footerFrameRef.current !== null) {
        cancelAnimationFrame(footerFrameRef.current);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  /* ========================================================
     BODY LOCK
  ======================================================== */

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isMenuOpen]);

  /* ========================================================
     ESC
  ======================================================== */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ========================================================
     NAVIGATION
  ======================================================== */

  const handleNavigationClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    setIsMenuOpen(false);

    const id = href.replace(/^#/, "");
    scrollToSection(id);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsMenuOpen(false);
    scrollToSection("inicio");
  };

  const isActive = (href: string) => {
    const hash = href.startsWith("#") ? href : "";

    // IMPORTANTE: esta función se ejecuta durante el render.
    // Nunca accedemos a window aquí porque el componente también
    // puede renderizarse en el servidor durante SSR/hydration.
    return activeHash === hash;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const showFooterNav = isFooterDocked && !isMenuOpen;

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <>
      <header
        className={`${styles.header} ${
          isScrolled ? styles.headerScrolled : styles.headerTop
        } ${showFooterNav ? styles.footerDocked : ""}`}
      >
        <div className={styles.notch}>
          {showFooterNav ? (
            <div className={styles.footerNav}>
              <Link
                href="#inicio"
                className={styles.footerNavLogo}
                aria-label="Zagari Resort Club"
                onClick={handleLogoClick}
              >
                <Image
                  src="/assets/brand/zagari-logo-dark.svg"
                  alt="Zagari Resort Club"
                  width={150}
                  height={50}
                  className={styles.footerNavLogoImage}
                />
              </Link>

              <div className={styles.footerNavMessage}>
                <span>Zagari Resort Club</span>
                <strong>Tu lugar para volver.</strong>
                <small>San Ramón · Selva Central</small>
              </div>

              <div className={styles.footerNavActions}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerWhatsapp}
                >
                  <WhatsappLogo size={17} weight="fill" />
                  <span>Hablar por WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* DESKTOP LEFT */}
              <nav
                className={styles.leftNavigation}
                aria-label="Navegación principal"
              >
                {leftNavigation.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      scroll={false}
                      className={`${styles.navLink} ${
                        active ? styles.navLinkActive : ""
                      }`}
                      onClick={(event) =>
                        handleNavigationClick(event, item.href)
                      }
                    >
                      {item.label}
                      <span className={styles.navLine} />
                    </Link>
                  );
                })}
              </nav>

              {/* LOGO */}
              <Link
                href="#inicio"
                scroll={false}
                className={styles.logo}
                aria-label="Ir al inicio"
                onClick={handleLogoClick}
              >
                <Image
                  src="/assets/brand/zagari-logo-dark.svg"
                  alt="Zagari Resort Club"
                  width={160}
                  height={54}
                  priority
                  className={styles.logoImage}
                />
              </Link>

              {/* DESKTOP RIGHT */}
              <div className={styles.rightArea}>
                <nav
                  className={styles.rightNavigation}
                  aria-label="Secciones"
                >
                  {rightNavigation.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        scroll={false}
                        className={`${styles.navLink} ${
                          active ? styles.navLinkActive : ""
                        }`}
                        onClick={(event) =>
                          handleNavigationClick(event, item.href)
                        }
                      >
                        {item.label}
                        <span className={styles.navLine} />
                      </Link>
                    );
                  })}
                </nav>

                {/* ÚNICA RUTA REAL DEL NAVBAR */}
                {/* <Link
                  href="/contacto"
                  className={styles.contactButton}
                >
                  <span>Agendar visita</span>
                  <span className={styles.contactIcon}>
                    <ArrowRight size={15} weight="bold" />
                  </span>
                </Link> */}
              </div>

              {/* MOBILE BUTTON */}
              <button
                type="button"
                className={styles.menuButton}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMenuOpen}
                aria-controls="zagari-menu"
                onClick={() => setIsMenuOpen((current) => !current)}
              >
                {isMenuOpen ? <X size={20} /> : <List size={22} />}
              </button>
            </>
          )}
        </div>
      </header>

      {/* BACKDROP */}
      <button
        type="button"
        className={`${styles.backdrop} ${
          isMenuOpen ? styles.backdropVisible : ""
        }`}
        aria-label="Cerrar menú"
        onClick={closeMenu}
        tabIndex={isMenuOpen ? 0 : -1}
      />

      {/* MOBILE MENU */}
      <aside
        id="zagari-menu"
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileHeader}>
          <Link
            href="#inicio"
            scroll={false}
            className={styles.mobileLogo}
            onClick={handleLogoClick}
            aria-label="Ir al inicio"
          >
            <Image
              src="/assets/brand/zagari-logo-light.svg"
              alt="Zagari Resort Club"
              width={140}
              height={50}
              className={styles.mobileLogoImage}
            />
          </Link>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.mobileIntro}>
          <span>Zagari Resort Club</span>
          <h2>
            Vive diferente
            <br />
            en San Ramón.
          </h2>
          <p>
            Naturaleza, descanso,
            lotes y experiencias
            en la Selva Central.
          </p>
        </div>

        <nav
          className={styles.mobileNavigation}
          aria-label="Navegación móvil"
        >
          {mobileNavigation.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                scroll={false}
                onClick={(event) =>
                  handleNavigationClick(event, item.href)
                }
                className={`${styles.mobileLink} ${
                  active ? styles.mobileLinkActive : ""
                }`}
              >
                <span className={styles.mobileIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{item.label}</strong>
                <span className={styles.mobileArrow}>
                  <ArrowRight size={17} />
                </span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contacto"
          className={styles.mobileContact}
          onClick={closeMenu}
        >
          <span>Solicitar información</span>
          <span className={styles.mobileContactIcon}>
            <ArrowRight size={17} weight="bold" />
          </span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileWhatsapp}
          onClick={closeMenu}
        >
          <WhatsappLogo size={18} weight="fill" />
          <span>Hablar por WhatsApp</span>
        </a>

        <div className={styles.mobileFooter}>
          <span>San Ramón · Selva Central</span>
          <span>Zagari Resort Club</span>
        </div>
      </aside>
    </>
  );
}
