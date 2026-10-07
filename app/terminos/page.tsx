import type { Metadata } from "next";

import LegalPage from "../legal/LegalPage";
import { EMPRESA } from "../legal/empresa";

export const metadata: Metadata = {
  title: "Términos y condiciones | Zagari Resort Club",
  description:
    "Condiciones de uso del sitio web y de las membresías de Zagari Resort Club, operado por MORO CAPITAL S.A.C.",
};

export default function Terminos() {
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={`Estas condiciones regulan el uso del sitio web de ${EMPRESA.marca} y la contratación de sus membresías.`}
    >
      <h2>1. Quiénes somos</h2>
      <p>
        {EMPRESA.marca} es un proyecto de{" "}
        <strong>{EMPRESA.razonSocial}</strong>, con RUC{" "}
        {EMPRESA.ruc} y domicilio fiscal en{" "}
        {EMPRESA.domicilioFiscal}. El club está ubicado en{" "}
        {EMPRESA.ubicacionProyecto}.
      </p>

      <h2>2. Uso del sitio web</h2>
      <p>
        El contenido de este sitio —textos, fotografías,
        renders, logotipos y vídeos— es propiedad de{" "}
        {EMPRESA.razonSocial} o se usa con autorización. No
        está permitido reproducirlo con fines comerciales
        sin consentimiento previo por escrito.
      </p>
      <p>
        Las imágenes de instalaciones en proyecto son
        representaciones referenciales. El acabado final
        puede variar.
      </p>

      <h2>3. Membresías</h2>
      <ul>
        <li>
          Las categorías <strong>Plata</strong>,{" "}
          <strong>Oro</strong> y <strong>Platino</strong>{" "}
          otorgan los beneficios descritos en este sitio,
          vigentes al momento de la contratación.
        </li>
        <li>
          La membresía es <strong>personal</strong>. El
          ingreso de invitados se rige por el cupo anual de
          cada categoría.
        </li>
        <li>
          Los descuentos en restaurante, cabañas, spa y
          demás servicios no son acumulables con otras
          promociones salvo indicación expresa.
        </li>
        <li>
          El uso de canchas, cabañas y espacios para eventos
          está sujeto a <strong>disponibilidad</strong> y
          puede requerir reserva previa.
        </li>
        <li>
          {EMPRESA.razonSocial} puede modificar los
          beneficios comunicándolo con antelación razonable
          a los socios.
        </li>
      </ul>

      <h2>4. Propietarios</h2>
      <p>
        Los propietarios de lote en el proyecto acceden a la
        membresía Oro sin costo durante el primer año y a
        los beneficios indicados en la sección
        correspondiente, según lo pactado en su contrato de
        compraventa, que prevalece sobre este resumen.
      </p>

      <h2>5. Reservas y eventos</h2>
      <p>
        Las solicitudes de reuniones y eventos se confirman
        por escrito tras la aceptación de la propuesta
        económica. Las condiciones de pago, anticipos y
        cancelaciones se detallan en cada propuesta.
      </p>

      <h2>6. Normas de convivencia</h2>
      <ul>
        <li>
          El club se reserva el derecho de admisión ante
          conductas que afecten la seguridad o la
          tranquilidad de los demás visitantes.
        </li>
        <li>
          Los menores de edad deben estar acompañados por un
          adulto responsable, especialmente en zonas
          acuáticas y deportivas.
        </li>
        <li>
          Es obligatorio respetar la señalización y las
          indicaciones del personal.
        </li>
      </ul>

      <h2>7. Formularios de contacto</h2>
      <p>
        Al enviar un formulario, el usuario declara que los
        datos facilitados son veraces y autoriza su
        tratamiento según la{" "}
        <a href="/privacidad">política de privacidad</a>.
      </p>

      <h2>8. Modificaciones</h2>
      <p>
        Estas condiciones pueden actualizarse. La versión
        vigente es la publicada en esta página, con su fecha
        de última actualización.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para cualquier consulta sobre estas condiciones
        puedes escribirnos al <strong>{EMPRESA.telefono}</strong>.
      </p>
    </LegalPage>
  );
}
