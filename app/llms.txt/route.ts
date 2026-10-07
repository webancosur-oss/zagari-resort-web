import {
  ACCESOS,
  AVISO_MODELO,
  AVISO_TARIFAS,
  BENEFICIOS,
  CATEGORIAS,
  ENTRADAS,
  PREGUNTAS,
  PUNTOS,
  RESUMEN,
  SOCIO_FUNDADOR,
  soles,
} from "../lib/modelo";
import { REDES, SITIO, SITIO_URL, TELEFONO, UBICACION } from "../lib/sitio";

/**
 * /llms.txt: resumen en Markdown para motores de respuesta con IA.
 * Se genera desde los mismos datos que la página, así nunca se desincroniza.
 */
export const dynamic = "force-static";

// Los precios del modelo usan espacios no separables; aquí, texto plano.
const plano = (t: string) => t.replace(/ /g, " ");

export function GET() {
  const lineas = [
    `# ${SITIO.nombre}`,
    "",
    `> ${SITIO.descripcion}`,
    "",
    RESUMEN,
    "",
    "## Datos clave",
    "",
    `- Ubicación: ${UBICACION.calle}, ${UBICACION.lugar}`,
    `- Coordenadas: ${UBICACION.latitud}, ${UBICACION.longitud}`,
    `- Cómo llegar: ${UBICACION.mapa}`,
    `- Teléfono y WhatsApp: ${TELEFONO}`,
    `- Redes: ${REDES.join(", ")}`,
    "",
    "## Membresías",
    "",
    `Importante: ${AVISO_TARIFAS}. ${AVISO_MODELO}`,
    "",
    ...CATEGORIAS.map(
      (c) =>
        `- ${c.nombre} (${plano(soles(c.precio))} al año): ${c.queEs}. ${c.quienLaTiene} Ingreso: ${c.ingreso}. Cubre a: ${c.alcance}.`
    ),
    "",
    SOCIO_FUNDADOR,
    "",
    "## Beneficios por categoría (Plata / Oro / Platino)",
    "",
    ...BENEFICIOS.map((b) => `- ${b.servicio}: ${b.plata} / ${b.oro} / ${b.platino}`),
    "",
    "## Cómo se accede",
    "",
    ...ACCESOS.map((a) => `- ${a.quien}: ${a.comoEntra} ${a.conQueArranca}`),
    "",
    "## Entradas por día",
    "",
    `- Adulto: ${plano(soles(ENTRADAS.adulto.precio))} (${ENTRADAS.adulto.detalle})`,
    `- ${ENTRADAS.nino.detalle}: ${plano(soles(ENTRADAS.nino.precio))}. ${ENTRADAS.gratis}.`,
    `- ${ENTRADAS.regla}`,
    "",
    "## Puntos Zagari",
    "",
    PUNTOS.resumen,
    "",
    ...PUNTOS.ganar.map((g) => `- ${g.accion}: ${g.puntos} puntos`),
    "",
    "## Preguntas frecuentes",
    "",
    ...PREGUNTAS.flatMap((p) => [`### ${p.pregunta}`, "", plano(p.respuesta), ""]),
    "## Páginas",
    "",
    `- [Inicio](${SITIO_URL}/)`,
    `- [Membresías](${SITIO_URL}/#membresias)`,
    `- [Preguntas frecuentes](${SITIO_URL}/#preguntas)`,
    `- [Contacto](${SITIO_URL}/#contacto)`,
    `- [Términos y condiciones](${SITIO_URL}/terminos)`,
    `- [Política de privacidad](${SITIO_URL}/privacidad)`,
  ];

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
