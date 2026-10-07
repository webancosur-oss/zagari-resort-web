import type { Metadata } from "next";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import PromocionesDetalle from "../Components/Sitio/PromocionesDetalle";
import LlamadoFinal from "../Components/Sitio/LlamadoFinal";
import { metadatosDe } from "../lib/sitio";

import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/promociones",
  "Promociones",
  "Promociones de Zagari Resort Club: por ser propietario, Membresía Oro el primer año sin costo; gana con tus Puntos Zagari y accede a espacios exclusivos para socios."
);

export default function Promociones() {
  return (
    <main className={styles.page}>
      <CabeceraPagina
        etiqueta="Promociones"
        titulo={
          <>
            Beneficios que empiezan <em>desde el primer día</em>
          </>
        }
        texto="Por ser propietario, por cada visita y por ser socio: beneficios que crecen contigo."
        imagen={{
          src: "/assets/images/experiences/experience1.webp",
          alt: "Piscina de Zagari Resort Club con cascada frente a las montañas",
        }}
      />
      <PromocionesDetalle />
      <LlamadoFinal
        titulo="¿Qué promoción es para ti?"
        texto="Cuéntanos si eres propietario, socio o empresa, y un asesor te explica cómo aprovecharla."
        mensaje="Hola Zagari Resort Club, quiero información sobre sus promociones."
      />
    </main>
  );
}
