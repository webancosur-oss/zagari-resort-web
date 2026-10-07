"use client";

import { Instagram, Location } from "reicon-react";

import ContactForm from "../ContactForm/ContactForm";
import { CLUB } from "../Landing/landing.data";
import { CATEGORIAS } from "../../lib/modelo";
import { useCategoria } from "./CategoriaElegida";

import styles from "./Contacto.module.css";

const OPCIONES = [
  ...CATEGORIAS.map((c) => ({ value: c.id, label: `Membresía ${c.nombre}` })),
  { value: "visita", label: "Conocer el club" },
  { value: "otro", label: "Otra consulta" },
];

function Enlaces() {
  return (
    <div className={styles.enlaces}>
      <a href={CLUB.whatsapp} className={styles.whatsapp} target="_blank" rel="noopener noreferrer">
        Escríbenos por WhatsApp
      </a>

      <ul className={styles.lista}>
        <li>
          <a href={CLUB.maps} target="_blank" rel="noopener noreferrer">
            <Location size={18} aria-hidden="true" />
            San Ramón, Chanchamayo · Selva Central
          </a>
        </li>
        <li>
          <a href={CLUB.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram size={18} aria-hidden="true" />
            Instagram
          </a>
        </li>
        <li>
          <a href={CLUB.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </li>
        <li>
          <a href={CLUB.tiktok} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function Contacto() {
  const { categoria } = useCategoria();

  return (
    <ContactForm
      id="contacto"
      title="Hazte socio de lo natural"
      lead="Déjanos tus datos y un asesor te contactará para contarte cómo empezar. No se realiza ningún pago en esta etapa."
      selectLabel="Me interesa"
      selectOptions={OPCIONES}
      selectValue={categoria || undefined}
      submitLabel="Solicitar información"
      codigoFormulario="zagari_landing_reserva"
      nombreFormulario="Reserva de visita — landing"
      tipoFormulario="contacto"
      complemento={<Enlaces />}
    />
  );
}
