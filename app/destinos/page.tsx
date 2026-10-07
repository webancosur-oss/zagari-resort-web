import type { Metadata } from "next";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import Presentacion from "../Components/Comercial/Presentacion";
import LocationRoute from "../Components/LocationRoute/LocationRoute";
import CabanasClub from "../Components/Sitio/CabanasClub";
import Oxapampa from "../Components/Sitio/Oxapampa";
import Cercanos from "../Components/Sitio/Cercanos";
import LlamadoFinal from "../Components/Sitio/LlamadoFinal";
import { metadatosDe } from "../lib/sitio";

import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/destinos",
  "Destinos y cabañas",
  "San Ramón, en la Selva Central, a 15 minutos de la Carretera Central: cómo llegar, cabañas del club y lugares cercanos. Oxapampa, próximamente."
);

export default function Destinos() {
  return (
    <main className={styles.page}>
      <CabeceraPagina
        etiqueta="Destinos y cabañas"
        titulo={
          <>
            San Ramón hoy, <em>Oxapampa pronto</em>
          </>
        }
        texto="Un club entre el valle y la montaña de la Selva Central, con cabañas para quedarte y lugares increíbles a pocos minutos."
        imagen={{
          src: "/assets/images/experiences/experience9.webp",
          alt: "Vista aérea de la piscina y los espacios de Zagari Resort Club en la montaña",
        }}
      />
      <Presentacion />
      <div id="como-llegar">
        <LocationRoute />
      </div>
      <CabanasClub />
      <Cercanos etiqueta="Qué visitar cerca" />
      <Oxapampa />
      <LlamadoFinal
        titulo="Planea tu visita a San Ramón"
        texto="Te ayudamos a elegir la fecha, reservar tu cabaña y llegar sin perderte."
        mensaje="Hola Zagari Resort Club, quiero planear una visita a San Ramón."
      />
    </main>
  );
}
