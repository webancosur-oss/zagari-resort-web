import {
  ACCESOS,
  AVISO_MODELO,
  BENEFICIOS,
  CATEGORIAS,
  ENTRADAS,
  PREGUNTAS,
  PUNTOS,
  RESUMEN,
  SOCIO_FUNDADOR,
} from "../lib/modelo";
import { REDES, SITIO, SITIO_URL, TELEFONO, UBICACION } from "../lib/sitio";
import { AMENIDADES, CERCANOS, DESTINOS, LOTES, CAPITULOS, TIPOS_CABANA } from "../lib/contenido";

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
    `Importante: ${AVISO_MODELO}`,
    "",
    ...CATEGORIAS.map(
      (c) =>
        `- ${c.nombre}: ${c.queEs}. ${c.quienLaTiene} Ingreso: ${c.ingreso}. Cubre a: ${c.alcance}.`
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
    `- ${ENTRADAS.adulto.detalle}. ${ENTRADAS.gratis}.`,
    `- ${ENTRADAS.regla}`,
    "",
    "## Lotes (II etapa, preventa)",
    "",
    `- ${LOTES.resumen}`,
    `- Área: desde ${LOTES.area.desde} hasta ${LOTES.area.hasta} m².`,
    ...LOTES.ventajas.map((v) => `- ${v.titulo}: ${v.texto}`),
    `- ${LOTES.alquiler}`,
    "",
    "## Promociones",
    "",
    ...CAPITULOS.flatMap((c) => c.grupos.map((g) => `- ${c.titulo}, ${g.titulo}: ${g.items.join(" ")}`)),
    "",
    "## Tipos de cabaña",
    "",
    ...TIPOS_CABANA.map((t) => `- ${t.nombre}: ${t.area} m², ${t.pisos} ${t.pisos === 1 ? "piso" : "pisos"}, ${t.habitaciones} ${t.habitaciones === 1 ? "habitación" : "habitaciones"}. ${t.resumen}`),
    "",
    "## Destinos",
    "",
    ...DESTINOS.map((d) => `- ${d.nombre} (${d.region})${d.estado === "proximamente" ? ", próximamente" : ""}: ${d.resumen}`),
    "",
    "## Amenidades",
    "",
    AMENIDADES.join(", ") + ".",
    "",
    "## Cerca del club",
    "",
    ...CERCANOS.map((c) => `- ${c.nombre} (${c.distancia}): ${c.texto}`),
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
    `- [Promociones](${SITIO_URL}/promociones)`,
    `- [Destinos y cabañas](${SITIO_URL}/destinos)`,
    `- [Experiencias](${SITIO_URL}/experiencias)`,
    `- [Membresías](${SITIO_URL}/membresias)`,
    `- [Lotes](${SITIO_URL}/lotes)`,
    `- [Preguntas frecuentes](${SITIO_URL}/preguntas)`,
    `- [Contacto](${SITIO_URL}/contacto)`,
    `- [Términos y condiciones](${SITIO_URL}/terminos)`,
    `- [Política de privacidad](${SITIO_URL}/privacidad)`,
  ];

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
