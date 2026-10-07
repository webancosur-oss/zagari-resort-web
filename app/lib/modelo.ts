/**
 * Modelo comercial de Zagari Resort Club.
 * Fuente: "Zagari Resort Club - Modelo de negocio v2.0" (18-09-2026, para aprobación).
 *
 * Fuera a propósito, hasta que el documento lo resuelva:
 * - Fuentes de ingreso del club (§1): estrategia interna.
 * - Ejemplos de ahorro (§7): dependen de supuestos de consumo.
 * - Traspasos (§2, §4, §9) y suspensiones: dependen de aprobadores aún sin definir (§10.4).
 * - Fecha de apertura, panel de gerencia y responsables internos (§8, §10).
 * La aplicación del socio está descrita en el documento pero no existe aún:
 * los textos la presentan como parte del modelo, nunca como disponible.
 */

export const AVISO_TARIFAS = "Tarifas propuestas, sujetas a aprobación";

export const AVISO_MODELO =
  "Las categorías y sus nombres forman parte del modelo propuesto y están sujetos a confirmación.";

export const RESUMEN =
  "Zagari Resort Club es un club privado. Quien es socio entra las veces que quiera sin pagar entrada y usa las instalaciones base: piscinas, canchas, gym y zonas comunes. Lo que consume aparte lo paga con descuento, y mientras más usa el club, más puntos acumula.";

export type IdCategoria = "plata" | "oro" | "platino";

export interface Categoria {
  id: IdCategoria;
  nombre: string;
  /** Soles al año. */
  precio: number;
  queEs: string;
  quienLaTiene: string;
  alcance: string;
  ingreso: string;
  tarjeta: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    id: "plata",
    nombre: "Plata",
    precio: 890,
    queEs: "La membresía de entrada",
    quienLaTiene:
      "Público general que adquiere su membresía y propietarios de otros proyectos ANCOSUR.",
    alcance: "Titular, cónyuge e hijos menores de 18 años",
    ingreso: "Viernes, sábado, domingo y feriados",
    tarjeta: "Digital",
  },
  {
    id: "oro",
    nombre: "Oro",
    precio: 1690,
    queEs: "El socio frecuente, el que hace vivir el club",
    quienLaTiene:
      "Propietarios de lote Zagari y socios Plata que acumulan 300 puntos en el año.",
    alcance: "Titular, cónyuge e hijos menores de 18 años",
    ingreso: "Todos los días",
    tarjeta: "Digital y física",
  },
  {
    id: "platino",
    nombre: "Platino",
    precio: 2900,
    queEs: "Distinción. No se compra en puerta",
    quienLaTiene:
      "Solo por invitación: socios Oro que acumulan 1 000 puntos en el año, inversionistas y aliados.",
    alcance: "Titular, cónyuge e hijos menores de 18 años, con servicios exclusivos",
    ingreso: "Todos los días, con ingreso preferente",
    tarjeta: "Digital y física en metal",
  },
];

export const SOCIO_FUNDADOR =
  "Quien es propietario de un lote Zagari lleva, además de su categoría, la distinción de Socio Fundador. Es permanente y no se pierde aunque la categoría cambie.";

export interface FilaBeneficio {
  servicio: string;
  plata: string;
  oro: string;
  platino: string;
}

export const BENEFICIOS: FilaBeneficio[] = [
  {
    servicio: "Ingreso al club",
    plata: "Vie, sáb, dom y feriados",
    oro: "Todos los días",
    platino: "Todos los días, ingreso preferente y estacionamiento asistido",
  },
  {
    servicio: "Piscinas",
    plata: "Incluido",
    oro: "Incluido",
    platino: "Incluido, con zona reservada",
  },
  {
    servicio: "Gym y muro de escalada",
    plata: "Incluido",
    oro: "Incluido, con entrenador",
    platino: "Incluido, con entrenador personal",
  },
  {
    servicio: "Canchas",
    plata: "Con reserva; paga la luz de noche",
    oro: "Reserva sin costo, día y noche",
    platino: "Reserva sin costo y prioridad en los mejores horarios",
  },
  {
    servicio: "Zona de parrillas",
    plata: "Paga alquiler y limpieza",
    oro: "Solo paga limpieza",
    platino: "Sin costo, con carbón y atención incluidos",
  },
  {
    servicio: "Restaurante, bar y market",
    plata: "Precio de carta",
    oro: "10 % de descuento",
    platino: "20 % de descuento",
  },
  {
    servicio: "Cabañas",
    plata: "10 % de descuento",
    oro: "25 % de descuento",
    platino: "40 % de descuento y salida tardía",
  },
  {
    servicio: "Spa",
    plata: "Precio de carta",
    oro: "15 % de descuento",
    platino: "Un masaje al mes sin costo",
  },
  {
    servicio: "Biohuerto",
    plata: "Visita",
    oro: "Puede cosechar 1 kg",
    platino: "Canasta mensual",
  },
  {
    servicio: "Eventos del club",
    plata: "Entrada general",
    oro: "Zona preferencial",
    platino: "Zona exclusiva",
  },
  {
    servicio: "Invitados sin costo",
    plata: "2 al año",
    oro: "6 al año",
    platino: "12 al año",
  },
];

export interface FormaDeAcceso {
  quien: string;
  comoEntra: string;
  conQueArranca: string;
  /** Soles al año tras el primer año, si aplica. */
  renovacion?: number;
}

export const ACCESOS: FormaDeAcceso[] = [
  {
    quien: "Propietario de lote Zagari",
    comoEntra: "Automático al firmar; recibe su tarjeta con el lote.",
    conQueArranca:
      "Oro, primer año sin costo. Después renueva con 30 % de descuento permanente.",
    renovacion: 1183,
  },
  {
    quien: "Propietario de otro proyecto ANCOSUR",
    comoEntra: "Con su tarjeta de propietario.",
    conQueArranca:
      "Plata, primer año sin costo. Después renueva con 20 % de descuento permanente.",
    renovacion: 712,
  },
  {
    quien: "Público general",
    comoEntra: "Adquiere su membresía anual.",
    conQueArranca: "Plata.",
  },
  {
    quien: "Empresas",
    comoEntra: "Membresía corporativa con personas designadas.",
    conQueArranca: "Oro para cada titular.",
  },
];

export const HIJOS_18_A_25 = {
  precio: 250,
  detalle: "Cada hijo de 18 a 25 años se suma a la membresía del padre o la madre.",
};

export const FORMAS_DE_PAGO = [
  {
    titulo: "Un solo pago al año",
    detalle: "El precio de la tabla. Es la forma recomendada y la más simple.",
  },
  {
    titulo: "En tres cuotas",
    detalle: "El precio más 8 %, con tarjeta.",
  },
  {
    titulo: "Renovación anticipada",
    detalle:
      "Quien renueva antes de que venza su membresía paga 10 % menos y recibe 50 puntos de regalo.",
  },
  {
    titulo: "Sin cobros automáticos",
    detalle:
      "En el mes 11 llega el aviso de renovación con su descuento; si no se renueva, la membresía simplemente vence. El primer año gratuito de los propietarios no pide tarjeta.",
  },
];

export const SUBIR_ANTES =
  "Si alcanzas los puntos antes de la renovación, puedes subir de inmediato pagando solo la diferencia, proporcional a los meses que quedan.";

export const ENTRADAS = {
  adulto: { precio: 80, detalle: "Incluye piscinas, canchas y zonas comunes" },
  nino: { precio: 40, detalle: "Niños de 4 a 12 años" },
  gratis: "Menores de 4 años no pagan",
  sinPuntos: "La entrada del día no acumula puntos.",
  invitadoAdicional: [
    { categoria: "Plata", precio: 80, detalle: "Precio normal" },
    { categoria: "Oro", precio: 64, detalle: "20 % de descuento" },
    { categoria: "Platino", precio: 40, detalle: "50 % de descuento" },
  ],
  regla:
    "Los invitados entran con el socio presente. Si el socio no está, el invitado paga su entrada.",
};

export const PUNTOS = {
  resumen:
    "Los Puntos Zagari sirven para dos cosas: subir de categoría y canjear por beneficios. No vencen mientras la membresía esté activa.",
  ganar: [
    { accion: "Entrar al club (una vez por día)", puntos: 10 },
    { accion: "Usar una reserva: parrilla, cancha, cabaña o spa", puntos: 5 },
    { accion: "Cada S/ 100 de consumo en restaurante, bar, market o spa", puntos: 5 },
    { accion: "Recomendar a alguien que se hace socio", puntos: 50 },
    { accion: "Renovar la membresía antes del vencimiento", puntos: 50 },
  ],
  /** Soles por punto al canjear. */
  valor: 0.1,
  canjes: [
    { por: "Consumo en restaurante o market", cuesta: "10 puntos", equivale: "S/ 1" },
    { por: "Salida tardía de cabaña", cuesta: "400 puntos", equivale: "S/ 40" },
    { por: "Entrada de un invitado adicional", cuesta: "800 puntos", equivale: "S/ 80" },
    { por: "Masaje en el spa", cuesta: "1 200 puntos", equivale: "S/ 120" },
    { por: "Gorra, tomatodo o polo Zagari", cuesta: "500 a 900 puntos", equivale: "S/ 50 a 90" },
  ],
  revision:
    "La categoría se revisa una sola vez al año, al renovar, para que nadie cambie de categoría a mitad de año sin entender por qué.",
  movimientos: [
    { de: "Plata", a: "Oro", sube: true, requisito: "300 puntos en el año: unas 20 visitas con consumo moderado, dos veces al mes." },
    { de: "Oro", a: "Platino", sube: true, requisito: "1 000 puntos en el año e invitación del club: venir casi todas las semanas, reservar y consumir." },
    { de: "Oro", a: "Plata", sube: false, requisito: "Si en todo el año no llega a 100 puntos." },
    { de: "Platino", a: "Oro", sube: false, requisito: "Si en todo el año no llega a 150 puntos." },
  ],
  sinMultas:
    "Nadie pierde puntos por no venir y no hay multas: quien no usa el club simplemente no sube.",
};

/** Cómo funcionará la visita según el modelo; la app aún no está disponible. */
export const VISITA = [
  {
    paso: "Planifica",
    detalle: "Reservarás la parrilla o la cancha e invitarás a quien quieras dentro de tu cupo; cada invitado recibirá su código por WhatsApp.",
  },
  {
    paso: "Ingresa",
    detalle: "Mostrarás tu código o tu tarjeta en la puerta. El personal verá tu categoría, tus invitados y tu reserva, y sumará 10 puntos a tu cuenta.",
  },
  {
    paso: "Disfruta",
    detalle: "Usarás todo lo que incluye tu categoría. Al consumir en el restaurante o el market, la caja reconocerá tu categoría y aplicará el descuento.",
  },
  {
    paso: "Revisa tus puntos",
    detalle: "Al salir no habrá trámites. Esa noche verás los puntos que ganaste y cuánto te falta para la siguiente categoría.",
  },
];

const [ZAGARI, ANCOSUR, PUBLICO, EMPRESAS] = ACCESOS;

/** Preguntas frecuentes. Las cifras salen de las constantes de arriba. */
export const PREGUNTAS = [
  {
    pregunta: "¿A quién cubre la membresía?",
    respuesta: `Es familiar: titular, cónyuge e hijos menores de 18 años. Los hijos de 18 a 25 se suman pagando ${soles(HIJOS_18_A_25.precio)} al año cada uno.`,
  },
  {
    pregunta: "¿Puedo ir sin ser socio?",
    respuesta: `Sí, con una entrada por el día: adultos ${soles(ENTRADAS.adulto.precio)} y niños de 4 a 12 años ${soles(ENTRADAS.nino.precio)}. ${ENTRADAS.gratis}. Incluye piscinas, canchas y zonas comunes. ${ENTRADAS.sinPuntos}`,
  },
  {
    pregunta: "¿Cuánto paga un invitado adicional?",
    respuesta: `Depende de la categoría del socio: ${ENTRADAS.invitadoAdicional
      .map((i) => `${i.categoria} ${soles(i.precio)}`)
      .join(", ")}. ${ENTRADAS.regla}`,
  },
  {
    pregunta: "Soy propietario de un lote Zagari, ¿qué recibo?",
    respuesta: `${ZAGARI.comoEntra} ${ZAGARI.conQueArranca} Desde el segundo año pagas ${soles(ZAGARI.renovacion ?? 0)} al año. ${SOCIO_FUNDADOR}`,
  },
  {
    pregunta: "Compré en otro proyecto ANCOSUR, ¿qué recibo?",
    respuesta: `${ANCOSUR.comoEntra} ${ANCOSUR.conQueArranca} Desde el segundo año pagas ${soles(ANCOSUR.renovacion ?? 0)} al año.`,
  },
  {
    pregunta: "¿Cómo empiezo si no soy propietario?",
    respuesta: `${PUBLICO.comoEntra} Empiezas en ${PUBLICO.conQueArranca.replace(".", "")} y subes de categoría con tus puntos.`,
  },
  {
    pregunta: "¿Hay membresía para empresas?",
    respuesta: `Sí. ${EMPRESAS.comoEntra} ${EMPRESAS.conQueArranca}`,
  },
  {
    pregunta: "¿Cómo puedo pagar?",
    respuesta: FORMAS_DE_PAGO.slice(0, 3)
      .map((f) => `${f.titulo}: ${f.detalle.charAt(0).toLowerCase()}${f.detalle.slice(1)}`)
      .join(" "),
  },
  {
    pregunta: "¿Me cobrarán la renovación automáticamente?",
    respuesta: "No. En el mes 11 recibes el aviso de renovación con tu descuento. Si no renuevas, la membresía simplemente vence, sin cargos. El primer año gratuito de los propietarios no pide tarjeta.",
  },
  {
    pregunta: "¿En qué se canjean los puntos?",
    respuesta: `Cada punto vale S/ 0,10. Se canjean por ${PUNTOS.canjes
      .map((c) => `${c.por.charAt(0).toLowerCase()}${c.por.slice(1)} (${c.cuesta})`)
      .join(", ")}.`,
  },
  {
    pregunta: "¿Mis puntos vencen?",
    respuesta: "No vencen mientras tu membresía esté activa. Y nadie pierde puntos por no venir.",
  },
  {
    pregunta: "¿Puedo subir de categoría antes de la renovación?",
    respuesta: SUBIR_ANTES,
  },
  {
    pregunta: "¿Cómo se llega a Platino?",
    respuesta: "Platino no se compra en puerta. Se alcanza por invitación, al acumular 1 000 puntos en el año como socio Oro.",
  },
  {
    pregunta: "¿Se acumula el descuento de socio con las promociones?",
    respuesta: "No. Cuando coinciden una promoción o un precio de temporada y el descuento de tu categoría, se aplica el mayor de los dos.",
  },
];

/** "S/ 1 690": espacios no separables (Instrument Serif no tiene el espacio fino). */
export function soles(monto: number): string {
  const entero = Math.round(monto)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return `S/\u00a0${entero}`;
}
