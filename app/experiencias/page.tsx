import type { Metadata } from "next";

import LandingHero from "../Components/Landing/LandingHero";
import Elementos from "../Components/Sitio/Elementos";
import LlamadoFinal from "../Components/Sitio/LlamadoFinal";
import { metadatosDe } from "../lib/sitio";

import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/experiencias",
  "Experiencias",
  "Más de 20 amenidades conectadas con los cuatro elementos: piscina infinita, bar en la piscina, mirador, zona espiritual, camping, biohuerto, canchas, gimnasio y más."
);

export default function Experiencias() {
  return (
    <main className={styles.page}>
      <LandingHero
        lugar="Experiencias · Aire, fuego, tierra y agua"
        parrafo="Más de 20 amenidades en plena Selva Central: piscina infinita, miradores, biohuerto, deporte, descanso y gastronomía."
        primario={{ label: "Elige tu membresía", href: "/membresias" }}
      />
      <Elementos />
      <LlamadoFinal
        titulo="Ven a vivirlo en persona"
        texto="Reserva tu entrada por el día o una cabaña, y conoce el club antes de hacerte socio."
        mensaje="Hola Zagari Resort Club, quiero conocer el club. ¿Cómo reservo una visita?"
        imagen={{
          src: "/assets/images/amenities/element-agua-piscina-borde-infinito.webp",
          alt: "Piscina de borde infinito del club con palmeras",
        }}
      />
    </main>
  );
}
