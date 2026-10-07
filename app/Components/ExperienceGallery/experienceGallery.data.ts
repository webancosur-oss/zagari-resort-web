export interface GalleryItem {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

const A = "/assets/images/amenities";
const E = "/assets/images/experiences";
const C = "/assets/images/cabagnas";

export const EXCLUSIVE_EXPERIENCES: GalleryItem[] = [
  {
    image: `${A}/element-agua-bar-piscina.webp`,
    imageAlt:
      "Barra dentro de la piscina con bañistas y vista a las montañas",
    title: "Piscinas & Bar",
    description:
      "Sumérgete en aguas tranquilas con vista abierta al valle y disfruta de la barra dentro de la piscina.",
  },
  {
    image: `${A}/element-fuego-camping.webp`,
    imageAlt:
      "Zona de camping de noche con tiendas y fogata",
    title: "Camping Bajo las Estrellas",
    description:
      "Noches de fogata y cielo despejado en zonas acondicionadas para acampar en familia o entre amigos.",
  },
  {
    image: `${A}/element-tierra-tenis-muro-escalable.webp`,
    imageAlt:
      "Cancha de tenis junto al muro de escalada del club",
    title: "Tenis & Muro de Escalada",
    description:
      "Pon a prueba tu energía en nuestras canchas deportivas y pared de escalada. Diseñado para amantes del deporte y la adrenalina con vista panorámica a las montañas.",
  },
  {
    image: `${A}/element-tierra-restaurant.webp`,
    imageAlt:
      "Interior del restaurante de madera con comensales",
    title: "Gastronomía de Autor",
    description:
      "Una propuesta culinaria que combina producto local y técnica, para alargar la sobremesa sin prisa.",
  },
  {
    image: `${A}/element-fuego-zona-espiritual.webp`,
    imageAlt:
      "Zona espiritual con fogatas y estructura de techo de palma",
    title: "Zona Espiritual & Bienestar",
    description:
      "Un espacio de calma entre la vegetación para desconectar del ritmo de la ciudad.",
  },
  {
    image: `${A}/element-agua-lago.webp`,
    imageAlt:
      "Lago con puente de madera rodeado de jardines",
    title: "Lago & Senderos",
    description:
      "Recorridos entre vegetación nativa, espejos de agua y puentes para caminar sin prisa.",
  },
];

export const FAMILY_EXPERIENCES: GalleryItem[] = [
  {
    image: `${A}/element-tierra-portico.webp`,
    imageAlt:
      "Pórtico de entrada de Zagari Resort Club",
    title: "Bienvenida & Comunidad Zagari",
    description:
      "Forma parte de un club privado pensado para integrar a toda la familia en un entorno seguro, exclusivo y acogedor desde tu primera visita.",
  },
  {
    image: `${E}/experience7.webp`,
    imageAlt:
      "Celebración bajo toldo blanco con mesas y vista al valle",
    title: "Encuentros & Momentos Especiales",
    description:
      "Disfruta de espacios diseñados para la integración, reuniones y celebraciones con amigos y seres queridos en cualquier época del año.",
  },
  {
    image: `${A}/cabanias-alojamiento.webp`,
    imageAlt:
      "Cabañas de madera del club entre vegetación",
    title: "Cabañas & Alojamiento Familiar",
    description:
      "Confort y diseño arquitectónico en medio de la naturaleza. Cabañas totalmente equipadas para vivir escapadas de fin de semana acogedoras y confortables en familia.",
  },
  {
    image: `${A}/element-aire-mirador.webp`,
    imageAlt:
      "Torre mirador de madera sobre el bosque",
    title: "Miradores Panorámicos",
    description:
      "Contempla vistas espectaculares del valle desde nuestros miradores de altura, el escenario perfecto para capturar fotografías y recuerdos memorables.",
  },
  {
    image: `${A}/element-tierra-biohuerto-mandarina.webp`,
    imageAlt:
      "Biohuerto de mandarinas con visitante recolectando",
    title: "Biohuerto & Naturaleza",
    description:
      "Desconéctate de la rutina recorriendo senderos verdes, zonas arboladas y espejos de agua pensados para el descanso y esparcimiento de adultos y niños.",
  },
  {
    image: `${A}/element-agua-piscina-borde-infinito.webp`,
    imageAlt:
      "Piscina de borde infinito con palmeras y tumbonas",
    title: "Piscinas & Relax Familiar",
    description:
      "Amplias zonas acuáticas diseñadas para el disfrute seguro de toda la familia. El espacio ideal para refrescarse, tomar el sol y descansar en un clima privilegiado.",
  },
];

export const CLUB_HIGHLIGHTS: GalleryItem[] = [
  {
    image: `${A}/element-tierra-bar-restaurante.webp`,
    imageAlt: "Bar y sala de estar de madera con visitantes",
    title: "Restaurante & Bar",
    description:
      "Cocina de temporada y carta de bebidas con vista abierta al valle.",
  },
  {
    image: `${C}/cabagna1.jpeg`,
    imageAlt: "Cabaña negra de perfil triangular frente a las montañas",
    title: "Cabañas",
    description:
      "Alojamiento equipado para escapadas de fin de semana en familia.",
  },
  {
    image: `${C}/piscina-sunshine.jpeg`,
    imageAlt: "Piscina del club al atardecer",
    title: "Piscinas",
    description:
      "Zonas acuáticas para refrescarse, nadar y tomar el sol.",
  },
  {
    image: `${A}/element-fuego-zona-espiritual.webp`,
    imageAlt: "Zona espiritual con fogatas entre la vegetación",
    title: "Zona Espiritual",
    description:
      "Espacios de calma y encuentro alrededor del fuego.",
  },
  {
    image: `${A}/element-tierra-campo-futbol-voley.webp`,
    imageAlt: "Campo de fútbol y vóley del club",
    title: "Canchas Deportivas",
    description:
      "Fútbol, vóley, tenis y muro de escalada sin costo de reserva.",
  },
  {
    image: `${A}/element-tierra-minigolf.webp`,
    imageAlt: "Circuito de minigolf entre jardines",
    title: "Minigolf",
    description:
      "Un recorrido para jugar en familia entre la vegetación del club.",
  },
  {
    image: `${A}/element-fuego-camping.webp`,
    imageAlt: "Zona de camping iluminada por la fogata",
    title: "Zona de Camping",
    description:
      "Áreas acondicionadas para acampar bajo el cielo despejado.",
  },
  {
    image: `${A}/element-tierra-gym.webp`,
    imageAlt: "Gimnasio de suelo de madera abierto al paisaje",
    title: "Gym",
    description:
      "Equipamiento completo con vista abierta y acompañamiento de entrenador.",
  },
  {
    image: `${A}/element-aire-domo.webp`,
    imageAlt: "Domos de alojamiento entre la vegetación",
    title: "Domos",
    description:
      "Alojamiento singular para dormir rodeado de naturaleza.",
  },
];

export const CORPORATE_EVENTS: GalleryItem[] = [
  {
    image: `${E}/experience7.webp`,
    imageAlt: "Jornada bajo toldo blanco con mesas y vista al valle",
    title: "Espacios para Reuniones",
    description:
      "Montajes al aire libre con vista abierta, para sesiones de trabajo sin distracciones.",
  },
  {
    image: `${A}/element-tierra-restaurant.webp`,
    imageAlt: "Salón de madera del restaurante con mesas",
    title: "Convenciones & Juntas",
    description:
      "Salón cubierto para presentaciones, directorios y reuniones ampliadas.",
  },
  {
    image: `${A}/element-tierra-campo-futbol-voley.webp`,
    imageAlt: "Campo deportivo del club",
    title: "Integración de Equipos",
    description:
      "Actividades al aire libre pensadas para fortalecer la relación entre áreas y celebrar resultados.",
  },
  {
    image: `${E}/experience16.webp`,
    imageAlt: "Servicio de bebidas preparado para un evento",
    title: "Coffee Break & Catering",
    description:
      "Servicio de alimentos adaptado a la duración y el formato de cada jornada.",
  },
  {
    image: `${A}/cabanias-alojamiento.webp`,
    imageAlt: "Cabañas de madera del club",
    title: "Alojamiento para tu Equipo",
    description:
      "Cabañas dentro del club para jornadas de dos días sin desplazamientos.",
  },
  {
    image: `${A}/element-tierra-minigolf.webp`,
    imageAlt: "Circuito de minigolf del club",
    title: "Actividades al Aire Libre",
    description:
      "Minigolf, senderos y deportes para las pausas entre sesiones.",
  },
];

export const SOCIAL_EVENTS: GalleryItem[] = [
  {
    image: `${E}/experience7.webp`,
    imageAlt: "Celebración bajo toldo blanco con mesas servidas",
    title: "Celebraciones al Aire Libre",
    description:
      "Ceremonia y celebración al aire libre, con el valle y las montañas como escenario.",
  },
  {
    image: `${A}/element-tierra-restaurant.webp`,
    imageAlt: "Salón de madera preparado para un banquete",
    title: "Banquetes & Montajes",
    description:
      "Montajes a medida, desde mesas largas hasta formatos de cóctel, con decoración personalizada.",
  },
  {
    image: `${E}/experience16.webp`,
    imageAlt: "Copas servidas para un brindis",
    title: "Brindis & Aniversarios",
    description:
      "Cumpleaños, aniversarios y reuniones familiares con el servicio del club.",
  },
  {
    image: `${A}/element-fuego-zona-espiritual.webp`,
    imageAlt: "Zona espiritual con fogatas al anochecer",
    title: "Ceremonias & Ritos",
    description:
      "Un espacio recogido alrededor del fuego para celebraciones íntimas.",
  },
  {
    image: `${C}/piscina-sunshine.jpeg`,
    imageAlt: "Piscina del club durante el atardecer",
    title: "Atardeceres Inolvidables",
    description:
      "La hora dorada sobre el valle, el mejor momento para las fotografías de tu evento.",
  },
  {
    image: `${A}/cabanias-alojamiento.webp`,
    imageAlt: "Cabañas de madera para los invitados",
    title: "Alojamiento para Invitados",
    description:
      "Cabañas dentro del club para que nadie tenga que volver conduciendo.",
  },
];
