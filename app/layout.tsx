import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import "lenis/dist/lenis.css";
import "./globals.css";

import LandingNav from "./Components/Landing/LandingNav";
import LandingFooter from "./Components/Landing/LandingFooter";
import WhatsAppWidget from "./Components/WhatsAppWidget/WhatsAppWidget";
import BotonPropietario from "./Components/Sitio/BotonPropietario";
import ToastProvider from "./Components/ui/Toast/ToastProvider";
import SmoothScroll from "./Components/SmoothScroll/SmoothScroll";
import { SITIO, SITIO_URL, UBICACION } from "./lib/sitio";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: {
    default: SITIO.titulo,
    template: `%s | ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  keywords: [
    "Zagari Resort Club",
    "club privado San Ramón",
    "resort Chanchamayo",
    "Selva Central",
    "membresía club de campo",
    "piscina borde infinito San Ramón",
    "cabañas Chanchamayo",
    "Junín Perú",
  ],
  authors: [{ name: "MORO CAPITAL S.A.C." }],
  publisher: "MORO CAPITAL S.A.C.",
  category: "travel",
  alternates: { canonical: "/" },
  // iOS Safari convierte en enlace tel: los números largos (como el RUC del
  // pie) antes de que React hidrate, y el HTML deja de coincidir. Los
  // teléfonos que deben poder pulsarse ya son enlaces explícitos.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: SITIO.nombre,
    title: SITIO.titulo,
    description: SITIO.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: SITIO.titulo,
    description: SITIO.descripcion,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Etiquetas geográficas para buscadores locales.
  other: {
    "geo.region": UBICACION.region,
    "geo.placename": UBICACION.lugar,
    "geo.position": `${UBICACION.latitud};${UBICACION.longitud}`,
    ICBM: `${UBICACION.latitud}, ${UBICACION.longitud}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d6b47",
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
      lang="es-PE"
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

          <BotonPropietario />

          <WhatsAppWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
