import type { Metadata } from "next";

import { openGraphDe } from "../lib/sitio";

import LegalPage from "../legal/LegalPage";
import { EMPRESA } from "../legal/empresa";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata Zagari Resort Club los datos personales recogidos a través de su sitio web, conforme a la Ley N.° 29733.",
  alternates: { canonical: "/privacidad" },
  openGraph: openGraphDe(
    "/privacidad",
    "Política de privacidad",
    "Cómo trata Zagari Resort Club los datos personales recogidos a través de su sitio web, conforme a la Ley N.° 29733."
  ),
};

export default function Privacidad() {
  return (
    <LegalPage
      title="Política de privacidad"
      intro={`Esta política explica qué datos recogemos a través del sitio de ${EMPRESA.marca}, para qué los usamos y qué derechos tienes sobre ellos.`}
    >
      <h2>1. Responsable del tratamiento</h2>
      <p>
        <strong>{EMPRESA.razonSocial}</strong>, con RUC{" "}
        {EMPRESA.ruc} y domicilio fiscal en{" "}
        {EMPRESA.domicilioFiscal}, es responsable del banco
        de datos personales generado desde este sitio.
      </p>

      <h2>2. Qué datos recogemos</h2>
      <p>
        Únicamente los que nos facilitas en los formularios
        de contacto y en el asistente de WhatsApp:
      </p>
      <ul>
        <li>Nombres y apellidos</li>
        <li>Número de teléfono</li>
        <li>Correo electrónico</li>
        <li>DNI, cuando lo solicitamos para la gestión comercial</li>
        <li>El mensaje o consulta que escribas</li>
      </ul>
      <p>
        Junto al envío se registra información técnica de
        origen —página desde la que escribes y parámetros de
        campaña— para saber por qué canal nos has conocido.
      </p>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Responder a tu consulta y darte información del proyecto.</li>
        <li>Preparar propuestas de membresía o de eventos.</li>
        <li>Gestionar el seguimiento comercial a través de nuestro CRM.</li>
        <li>Enviarte novedades del club, si te has suscrito.</li>
      </ul>
      <p>
        <strong>No vendemos tus datos</strong> ni los
        cedemos a terceros con fines publicitarios.
      </p>

      <h2>4. Base legal</h2>
      <p>
        El tratamiento se basa en tu consentimiento, que
        otorgas al enviar el formulario, conforme a la{" "}
        <strong>Ley N.° 29733</strong> de Protección de
        Datos Personales y su reglamento. Puedes retirarlo
        en cualquier momento.
      </p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <p>
        Mientras dure la gestión comercial y, después,
        durante el plazo necesario para atender
        responsabilidades legales. Si pides la supresión,
        los eliminamos salvo que exista obligación de
        conservarlos.
      </p>

      <h2>6. Encargados de tratamiento</h2>
      <p>
        Trabajamos con proveedores que acceden a los datos
        solo para prestarnos servicio: alojamiento del sitio,
        la API que registra los envíos y el CRM comercial.
        Todos están obligados a tratarlos con la misma
        confidencialidad.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación,
        cancelación y oposición escribiéndonos al{" "}
        <strong>{EMPRESA.telefono}</strong>. Si consideras
        que no hemos atendido tu solicitud, puedes acudir a
        la Autoridad Nacional de Protección de Datos
        Personales.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas
        razonables para proteger tus datos. El sitio se
        sirve siempre por conexión cifrada.
      </p>

      <h2>9. Cookies</h2>
      <p>
        El uso de cookies se detalla en la{" "}
        <a href="/cookies">política de cookies</a>.
      </p>
    </LegalPage>
  );
}
