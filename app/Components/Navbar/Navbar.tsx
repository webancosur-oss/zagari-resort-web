"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "reicon-react";

import styles from "./Navbar.module.css";

interface MenuChild {
  label: string;
  href: string;

  image: string;
  imageAlt: string;
}

interface MenuItem {
  label: string;
  href?: string;
  id?: string;
  children?: MenuChild[];
}

const A = "/assets/images/amenities";
const C = "/assets/images/cabagnas";

const MENU: MenuItem[] = [
  {
    label: "INICIO",
    href: "/",
  },
  {
    label: "EXPERIENCIAS",
    id: "experiencias",
    children: [
      {
        label: "Exclusivas",
        href: "/experiencias/exclusivas",
        image: `${A}/element-agua-piscina-borde-infinito.webp`,
        imageAlt: "Piscina de borde infinito del club",
      },
      {
        label: "Familiares",
        href: "/experiencias/familiares",
        image: `${A}/cabanias-alojamiento.webp`,
        imageAlt: "Cabañas de madera entre la vegetación",
      },
    ],
  },
  // Entrada desactivada: al reactivarla, /eventos/* vuelve al menu.
  // {
  //   label: "REUNIONES Y EVENTOS",
  //   id: "eventos",
  //   children: [
  //     {
  //       label: "Corporativos",
  //       href: "/eventos/corporativos",
  //       image: "/assets/images/experiences/experience7.webp",
  //       imageAlt: "Jornada bajo toldo con vista al valle",
  //     },
  //     {
  //       label: "Sociales",
  //       href: "/eventos/sociales",
  //       image: "/assets/images/experiences/experience16.webp",
  //       imageAlt: "Copas servidas para un brindis",
  //     },
  //   ],
  // },
  {
    label: "MEMBRESÍAS",
    id: "membresias",
    children: [
      {
        label: "Niveles de membresía",
        href: "/membresias/niveles",
        image: `${C}/piscina-sunshine.jpeg`,
        imageAlt: "Piscina del club al atardecer",
      },
      {
        label: "Beneficios para propietarios",
        href: "/membresias/beneficios-propietarios",
        image: `${A}/element-tierra-portico.webp`,
        imageAlt: "Pórtico de entrada de Zagari",
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";

  return (
    pathname === href || pathname.startsWith(`${href}/`)
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    string | null
  >(null);

  const headerRef = useRef<HTMLElement>(null);

  const closeAll = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: string) =>
    setOpenDropdown((current) =>
      current === id ? null : id
    );

  useEffect(() => {
    if (!menuOpen && !openDropdown) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };

    const onPointerDown = (event: PointerEvent) => {
      const header = headerRef.current;

      if (
        header &&
        !header.contains(event.target as Node)
      ) {
        closeAll();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener(
        "pointerdown",
        onPointerDown
      );
    };
  }, [menuOpen, openDropdown]);

  return (
    <header ref={headerRef} className={styles.header}>

      <div className={styles.topbar}>
        <div className={styles.topbarInner}>

          <Link
            href="/"
            className={styles.logoWrapper}
            onClick={closeAll}
          >
            <Image
              src="/assets/logo/logo-zagari.svg"
              alt="Zagari Resort Club"
              width={700}
              height={320}
              // eager y no preload: el logo no debe competir con el hero.
              loading="eager"
              className={styles.logo}
            />
          </Link>

          <button
            type="button"
            className={`${styles.menuButton} ${
              menuOpen ? styles.menuButtonActive : ""
            }`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setOpenDropdown(null);
            }}
            aria-label={
              menuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="navbar-menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </div>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>

          <div
            id="navbar-menu"
            className={`${styles.navLinks} ${
              menuOpen ? styles.navLinksOpen : ""
            }`}
          >
            {MENU.map((item) => {
              if (!item.children) {
                const active = isActive(
                  pathname,
                  item.href ?? "/"
                );

                return (
                  <Link
                    key={item.label}
                    href={item.href ?? "/"}
                    className={`${styles.navLink} ${
                      active ? styles.active : ""
                    }`}
                    aria-current={
                      active ? "page" : undefined
                    }
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                );
              }

              const id = item.id as string;
              const open = openDropdown === id;

              const active = item.children.some((child) =>
                isActive(pathname, child.href)
              );

              return (
                <div
                  key={item.label}
                  className={styles.dropdown}
                >
                  <button
                    type="button"
                    className={`${styles.navLink} ${
                      active ? styles.active : ""
                    } ${open ? styles.navLinkOpen : ""}`}
                    onClick={() => toggleDropdown(id)}
                    aria-expanded={open}
                    aria-controls={`dropdown-${id}`}
                  >
                    {item.label}

                    <ChevronDown
                      size={14}
                      className={`${styles.arrow} ${
                        open ? styles.arrowOpen : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`dropdown-${id}`}
                    className={`${styles.dropdownMenu} ${
                      open ? styles.dropdownOpen : ""
                    }`}
                  >
                    <div className={styles.dropdownInner}>
                      <p className={styles.dropdownTitle}>
                        {item.label}
                      </p>

                      <div className={styles.dropdownGrid}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`${styles.dropdownCard} ${
                              isActive(pathname, child.href)
                                ? styles.cardActive
                                : ""
                            }`}
                            aria-current={
                              isActive(pathname, child.href)
                                ? "page"
                                : undefined
                            }
                            onClick={closeAll}
                          >
                            <span className={styles.cardMedia}>
                              <Image
                                src={child.image}
                                alt={child.imageAlt}
                                fill
                                sizes="(min-width: 900px) 240px, 1px"
                                className={styles.cardImage}
                              />
                            </span>

                            <span className={styles.cardLabel}>
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </nav>
    </header>
  );
}
