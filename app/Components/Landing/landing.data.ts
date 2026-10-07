export const CLUB = {
  marca: "Zagari Resort Club",
  razonSocial: "MORO CAPITAL S.A.C.",
  ruc: "20606690526",
  domicilioFiscal: "Av. San Carlos N.° 1481",
  telefono: "971 069 763",
  ubicacion:
    "Sector San Jacinto y Chincana, parcela 27, San Ramón, Chanchamayo, Junín",
  maps: "https://maps.app.goo.gl/p8EkgxDp4M3pmgkv5",
  whatsapp:
    "https://wa.me/51971069763?text=Hola%20Zagari%20Resort%20Club%2C%20quisiera%20recibir%20m%C3%A1s%20informaci%C3%B3n.",
  instagram: "https://www.instagram.com/zagariresortclub/",
  facebook: "https://www.facebook.com/zagariresortclub",
  tiktok: "https://www.tiktok.com/@zagariresortclub",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Membresías", href: "/#membresias" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Experiencias", href: "/#experiencias" },
  { label: "Tu visita", href: "/#visita" },
  { label: "Preguntas", href: "/#preguntas" },
];

const A = "/assets/images/amenities";
const E = "/assets/images/experiences";
const C = "/assets/images/cabagnas";

export const PAQUETES = [
  {
    titulo: "Experiencias exclusivas",
    texto:
      "Piscinas, gastronomía de autor, spa y deporte con vista abierta al valle.",
    imagen: `${A}/element-agua-bar-piscina.webp`,
    alt: "Barra dentro de la piscina con vista a las montañas",
    etiquetas: ["Piscinas", "Gastronomía"],
  },
  {
    titulo: "Experiencia familiar",
    texto:
      "Cabañas, miradores, biohuerto y senderos pensados para toda la familia.",
    imagen: `${A}/cabanias-alojamiento.webp`,
    alt: "Cabañas de madera del club entre la vegetación",
    etiquetas: ["Cabañas", "Naturaleza"],
  },
  {
    titulo: "Reuniones y eventos",
    texto:
      "Bodas, celebraciones y jornadas de empresa con montaje a medida.",
    imagen: `${E}/experience7.webp`,
    alt: "Celebración bajo toldo blanco con vista al valle",
    etiquetas: ["Sociales", "Corporativos"],
  },
] as const;

export const GALERIA = [
  { src: `${A}/element-agua-piscina-borde-infinito.webp`, alt: "Piscina de borde infinito con palmeras", clase: "alta" },
  { src: `${A}/element-aire-mirador.webp`, alt: "Torre mirador de madera sobre el bosque", clase: "normal" },
  { src: `${A}/element-fuego-camping.webp`, alt: "Zona de camping de noche con fogata", clase: "normal" },
  { src: `${A}/element-tierra-restaurant.webp`, alt: "Salón del restaurante de madera", clase: "ancha" },
  { src: `${E}/experience9.webp`, alt: "Vista aérea de la piscina y los espacios del club", clase: "normal" },
  { src: `${C}/piscina-sunshine.jpeg`, alt: "Piscina del club al atardecer", clase: "normal" },
] as const;

export interface Nivel {
  nombre: string;
  tono: "plata" | "oro" | "platino";
  resumen: string;
  puntos: string[];
  destacado?: boolean;
}

export const NIVELES: Nivel[] = [
  {
    nombre: "Plata",
    tono: "plata",
    resumen: "Ingreso de lunes a viernes, 2 invitados al año y descuentos de bienvenida.",
    puntos: ["Ingreso L-V", "2 invitados", "5% en restaurante", "Gym incluido"],
  },
  {
    nombre: "Oro",
    tono: "oro",
    resumen: "La más elegida: ingreso todos los días y descuentos en todo el club.",
    puntos: ["Ingreso diario", "6 invitados", "10% en restaurante", "25% en cabañas"],
    destacado: true,
  },
  {
    nombre: "Platino",
    tono: "platino",
    resumen: "Acceso sin restricción, zona preferencial y los mayores descuentos.",
    puntos: ["Ingreso sin límite", "12 invitados", "20% en restaurante", "35% en cabañas"],
  },
];
