export type BenefitIcon =
  | "Calendar"
  | "Profile2user"
  | "Reserve"
  | "Star"
  | "House"
  | "Dumbbell"
  | "Health"
  | "Tennis";

export interface Benefit {
  icon: BenefitIcon;
  title: string;
  detail: string;
}

export interface Tier {
  id: string;
  name: string;
  tagline: string;

  cta: string;

  confirmacion: string;
  tone: "plata" | "oro" | "platino";
  benefits: Benefit[];
}

// Valores de la sección 6 del "Modelo de negocio v2.0". Fuente común: app/lib/modelo.ts.
export const ORO_BENEFITS: Benefit[] = [
  { icon: "Calendar", title: "Ingreso", detail: "todos los días" },
  { icon: "Profile2user", title: "6 invitados", detail: "sin costo al año" },
  { icon: "Reserve", title: "10% de descuento", detail: "en restaurante, bar y market" },
  { icon: "Star", title: "Zona preferencial", detail: "en eventos del club" },
  { icon: "House", title: "25% de descuento", detail: "en cabañas" },
  { icon: "Dumbbell", title: "Gym y muro de escalada", detail: "con entrenador" },
  { icon: "Health", title: "15% de descuento", detail: "en spa" },
  { icon: "Tennis", title: "Canchas", detail: "reserva sin costo, día y noche" },
];

export const TIERS: Tier[] = [
  {
    id: "plata",
    name: "Plata",
    tagline: "La membresía de entrada",
    cta: "Empezar en Plata",
    confirmacion:
      "Plata seleccionada. Completa el formulario y te contamos cómo empezar.",
    tone: "plata",
    benefits: [
      { icon: "Calendar", title: "Ingreso", detail: "viernes, sábado, domingo y feriados" },
      { icon: "Profile2user", title: "2 invitados", detail: "sin costo al año" },
      { icon: "Reserve", title: "Precio de carta", detail: "en restaurante, bar y market" },
      { icon: "Star", title: "Entrada general", detail: "en eventos del club" },
      { icon: "House", title: "10% de descuento", detail: "en cabañas" },
      { icon: "Dumbbell", title: "Gym y muro de escalada", detail: "incluido" },
      { icon: "Health", title: "Spa", detail: "precio de carta" },
      { icon: "Tennis", title: "Canchas", detail: "con reserva; paga la luz de noche" },
    ],
  },
  {
    id: "oro",
    name: "Oro",
    tagline: "El socio frecuente, el que hace vivir el club",
    cta: "Quiero ser Oro",
    confirmacion:
      "Oro seleccionada, la categoría más elegida. Déjanos tus datos y te llamamos.",
    tone: "oro",
    benefits: ORO_BENEFITS,
  },
  {
    id: "platino",
    name: "Platino",
    tagline: "Distinción. No se compra en puerta",
    cta: "Aspiro a Platino",
    confirmacion:
      "Platino seleccionada. Un asesor te explicará cómo se accede por invitación.",
    tone: "platino",
    benefits: [
      { icon: "Calendar", title: "Ingreso preferente", detail: "todos los días, con estacionamiento asistido" },
      { icon: "Profile2user", title: "12 invitados", detail: "sin costo al año" },
      { icon: "Reserve", title: "20% de descuento", detail: "en restaurante, bar y market" },
      { icon: "Star", title: "Zona exclusiva", detail: "en eventos del club" },
      { icon: "House", title: "40% de descuento", detail: "en cabañas, con salida tardía" },
      { icon: "Dumbbell", title: "Gym y muro de escalada", detail: "con entrenador personal" },
      { icon: "Health", title: "Un masaje al mes", detail: "sin costo en el spa" },
      { icon: "Tennis", title: "Canchas", detail: "sin costo y prioridad en los mejores horarios" },
    ],
  },
];

export interface OwnerHighlight {
  icon: BenefitIcon;
  title: string;
  detail: string;
}

export const OWNER_HIGHLIGHTS: OwnerHighlight[] = [
  {
    icon: "Calendar",
    title: "Primer año",
    detail: "sin costo",
  },
  {
    icon: "Star",
    title: "30% de descuento",
    detail: "permanente al renovar la membresía",
  },
  {
    icon: "Profile2user",
    title: "Socio fundador",
    detail:
      "un reconocimiento exclusivo para quienes confían en el proyecto desde el inicio",
  },
];
