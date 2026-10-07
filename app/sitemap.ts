import type { MetadataRoute } from "next";

import { SITIO_URL } from "./lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return [
    { url: `${SITIO_URL}/`, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO_URL}/promociones`, lastModified: ahora, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITIO_URL}/destinos`, lastModified: ahora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITIO_URL}/experiencias`, lastModified: ahora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITIO_URL}/membresias`, lastModified: ahora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITIO_URL}/lotes`, lastModified: ahora, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITIO_URL}/preguntas`, lastModified: ahora, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITIO_URL}/contacto`, lastModified: ahora, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITIO_URL}/terminos`, lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITIO_URL}/privacidad`, lastModified: ahora, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITIO_URL}/cookies`, lastModified: ahora, changeFrequency: "yearly", priority: 0.2 },
  ];
}
