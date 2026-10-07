import type { Metadata } from "next";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import Preguntas from "../Components/Comercial/Preguntas";
import LlamadoFinal from "../Components/Sitio/LlamadoFinal";
import { DatosPreguntas } from "../Components/Seo/DatosEstructurados";
import { metadatosDe } from "../lib/sitio";

import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/preguntas",
  "Preguntas frecuentes",
  "Membresías, propietarios, lotes, invitados, Puntos Zagari y cómo llegar: las respuestas a las preguntas más comunes sobre Zagari Resort Club."
);

export default function PaginaPreguntas() {
  return (
    <main className={styles.page}>
      <DatosPreguntas />
      <CabeceraPagina
        etiqueta="Preguntas frecuentes"
        titulo={
          <>
            Reglas claras — <em>sin letra chica</em>
          </>
        }
        texto="Membresías, propietarios, invitados, puntos y ubicación."
        imagen={{
          src: "/assets/images/amenities/element-tierra-diosa-de-elementos.webp",
          alt: "Estatua de la Diosa de los Elementos en Zagari Resort Club",
          posicion: "50% 30%",
        }}
      />
      <Preguntas />
      <LlamadoFinal titulo="¿Te quedó alguna duda?" texto="Escríbenos y un asesor te responde." />
    </main>
  );
}
