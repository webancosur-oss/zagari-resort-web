import type { MetadataRoute } from "next";

import { SITIO_URL } from "./lib/sitio";

/**
 * Los rastreadores de buscadores con IA ya estarían permitidos por la regla
 * general; se nombran para dejar la intención explícita y poder excluir
 * alguno sin tocar el resto.
 */
const BUSCADORES_IA = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: BUSCADORES_IA, allow: "/" },
    ],
    sitemap: `${SITIO_URL}/sitemap.xml`,
    host: SITIO_URL,
  };
}
