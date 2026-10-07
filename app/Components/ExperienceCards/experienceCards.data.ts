export interface ExperienceCard {
  image: string;
  imageAlt: string;

  category: string;

  description: string;

  imagePosition?: string;
}

const A = "/assets/images/amenities";

export const EXPERIENCE_CARDS: ExperienceCard[] = [
  {
    image: `${A}/element-agua-bar-piscina.webp`,
    imageAlt:
      "Barra dentro de la piscina con bañistas y vista a las montañas",
    category: "PISCINA & BAR",
    description:
      "Relájate y disfruta de momentos únicos rodeado de naturaleza.",
  },
  {
    image: `${A}/element-agua-piscina-borde-infinito.webp`,
    imageAlt:
      "Piscina de borde infinito con palmeras y tumbonas",
    category: "BORDE INFINITO",
    description:
      "Nada mirando al valle, con el horizonte como único límite.",
  },
  {
    image: `${A}/element-agua-lago.webp`,
    imageAlt:
      "Lago con puente de madera rodeado de jardines",
    category: "LAGO & PUENTES",
    description:
      "Espejos de agua y senderos para caminar sin prisa.",
  },

  {
    image: `${A}/element-aire-mirador.webp`,
    imageAlt: "Torre mirador de madera sobre el bosque",
    category: "MIRADOR",
    description:
      "Vistas panorámicas del valle desde lo alto del bosque.",
  },
  {
    image: `${A}/element-aire-domo.webp`,
    imageAlt: "Domos de alojamiento entre la vegetación",
    category: "DOMOS",
    description:
      "Dormir rodeado de naturaleza, bajo un cielo despejado.",
  },

  {
    image: `${A}/element-fuego-camping.webp`,
    imageAlt:
      "Zona de camping de noche con tiendas y fogata",
    category: "CAMPING",
    description:
      "Noches de fogata en zonas acondicionadas para acampar.",
  },
  {
    image: `${A}/element-fuego-zona-espiritual.webp`,
    imageAlt:
      "Zona espiritual con fogatas y estructura de techo de palma",
    category: "ZONA ESPIRITUAL",
    description:
      "Un espacio de calma para reconectar contigo mismo.",
  },

  {
    image: `${A}/element-tierra-restaurant.webp`,
    imageAlt:
      "Interior del restaurante de madera con comensales",
    category: "GASTRONOMÍA",
    description:
      "Sabores y momentos para disfrutar cada visita.",
  },
  {
    image: `${A}/element-tierra-bar-restaurante.webp`,
    imageAlt:
      "Bar y sala de estar de madera con visitantes",
    category: "BAR & LOUNGE",
    description:
      "Carta de bebidas y sobremesa con vista abierta al valle.",
  },
  {
    image: `${A}/element-tierra-tenis-muro-escalable.webp`,
    imageAlt:
      "Cancha de tenis junto al muro de escalada del club",
    category: "TENIS & ESCALADA",
    description:
      "Deporte y adrenalina con vista panorámica a las montañas.",
  },
  {
    image: `${A}/element-tierra-campo-futbol-voley.webp`,
    imageAlt: "Campo de fútbol y vóley del club",
    category: "FÚTBOL & VÓLEY",
    description:
      "Campo abierto para jugar en equipo a cualquier hora.",
  },
  {
    image: `${A}/element-tierra-gym.webp`,
    imageAlt:
      "Gimnasio de suelo de madera abierto al paisaje",
    category: "GYM",
    description:
      "Equipamiento completo con acompañamiento de entrenador.",
  },
  {
    image: `${A}/element-tierra-minigolf.webp`,
    imageAlt: "Circuito de minigolf entre jardines",
    category: "MINIGOLF",
    description:
      "Un recorrido para jugar en familia entre la vegetación.",
  },
  {
    image: `${A}/element-tierra-biohuerto-mandarina.webp`,
    imageAlt:
      "Biohuerto de mandarinas con visitante recolectando",
    category: "BIOHUERTO",
    description:
      "Recoge mandarinas y conoce de dónde viene lo que comes.",
  },
  {
    image: `${A}/cabanias-alojamiento.webp`,
    imageAlt:
      "Cabañas de madera del club entre la vegetación",
    category: "CABAÑAS",
    description:
      "Confort y diseño en medio de la naturaleza.",
  },
];
