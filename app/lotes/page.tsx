import type { Metadata } from "next";
import Link from "next/link";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import { Modelos, PlanMaestro, Propietario } from "../Components/Sitio/Lotes";
import ContactForm from "../Components/ContactForm/ContactForm";
import { CLUB } from "../Components/Landing/landing.data";
import { LOTES, whatsapp } from "../lib/contenido";
import { metadatosDe } from "../lib/sitio";

import comun from "../Components/Comercial/comercial.module.css";
import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/lotes",
  "Lotes en San Ramón",
  `Preventa de la II etapa de lotes en Zagari Resort Club, San Ramón: desde ${LOTES.area.desde} hasta ${LOTES.area.hasta} m², crédito directo hasta en 18 meses y Membresía Oro el primer año sin costo.`
);

const OPCIONES = [
  { value: "disponibilidad", label: "Lotes disponibles" },
  { value: "credito", label: "Crédito directo" },
  { value: "visita", label: "Visitar el proyecto" },
  { value: "otro", label: "Otra consulta" },
];

export default function Lotes() {
  return (
    <main className={styles.page}>
      <CabeceraPagina
        etiqueta={`${LOTES.etapa} · San Ramón`}
        titulo={
          <>
            Tu lote en la <em>Selva Central</em>
          </>
        }
        texto={`Lotes desde ${LOTES.area.desde} hasta ${LOTES.area.hasta} m² dentro de Zagari Resort Club, con acceso al club desde el primer día.`}
        imagen={{
          src: "/assets/images/lotes/domos.webp",
          alt: "Cabañas con domo entre palmeras y jardines de Zagari",
        }}
      />
      <Propietario />
      <PlanMaestro />
      <Modelos />
      <ContactForm
        id="contacto"
        title="Separa tu lote en preventa"
        lead="Déjanos tus datos y un asesor te contará la disponibilidad, las condiciones de preventa y el crédito directo."
        selectLabel="Me interesa"
        selectOptions={OPCIONES}
        submitLabel="Quiero información"
        codigoFormulario="zagari_lotes"
        nombreFormulario="Lotes II etapa — web"
        tipoFormulario="lotes"
        complemento={
          <div className={comun.panel}>
            <p className={comun.etiqueta}>¿Prefieres hablar ahora?</p>
            <p className={comun.intro}>
              Escríbenos al {CLUB.telefono}. Los lotes son limitados.
            </p>
            <p>
              <a
                href={whatsapp("Hola, quiero información de los lotes de la II etapa de Zagari Resort Club.")}
                className={comun.boton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escríbenos por WhatsApp
              </a>
            </p>
            <p className={comun.nota}>
              ¿Tienes dudas? Revisa las <Link href="/preguntas#propietarios">preguntas frecuentes</Link>.
            </p>
          </div>
        }
      />
    </main>
  );
}
