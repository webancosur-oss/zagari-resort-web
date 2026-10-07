import { EMPRESA } from "../../legal/empresa";
import { PREGUNTAS } from "../../lib/modelo";
import { REDES, SITIO, SITIO_URL, TELEFONO, UBICACION } from "../../lib/sitio";

// Solo las instalaciones que declara el sitio oficial zagari.pe. Los precios
// quedan fuera: son tarifas propuestas y se mostrarían como ofertas vigentes.
const INSTALACIONES = [
  "Piscina con borde infinito",
  "Biohuerto",
  "Mirador",
  "Zona espiritual",
  "Campo de fútbol y vóley",
];

const id = (fragmento: string) => `${SITIO_URL}/#${fragmento}`;

const grafo = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": id("empresa"),
      name: EMPRESA.razonSocial,
      legalName: EMPRESA.razonSocial,
      taxID: EMPRESA.ruc,
      url: SITIO_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: EMPRESA.domicilioFiscal,
        addressCountry: UBICACION.pais,
      },
    },
    {
      "@type": "Resort",
      "@id": id("club"),
      name: SITIO.nombre,
      description: SITIO.descripcion,
      slogan: "Nacimos para vivir más cerca de lo natural",
      url: SITIO_URL,
      logo: `${SITIO_URL}/assets/logo/zagari-logo-dark.svg`,
      image: [
        `${SITIO_URL}/assets/images/heroes/hero-tiger-poster.jpg`,
        `${SITIO_URL}/assets/images/experiences/mirador-mishasho.jpg`,
        `${SITIO_URL}/assets/images/experiences/experience1.webp`,
      ],
      telephone: TELEFONO,
      address: {
        "@type": "PostalAddress",
        streetAddress: UBICACION.calle,
        addressLocality: UBICACION.localidad,
        addressRegion: UBICACION.departamento,
        addressCountry: UBICACION.pais,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: UBICACION.latitud,
        longitude: UBICACION.longitud,
      },
      hasMap: UBICACION.mapa,
      sameAs: REDES,
      amenityFeature: INSTALACIONES.map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
      parentOrganization: { "@id": id("empresa") },
    },
    {
      "@type": "WebSite",
      "@id": id("web"),
      url: SITIO_URL,
      name: SITIO.nombre,
      inLanguage: SITIO.idioma,
      publisher: { "@id": id("empresa") },
      about: { "@id": id("club") },
    },
    {
      "@type": "WebPage",
      "@id": id("inicio"),
      url: `${SITIO_URL}/`,
      name: SITIO.titulo,
      description: SITIO.descripcion,
      inLanguage: SITIO.idioma,
      isPartOf: { "@id": id("web") },
      about: { "@id": id("club") },
      primaryImageOfPage: `${SITIO_URL}/assets/images/heroes/zagari-hero.jpg`,
    },
  ],
};

const preguntas = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": id("preguntas"),
  url: `${SITIO_URL}/preguntas`,
  inLanguage: SITIO.idioma,
  isPartOf: { "@id": id("web") },
  mainEntity: PREGUNTAS.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

function JsonLd({ datos }: { datos: object }) {
  return (
    <script
      type="application/ld+json"
      // Se escapa "<" para que ningún texto pueda cerrar la etiqueta <script>.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** JSON-LD de la portada para buscadores y motores de respuesta con IA. */
export default function DatosEstructurados() {
  return <JsonLd datos={grafo} />;
}

/** FAQPage: va en /preguntas, donde las preguntas son visibles. */
export function DatosPreguntas() {
  return <JsonLd datos={preguntas} />;
}
