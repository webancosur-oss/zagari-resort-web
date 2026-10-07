"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FooterIcon from "../Footer/FooterIcon";
import { CLUB, NAV } from "./landing.data";
import { MEDIOS, motion, sinMovimiento } from "../../lib/motion";

import styles from "./LandingFooter.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LEGAL = [
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Términos y condiciones", href: "/terminos" },
  { label: "Cookies", href: "/cookies" },
];

/** Progreso normalizado de cada capa. Tras el wordmark la escena
    baja en el orden en que se lee: banda superior, columnas y pie. */
const FRAMES = {
  wordmark: 0,
  contacto: 0.26,
  redes: 0.34,
  columnas: 0.56,
  pie: 0.9,
} as const;

const PASO_COLUMNA = 0.1;
const PASO_RED = 0.05;

/** Mismo desplazamiento que declara el contrato anti-destello para
    data-entrada="sube"; el wordmark lo repite en su módulo CSS. */
const SALTO = 34;

/** Estado inicial del wordmark: idéntico a data-entrada="mascara". */
const OCULTO = "inset(0 0 100% 0)";
/** Insets negativos: al terminar, la máscara no recorta tildes ni descendentes. */
const VISIBLE = "inset(-8% 0 -12% 0)";

export default function LandingFooter() {
  const anio = new Date().getFullYear();
  const raiz = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const escena = raiz.current;
      if (!escena || sinMovimiento()) return;

      const busca = (clase: string) =>
        escena.querySelector<HTMLElement>(`.${clase}`);
      const buscaTodos = (selector: string) =>
        Array.from(escena.querySelectorAll<HTMLElement>(selector));

      const capaFondo = busca(styles.capaFondo);
      const wordmark = busca(styles.wordmark);
      const contacto = busca(styles.bloqueContacto);
      const pie = busca(styles.inferior);
      const columnas = buscaTodos(`.${styles.columnas} > *`);
      const redes = buscaTodos(`.${styles.redes} > li`);

      const mm = gsap.matchMedia();

      mm.add(
        {
          escritorio: MEDIOS.escritorio,
          tablet: MEDIOS.tablet,
          movil: MEDIOS.movil,
        },
        (contexto) => {
          const { escritorio = false, tablet = false } =
            contexto.conditions ?? {};

          const deriva = escritorio ? -6 : tablet ? -4 : -2;
          const compas =
            motion.duration.slow * (escritorio ? 1 : tablet ? 0.8 : 0.6);
          const en = (progreso: number) => progreso * compas;

          const capas: Array<[HTMLElement, number]> = [];
          if (contacto) capas.push([contacto, FRAMES.contacto]);
          redes.forEach((red, i) =>
            capas.push([red, FRAMES.redes + i * PASO_RED])
          );
          columnas.forEach((columna, i) =>
            capas.push([columna, FRAMES.columnas + i * PASO_COLUMNA])
          );
          if (pie) capas.push([pie, FRAMES.pie]);

          // Los estados iniciales repiten lo que el contrato ya sirvió en el
          // HTML; nada cambia de aspecto al tomar GSAP el control.
          if (wordmark) {
            gsap.set(wordmark, { autoAlpha: 0, clipPath: OCULTO, y: SALTO });
          }
          if (capas.length > 0) {
            // autoAlpha y no opacity: lo oculto sale del orden de tabulación.
            gsap.set(
              capas.map(([capa]) => capa),
              { autoAlpha: 0, y: SALTO }
            );
          }

          const entrada = gsap.timeline({
            defaults: {
              duration: motion.duration.base,
              ease: motion.ease.cinematic,
            },
            scrollTrigger: { trigger: escena, start: "top 96%", once: true },
          });

          if (wordmark) {
            entrada.to(
              wordmark,
              {
                autoAlpha: 1,
                clipPath: VISIBLE,
                y: 0,
                duration: motion.duration.cinematic,
              },
              en(FRAMES.wordmark)
            );
          }

          capas.forEach(([capa, progreso]) => {
            entrada.to(capa, { autoAlpha: 1, y: 0 }, en(progreso));
          });

          if (capaFondo) {
            gsap.fromTo(
              capaFondo,
              { yPercent: -deriva * 0.8 },
              {
                yPercent: deriva,
                ease: motion.ease.scrub,
                scrollTrigger: {
                  trigger: escena,
                  start: "top bottom",
                  end: "bottom bottom",
                  scrub: true,
                  // El pie vive en el layout: la capa solo se promueve
                  // mientras está en pantalla, no en toda la navegación.
                  onToggle: ({ isActive }) =>
                    capaFondo.classList.toggle(
                      styles.capaFondoActiva,
                      isActive
                    ),
                },
              }
            );
          }

          return () => capaFondo?.classList.remove(styles.capaFondoActiva);
        }
      );

      return () => mm.revert();
    },
    { scope: raiz }
  );

  return (
    <footer className={styles.footer} ref={raiz}>
      <span className={styles.capaFondo} aria-hidden="true">
        <Image
          src="/assets/images/heroes/hero_image_sendero.jpg"
          alt=""
          fill
          sizes="100vw"
          className={styles.fondo}
        />
      </span>

      <span className={styles.velo} aria-hidden="true" />

      <div className={styles.inner}>

        <div className={styles.superior}>
          <div className={styles.bloqueContacto} data-entrada="sube">
            <p className={styles.etiqueta}>Escríbenos</p>

            <a href={CLUB.whatsapp} className={styles.contacto}
               target="_blank" rel="noopener noreferrer"
               aria-label={`Escríbenos por WhatsApp al ${CLUB.telefono}`}>
              {CLUB.telefono}
            </a>
          </div>

          <ul className={styles.redes}>
            <li data-entrada="sube">
              <a href={CLUB.instagram} target="_blank" rel="noopener noreferrer"
                 className={styles.red} aria-label="Instagram">
                <FooterIcon name="instagram" />
              </a>
            </li>
            <li data-entrada="sube">
              <a href={CLUB.facebook} target="_blank" rel="noopener noreferrer"
                 className={styles.red} aria-label="Facebook">
                <FooterIcon name="facebook" />
              </a>
            </li>
            <li data-entrada="sube">
              <a href={CLUB.tiktok} target="_blank" rel="noopener noreferrer"
                 className={styles.red} aria-label="TikTok">
                <FooterIcon name="tiktok" />
              </a>
            </li>
          </ul>
        </div>

        <p className={styles.wordmark} data-entrada="mascara">
          <Image
            src="/assets/logo/zagari-logo-light.svg"
            alt={CLUB.marca}
            width={872}
            height={170}
            className={styles.logo}
          />
        </p>

        <div className={styles.columnas}>
          <nav aria-label="Secciones" data-entrada="sube">
            <h2 className={styles.columnaTitulo}>Secciones</h2>
            <ul className={styles.lista}>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={styles.enlace}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" data-entrada="sube">
            <h2 className={styles.columnaTitulo}>Legal</h2>
            <ul className={styles.lista}>
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.enlace}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.datos} data-entrada="sube">
            <h2 className={styles.columnaTitulo}>Contacto</h2>

            <p className={styles.dato}>{CLUB.razonSocial}</p>
            <p className={styles.dato}>RUC {CLUB.ruc}</p>
            <p className={styles.dato}>{CLUB.domicilioFiscal}</p>

            <a href={CLUB.maps} className={styles.enlace}
               target="_blank" rel="noopener noreferrer">
              {CLUB.ubicacion}
            </a>
          </div>
        </div>

        <div className={styles.inferior} data-entrada="sube">
          <p className={styles.copyright}>
            © {anio} {CLUB.marca}. Todos los derechos reservados.
          </p>

          <p className={styles.copyright}>
            Un proyecto de {CLUB.razonSocial}
          </p>
        </div>

      </div>
    </footer>
  );
}
