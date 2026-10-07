import type { MetadataRoute } from "next";

import { SITIO } from "./lib/sitio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITIO.nombre,
    short_name: "Zagari",
    description: SITIO.descripcion,
    lang: SITIO.idioma,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d6b47",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
