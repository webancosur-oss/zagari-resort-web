import type { Metadata } from "next";

import { openGraphDe } from "../lib/sitio";

import LegalPage from "../legal/LegalPage";
import { EMPRESA } from "../legal/empresa";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Qué cookies utiliza el sitio de Zagari Resort Club y cómo gestionarlas.",
  alternates: { canonical: "/cookies" },
  openGraph: openGraphDe(
    "/cookies",
    "Política de cookies",
    "Qué cookies utiliza el sitio de Zagari Resort Club y cómo gestionarlas."
  ),
};

export default function Cookies() {
  return (
    <LegalPage
      title="Política de cookies"
      intro={`Qué almacena el sitio de ${EMPRESA.marca} en tu navegador y cómo puedes controlarlo.`}
    >
      <h2>1. Qué son</h2>
      <p>
        Las cookies son pequeños archivos que un sitio
        guarda en tu navegador para recordar información
        entre visitas.
      </p>

      <h2>2. Qué usamos en este sitio</h2>
      <p>
        Hoy este sitio{" "}
        <strong>no instala cookies de analítica,
        publicidad ni seguimiento</strong>. No hay píxeles
        de terceros ni perfiles publicitarios.
      </p>
      <p>
        Lo único que puede almacenarse es lo estrictamente
        necesario para que la web funcione:
      </p>
      <ul>
        <li>
          <strong>Técnicas</strong>: datos temporales que
          el navegador mantiene durante tu visita para
          servir las páginas correctamente.
        </li>
      </ul>
      <p>
        Estas no requieren consentimiento porque sin ellas
        el sitio no puede prestarse.
      </p>

      <h2>3. Servicios de terceros</h2>
      <p>
        Al pulsar el botón de WhatsApp sales de este sitio y
        pasas a un servicio de terceros, con sus propias
        condiciones y cookies. Lo mismo ocurre con el enlace
        a Google Maps y con los perfiles de Instagram,
        Facebook y TikTok.
      </p>

      <h2>4. Si esto cambia</h2>
      <p>
        Si en el futuro incorporamos analítica o píxeles de
        campaña, actualizaremos esta página y solicitaremos
        tu consentimiento antes de activarlos.
      </p>

      <h2>5. Cómo controlarlas</h2>
      <p>
        Puedes borrar o bloquear cookies desde la
        configuración de tu navegador. Ten en cuenta que
        bloquear las técnicas puede impedir que algunas
        partes del sitio funcionen.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para cualquier duda escríbenos al{" "}
        <strong>{EMPRESA.telefono}</strong> o consulta la{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>
    </LegalPage>
  );
}
