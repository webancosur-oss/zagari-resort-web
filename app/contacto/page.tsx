import type { Metadata } from "next";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import ContactForm from "../Components/ContactForm/ContactForm";
import { CLUB } from "../Components/Landing/landing.data";
import { CATEGORIAS } from "../lib/modelo";
import { esFecha, esPlan, fechaLegible, personas, PLANES } from "../lib/reservas";
import { metadatosDe } from "../lib/sitio";
import { whatsapp } from "../lib/contenido";

import comun from "../Components/Comercial/comercial.module.css";
import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/contacto",
  "Contacto",
  "Escríbenos o déjanos tus datos y un asesor de Zagari Resort Club te llamará: membresías, cabañas, entradas por día y lotes en San Ramón."
);

const OPCIONES = [
  { value: "dia", label: "Entrada por día" },
  { value: "cabana", label: "Reservar una cabaña" },
  ...CATEGORIAS.map((c) => ({ value: c.id, label: `Membresía ${c.nombre}` })),
  { value: "lote", label: "Lotes en preventa" },
  { value: "otro", label: "Otra consulta" },
];

const numero = (v: string | undefined, min: number, max: number, defecto: number) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : defecto;
};

type Consulta = Record<"interes" | "fecha" | "adultos" | "ninos", string | undefined>;

export default async function Contacto({ searchParams }: { searchParams: Promise<Partial<Consulta>> }) {
  const { interes, fecha, adultos, ninos } = await searchParams;

  // Lo que llega del buscador del inicio se convierte en un mensaje ya escrito.
  let mensaje = "";
  let elegido: string | undefined;
  if (esPlan(interes)) {
    const plan = PLANES.find((p) => p.id === interes)!;
    elegido = interes === "membresia" ? "oro" : interes;
    mensaje = [
      `Quiero información para: ${plan.nombre} en San Ramón.`,
      esFecha(fecha) ? `Fecha: ${fechaLegible(fecha)}.` : "",
      personas(numero(adultos, 1, 10, 2), numero(ninos, 0, 9, 0)),
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <main className={styles.page}>
      <CabeceraPagina
        etiqueta="Contacto"
        titulo={
          <>
            Hablemos — <em>te ayudamos a planear</em>
          </>
        }
        texto="Membresías, cabañas, entradas por día o lotes: déjanos tus datos y un asesor te llamará."
        imagen={{
          src: "/assets/images/heroes/portico_familia.webp",
          alt: "Familia llegando al pórtico de Zagari Resort Club",
        }}
      />
      <ContactForm
        id="formulario"
        title="Prefiero que me llamen"
        lead="Un asesor te contactará en horario de oficina. No se realiza ningún pago en esta etapa."
        selectLabel="Me interesa"
        selectOptions={OPCIONES}
        selectValue={elegido}
        mensajeInicial={mensaje}
        submitLabel="Solicitar llamada"
        codigoFormulario="zagari_landing_reserva"
        nombreFormulario="Contacto y reservas — web"
        tipoFormulario={elegido === "lote" ? "lotes" : "contacto"}
        complemento={
          <div className={comun.panel}>
            <p className={comun.etiqueta}>Escríbenos</p>
            <p className={comun.intro}>WhatsApp y llamadas al {CLUB.telefono}.</p>
            <p>
              <a
                href={whatsapp(mensaje || "Hola Zagari Resort Club, quisiera recibir más información.")}
                className={comun.boton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escríbenos por WhatsApp
              </a>
            </p>
            <p className={comun.nota}>{CLUB.ubicacion}</p>
          </div>
        }
      />
    </main>
  );
}
