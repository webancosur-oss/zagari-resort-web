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
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

/* ==========================================================
   NAVIGATION
   Los enlaces con /#... llevan a secciones de la página principal.
   Las páginas independientes conservan su ruta.
========================================================== */

const leftNavigation = [
  // {
  //   label: "Inicio",
  //   href: "/",
  // },
  {
    label: "El Club",
    href: "/#el-club",
  },
  {
    label: "Experiencias",
    href: "/#experiencias",
  },
] as const;

const rightNavigation = [
  {
    label: "Membresías",
    href: "/#membresias",
  },
  {
    label: "Ubicación",
    href: "/#ubicacion",
  },
] as const;

const mobileNavigation = [
  // {
  //   label: "Inicio",
  //   href: "/",
  // },
  {
    label: "El Club",
    href: "/#el-club",
  },
  {
    label: "Experiencias",
    href: "/#experiencias",
  },
  {
    label: "Membresías",
    href: "/#membresias",
  },
  {
    label: "Puntos Zagari",
    href: "/#puntos-zagari",
  },
  {
    label: "Propietarios",
    href: "/#propietarios",
  },
  {
    label: "App Zagari",
    href: "/#app-zagari",
  },
  {
    label: "Cómo funciona",
    href: "/#como-funciona",
  },
  {
    label: "Ubicación",
    href: "/#ubicacion",
  },
  {
    label: "Preguntas frecuentes",
    href: "/faq",
  },
] as const;

const HOME_SECTION_HASHES = new Set([
  "#el-club",
  "#experiencias",
  "#membresias",
  "#puntos-zagari",
  "#propietarios",
  "#app-zagari",
  "#como-funciona",
  "#ubicacion",
]);

const SCROLL_STORAGE_KEY = "zagari-navbar-scroll";

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getHashFromHref(href: string) {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex) : "";
}

/* ==========================================================
   COMPONENT
========================================================== */

export default function Navbar() {
  const pathname = usePathname();

  const frameRef = useRef<number | null>(null);
  const restoreFrameRef = useRef<number | null>(null);
  const previousPathRef = useRef(pathname);

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
     NORMAL SCROLL
  ======================================================== */

  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 70);
    };

    update();

    window.addEventListener("scroll", update, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", update);
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
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(updateFooterDock);
    };

    updateFooterDock();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  /* ========================================================
     HASH
  ======================================================== */

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash);
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  /* ========================================================
     HASH SCROLL

     Permite que /#seccion funcione correctamente incluso
     después de venir desde otra página.
  ======================================================== */

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;

    if (!hash || !HOME_SECTION_HASHES.has(hash)) return;

    const restore = () => {
      const element = document.getElementById(hash.slice(1));

      if (!element) return;

      const headerOffset = window.innerWidth <= 700 ? 74 : 94;

      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "auto",
      });
    };

    if (restoreFrameRef.current !== null) {
      cancelAnimationFrame(restoreFrameRef.current);
    }

    restoreFrameRef.current = requestAnimationFrame(() => {
      restoreFrameRef.current = requestAnimationFrame(restore);
    });

    return () => {
      if (restoreFrameRef.current !== null) {
        cancelAnimationFrame(restoreFrameRef.current);
      }
    };
  }, [pathname, activeHash]);

  /* ========================================================
     SCROLL POSITION / BACK-FORWARD NAVIGATION

     Si el usuario está dentro de una sección:
       sección -> página -> atrás

     el navegador vuelve a la URL anterior y esta lógica
     mantiene/restaura la posición correspondiente.
  ======================================================== */

  useEffect(() => {
    const previousPath = previousPathRef.current;

    if (previousPath !== pathname) {
      const currentKey = `${previousPath}${window.location.hash || ""}`;

      try {
        sessionStorage.setItem(
          `${SCROLL_STORAGE_KEY}:${currentKey}`,
          String(window.scrollY),
        );
      } catch {
        // sessionStorage puede estar bloqueado en ciertos entornos.
      }

      previousPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const saveCurrentPosition = () => {
      const key = `${pathname}${window.location.hash || ""}`;

      try {
        sessionStorage.setItem(
          `${SCROLL_STORAGE_KEY}:${key}`,
          String(window.scrollY),
        );
      } catch {
        // No interrumpir la navegación si storage no está disponible.
      }
    };

    window.addEventListener("beforeunload", saveCurrentPosition);

    return () => {
      window.removeEventListener("beforeunload", saveCurrentPosition);
    };
  }, [pathname]);

  /* ========================================================
     CLOSE MENU WHEN ROUTE CHANGES
  ======================================================== */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
     ACTIVE
  ======================================================== */

  const isActive = (href: string) => {
    const [route, hash] = href.split("#");
    const currentPath = normalizePath(pathname);

    /* HOME */
    if (href === "/") {
      return currentPath === "/" && !activeHash;
    }

    /* HOME SECTION */
    if (hash && (!route || route === "/")) {
      return (
        currentPath === "/" &&
        activeHash === `#${hash}`
      );
    }

    /* NORMAL ROUTE */
    if (route) {
      const normalizedRoute = normalizePath(route);

      return (
        currentPath === normalizedRoute ||
        currentPath.startsWith(`${normalizedRoute}/`)
      );
    }

    return false;
  };

  /* ========================================================
     NAVIGATION HANDLER

     Para anchors de la home no hacemos navegación manual:
     Next <Link> mantiene la navegación SPA y el hash queda
     en la URL. Esto permite volver con Back a la sección.
  ======================================================== */

  const handleNavigationClick = (href: string) => {
    if (typeof window === "undefined") return;

    const hash = getHashFromHref(href);

    try {
      const key = `${window.location.pathname}${window.location.hash || ""}`;

      sessionStorage.setItem(
        `${SCROLL_STORAGE_KEY}:${key}`,
        String(window.scrollY),
      );
    } catch {
      // No bloquear navegación.
    }

    if (hash) {
      setActiveHash(hash);
    }

    setIsMenuOpen(false);
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
      {/* ===================================================
          NAVBAR
      ==================================================== */}

      <header
        className={`${styles.header} ${
          isScrolled
            ? styles.headerScrolled
            : styles.headerTop
        } ${
          showFooterNav
            ? styles.footerDocked
            : ""
        }`}
      >
        <div className={styles.notch}>
          {showFooterNav ? (
            /* ===============================================
               FOOTER NAVBAR MODE
            ================================================ */

            <div className={styles.footerNav}>
              <Link
                href="/"
                className={styles.footerNavLogo}
                aria-label="Zagari Resort Club"
                onClick={() => handleNavigationClick("/")}
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
              {/* =============================================
                  DESKTOP LEFT
              ============================================== */}

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
                      onClick={() =>
                        handleNavigationClick(item.href)
                      }
                    >
                      {item.label}

                      <span className={styles.navLine} />
                    </Link>
                  );
                })}
              </nav>

              {/* =============================================
                  LOGO CENTER
              ============================================== */}

              <Link
                href="/"
                scroll={false}
                className={styles.logo}
                aria-label="Zagari Resort Club"
                onClick={() => handleNavigationClick("/")}
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

              {/* =============================================
                  DESKTOP RIGHT
              ============================================== */}

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
                          active
                            ? styles.navLinkActive
                            : ""
                        }`}
                        onClick={() =>
                          handleNavigationClick(item.href)
                        }
                      >
                        {item.label}

                        <span className={styles.navLine} />
                      </Link>
                    );
                  })}
                </nav>

                <Link
                  href="/contacto"
                  className={styles.contactButton}
                >
                  <span>Agendar visita</span>

                  <span className={styles.contactIcon}>
                    <ArrowRight
                      size={15}
                      weight="bold"
                    />
                  </span>
                </Link>
              </div>

              {/* =============================================
                  MOBILE BUTTON
              ============================================== */}

              <button
                type="button"
                className={styles.menuButton}
                aria-label={
                  isMenuOpen
                    ? "Cerrar menú"
                    : "Abrir menú"
                }
                aria-expanded={isMenuOpen}
                aria-controls="zagari-menu"
                onClick={() =>
                  setIsMenuOpen((current) => !current)
                }
              >
                {isMenuOpen ? (
                  <X size={20} />
                ) : (
                  <List size={22} />
                )}
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===================================================
          BACKDROP
      ==================================================== */}

      <button
        type="button"
        className={`${styles.backdrop} ${
          isMenuOpen
            ? styles.backdropVisible
            : ""
        }`}
        aria-label="Cerrar menú"
        onClick={closeMenu}
        tabIndex={isMenuOpen ? 0 : -1}
      />

      {/* ===================================================
          MOBILE MENU
      ==================================================== */}

      <aside
        id="zagari-menu"
        className={`${styles.mobileMenu} ${
          isMenuOpen
            ? styles.mobileMenuOpen
            : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileHeader}>
          <Link
            href="/"
            scroll={false}
            className={styles.mobileLogo}
            onClick={() => handleNavigationClick("/")}
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
                onClick={() =>
                  handleNavigationClick(item.href)
                }
                className={`${styles.mobileLink} ${
                  active
                    ? styles.mobileLinkActive
                    : ""
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
