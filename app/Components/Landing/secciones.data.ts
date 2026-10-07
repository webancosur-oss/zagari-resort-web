const AMENITY = "/assets/images/amenities";
const EXP = "/assets/images/experiences";
const HERO = "/assets/images/heroes";
const CABANA = "/assets/images/cabagnas";

export const FOTO = {
  hero: `${EXP}/experience1.webp`,
  portico: `${HERO}/portico_familia.webp`,
  cabanas: `${CABANA}/cabagna1.jpeg`,
  cabanaNoche: `${HERO}/hero_cabagna.jpg`,
  cabanaFamilia: `${EXP}/experience17.webp`,
  piscina: `${CABANA}/piscina-sunshine.jpeg`,
  piscinaInfinita: `${AMENITY}/element-agua-piscina-borde-infinito.webp`,
  piscinaAtardecer: `${HERO}/zagari-hero.jpg`,
  barPiscina: `${EXP}/experience2.webp`,
  lago: `${AMENITY}/element-agua-lago.webp`,
  bienestar: `${AMENITY}/element-fuego-zona-espiritual.webp`,
  gimnasio: `${AMENITY}/element-tierra-gym.webp`,
  mesa: `${AMENITY}/element-tierra-restaurant.webp`,
  copas: `${EXP}/experience16.webp`,
  banquete: `${EXP}/experience7.webp`,
  celebracion: `${EXP}/experience6.webp`,
  sendero: `${HERO}/hero_image_sendero.jpg`,
  caminata: `${EXP}/portico.webp`,
  mirador: `${EXP}/mirador-mishasho.jpg`,
  domo: `${AMENITY}/element-aire-domo.webp`,
  biohuerto: `${AMENITY}/element-tierra-biohuerto-mandarina.webp`,
  deporte: `${AMENITY}/element-tierra-campo-futbol-voley.webp`,
  tenis: `${AMENITY}/element-tierra-tenis-muro-escalable.webp`,
  minigolf: `${AMENITY}/element-tierra-minigolf.webp`,
  camping: `${AMENITY}/element-fuego-camping.webp`,
  escultura: `${EXP}/experience10.webp`,
  letrero: `${EXP}/experience18.webp`,
  aerea: `${EXP}/experience9.webp`,
} as const;

export const VIDEO = {
  piscina: "/assets/video/herovideo-main.mp4",
  cabana: "/assets/video/herovideo-main.mp4",
} as const;

export const ESPACIOS = [
  { nombre: "Cabañas", detalle: "4 personas · Vista al valle", imagen: FOTO.cabanaNoche, alt: "Cabaña de arquitectura negra frente al valle" },
  { nombre: "Piscina de borde infinito", detalle: "Todo el año · Zona de tumbonas", imagen: FOTO.piscinaInfinita, alt: "Piscina de borde infinito sobre la montaña" },
  { nombre: "Bar húmedo", detalle: "Dentro del agua", imagen: FOTO.barPiscina, alt: "Bar dentro de la piscina bajo una pérgola" },
  { nombre: "Lago y puentes", detalle: "Recorrido de agua", imagen: FOTO.lago, alt: "Lago con puentes de madera entre vegetación" },
  { nombre: "Restaurante", detalle: "Cocina de temporada", imagen: FOTO.mesa, alt: "Restaurante del club abierto al valle" },
  { nombre: "Canchas deportivas", detalle: "Tenis · Muro de escalada", imagen: FOTO.tenis, alt: "Cancha de tenis junto al muro de escalada" },
  { nombre: "Zona de camping", detalle: "Fogata · Cielo abierto", imagen: FOTO.camping, alt: "Zona de camping con fogata al aire libre" },
  { nombre: "Miradores", detalle: "Vista al valle", imagen: FOTO.mirador, alt: "Mirador con telescopio sobre el valle" },
  { nombre: "Domo", detalle: "Elemento aire", imagen: FOTO.domo, alt: "Domo del club rodeado de vegetación" },
  { nombre: "Biohuerto", detalle: "Producto propio", imagen: FOTO.biohuerto, alt: "Biohuerto de mandarinas del club" },
  { nombre: "Minigolf", detalle: "Para toda la familia", imagen: FOTO.minigolf, alt: "Cancha de minigolf del club" },
  { nombre: "Gimnasio", detalle: "Equipado · Vista abierta", imagen: FOTO.gimnasio, alt: "Gimnasio del club con vista al exterior" },
] as const;
