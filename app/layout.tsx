import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import "lenis/dist/lenis.css";
import "./globals.css";

import LandingNav from "./Components/Landing/LandingNav";
import LandingFooter from "./Components/Landing/LandingFooter";
import WhatsAppWidget from "./Components/WhatsAppWidget/WhatsAppWidget";
import ToastProvider from "./Components/ui/Toast/ToastProvider";
import SmoothScroll from "./Components/SmoothScroll/SmoothScroll";

const cuerpo = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Titulares: grotesca compacta, como la referencia de diseño. Es variable.
const display = Inter_Tight({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

/**
 * Se ejecuta antes del primer pintado: marca el documento para que las
 * secciones declaren su estado inicial oculto en CSS sin riesgo de destello.
 * Si el JS no corre, la clase nunca se añade y todo se ve. No se retira nunca:
 * hay secciones cuyo layout de coreografía cuelga de ella, y quitarla con la
 * página ya animada desarma esas secciones y deja contenido invisible.
 */
const MARCA_MOVIMIENTO = `(function(){try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")}catch(e){}})()`;

const TITULO = "Zagari Resort Club · Membresías en San Ramón, Selva Central";
const DESCRIPCION =
  "Club privado de naturaleza, descanso y experiencias en San Ramón, Chanchamayo. Membresías propuestas Plata, Oro y Platino, sus beneficios y los Puntos Zagari.";

// Sin canonical ni imagen OG hasta tener la URL pública: ambas la necesitan.
export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    type: "website",
    locale: "es_PE",
    siteName: "Zagari Resort Club",
  },
  twitter: {
    card: "summary",
    title: TITULO,
    description: DESCRIPCION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // MARCA_MOVIMIENTO añade "motion" a <html> antes de hidratar: la
    // diferencia de className es intencionada. Solo afecta a este elemento.
    <html
      lang="es"
      className={`${cuerpo.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARCA_MOVIMIENTO }} />
      </head>
      <body>
        <SmoothScroll />

        <ToastProvider>
          <LandingNav />

          {children}

          <LandingFooter />

          <WhatsAppWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
