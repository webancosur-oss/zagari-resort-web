"use client";

import { useState } from "react";

import ContactForm from "../ContactForm/ContactForm";
import { useToast } from "../ui/Toast/ToastProvider";

import MembershipTiers from "./MembershipTiers";
import { TIERS, type Tier } from "./membership.data";

export default function MembershipSection() {
  const [categoria, setCategoria] = useState("oro");

  const { mostrar } = useToast();

  const elegir = (tier: Tier) => {
    setCategoria(tier.id);

    mostrar("exito", tier.confirmacion);

    document
      .getElementById("formulario-registro")
      ?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  };

  return (
    <>
      <MembershipTiers
        tiers={TIERS}
        initial="oro"
        onElegir={elegir}
      />

      <ContactForm
        id="formulario-registro"
        title="Formulario de registro"
        lead="Déjanos tus datos y un asesor te contactará para explicarte las categorías y resolver tus dudas."
        selectLabel="Categoría de interés"
        selectOptions={TIERS.map((t) => ({
          value: t.id,
          label: t.name,
        }))}
        selectValue={categoria}
        codigoFormulario="zagari_membresias_niveles"
        nombreFormulario="Formulario niveles de membresía"
        tipoFormulario="promocion"
      />
    </>
  );
}
