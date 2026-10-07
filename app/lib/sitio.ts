import { CLUB } from "../Components/Landing/landing.data";
import { EMPRESA } from "../legal/empresa";

/**
 * URL pública del sitio. Sobrescribible con NEXT_PUBLIC_SITE_URL para
 * entornos de prueba; sin barra final.
 */
export const SITIO_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zagari.pe").replace(/\/$/, "");

export const SITIO = {
  nombre: EMPRESA.marca,
  titulo: "Zagari Resort Club · Club privado en San Ramón, Selva Central",
  descripcion:
    "Club privado de naturaleza, descanso y experiencias en San Ramón, Chanchamayo (Selva Central, Perú). Membresías Plata, Oro y Platino, Puntos Zagari y entradas por día.",
  idioma: "es-PE",
} as const;

/** Punto de destino de la ruta: la ubicación del club. */
export const UBICACION = {
  latitud: -11.152339,
  longitud: -75.389305,
  region: "PE-JUN",
  lugar: "San Ramón, Chanchamayo, Junín, Perú",
  calle: "Sector San Jacinto y Chincana, parcela 27",
  localidad: "San Ramón",
  provincia: "Chanchamayo",
  departamento: "Junín",
  pais: "PE",
  mapa: CLUB.maps,
} as const;

export const REDES = [CLUB.instagram, CLUB.facebook, CLUB.tiktok];

export const TELEFONO = `+${EMPRESA.telefonoE164}`;

/** Imagen social de app/opengraph-image.jpg, para las rutas que la heredan. */
const IMAGEN_SOCIAL = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Escultura del jaguar sobre la roca junto al monolito de Zagari Resort Club, con el titular «Más cerca de lo natural»",
};

/**
 * Open Graph completo de una ruta. El de una página reemplaza entero al del
 * layout, incluida la imagen del archivo opengraph-image, así que va aquí.
 */
export function openGraphDe(ruta: string, titulo: string, descripcion: string) {
  return {
    type: "website" as const,
    locale: "es_PE",
    url: ruta,
    siteName: SITIO.nombre,
    title: `${titulo} | ${SITIO.nombre}`,
    description: descripcion,
    images: [IMAGEN_SOCIAL],
  };
}

/** Metadatos de una página interna: título, descripción, canónica y Open Graph. */
export function metadatosDe(ruta: string, titulo: string, descripcion: string) {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: openGraphDe(ruta, titulo, descripcion),
  };
}
