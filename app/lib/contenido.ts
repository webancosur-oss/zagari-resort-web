/**
 * Contenido del sitio que no es el modelo comercial: destinos, lugares
 * cercanos, amenidades, cabañas y lotes.
 * Fuentes: "ZAGARI BROCHURE" (II etapa, preventa de lotes) y el modelo de
 * negocio v2.0. Sin montos: las tarifas aún no están aprobadas.
 */

const A = "/assets/images/amenities";
const E = "/assets/images/experiences";
const H = "/assets/images/heroes";
const C = "/assets/images/cabagnas";
const L = "/assets/images/lotes";
const P = "/assets/images/cercanos";

export const WHATSAPP_NUMERO = "51971069763";

export const whatsapp = (mensaje: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

export const AVISO_IMAGENES = "Imágenes referenciales sujetas a variación del proyecto.";

export interface Foto {
  src: string;
  alt: string;
}

/** Foto con licencia libre: el crédito se muestra junto a la imagen. */
export interface Credito {
  autor: string;
  licencia: string;
  fuente: string;
}

/* ── Destinos ── */

export interface Destino {
  id: "san-ramon" | "oxapampa";
  nombre: string;
  region: string;
  estado: "abierto" | "proximamente";
  resumen: string;
  foto: Foto;
  credito?: Credito;
  datos: string[];
}

export const DESTINOS: Destino[] = [
  {
    id: "san-ramon",
    nombre: "San Ramón",
    region: "Chanchamayo · Selva Central",
    estado: "abierto",
    resumen:
      "A 15 minutos de San Ramón y de la Carretera Central, entre el valle y la montaña. Un club donde la naturaleza y el descanso se unen alrededor de los cuatro elementos: aire, fuego, tierra y agua.",
    foto: {
      src: `${A}/element-agua-piscina-borde-infinito.webp`,
      alt: "Piscina de borde infinito de Zagari Resort Club rodeada de palmeras",
    },
    datos: ["+20 amenidades", "Cabañas de alojamiento", "A 3 min del mirador El Mishasho"],
  },
  {
    id: "oxapampa",
    nombre: "Oxapampa",
    region: "Pasco · Selva Central",
    estado: "proximamente",
    resumen:
      "El próximo destino de Zagari Resort Club. Déjanos tus datos y serás de los primeros en conocer la apertura y sus beneficios de lanzamiento.",
    foto: {
      src: `${L}/selva-catarata.webp`,
      alt: "Bosque de la Selva Central con una catarata entre la montaña",
    },
    datos: ["Próxima apertura", "Prioridad para socios"],
  },
];

/* ── Ventajas de ser parte de Zagari ── */

export const VENTAJAS = [
  {
    icono: "entrada",
    titulo: "Entra las veces que quieras",
    texto: "Como socio, ingresas sin pagar entrada y usas piscinas, canchas, gimnasio y zonas comunes.",
  },
  {
    icono: "descuento",
    titulo: "Descuentos en todo el club",
    texto: "Restaurante, bar, market, spa y cabañas con el descuento de tu categoría.",
  },
  {
    icono: "puntos",
    titulo: "Cada visita suma",
    texto: "Acumulas Puntos Zagari que te suben de categoría y vuelven como saldo para gastar adentro.",
  },
  {
    icono: "familia",
    titulo: "Membresía familiar",
    texto: "Cubre al titular, su cónyuge e hijos menores de 18 años, con invitados sin costo al año.",
  },
] as const;

/* ── Promociones ── */

export const PROMOCIONES = [
  {
    id: "propietario",
    titulo: "Sé propietario y vive el club desde el primer día",
    texto: "Tu lote en Zagari te da Membresía Oro el primer año sin costo y la distinción de Socio Fundador.",
    foto: { src: `${H}/portico_familia.webp`, alt: "Familia en el pórtico de ingreso de Zagari Resort Club" },
    enlace: { label: "Ver promociones", href: "/promociones#propietario" },
  },
  {
    id: "puntos",
    titulo: "Cada visita suma",
    texto: "Gana Puntos Zagari al entrar, reservar y consumir, y canjéalos adentro.",
    foto: { src: `${A}/element-tierra-restaurant.webp`, alt: "Restaurante de madera del club" },
    enlace: { label: "Cómo ganar", href: "/promociones#puntos" },
  },
  {
    id: "exclusivos",
    titulo: "Accesos exclusivos",
    texto: "Zonas reservadas, ingreso preferente y experiencias solo para socios.",
    foto: { src: `${A}/element-agua-bar-piscina.webp`, alt: "Bar dentro de la piscina del club" },
    enlace: { label: "Descúbrelos", href: "/promociones#exclusivos" },
  },
] as const;

/* ── Lugares cercanos recomendados ── */

export interface Cercano {
  nombre: string;
  distancia: string;
  texto: string;
  /** Sin foto propia o libre todavía: la tarjeta muestra un fondo de marca. */
  foto?: Foto;
  credito?: Credito;
}

export const CERCANOS: Cercano[] = [
  {
    nombre: "Mirador El Mishasho",
    distancia: "A 3 min del club",
    texto: "El mirador más cercano a Zagari, con vista abierta sobre el valle de Chanchamayo.",
    foto: { src: `${E}/mirador-mishasho.jpg`, alt: "Mirador El Mishasho con vista al valle" },
  },
  {
    nombre: "Catarata El Tirol",
    distancia: "San Ramón",
    texto: "Una caminata entre la vegetación lleva a esta caída de agua, una de las más visitadas de San Ramón.",
    foto: { src: `${P}/catarata-tirol.webp`, alt: "Catarata El Tirol cayendo entre la vegetación" },
    credito: { autor: "Harleyca", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Catarata_Tirol.JPG" },
  },
  {
    nombre: "Mirador Los Antis",
    distancia: "San Ramón",
    texto: "Una roca sobre las nubes con el valle de Chanchamayo a tus pies: el atardecer más alto de San Ramón.",
    foto: {
      src: `${P}/mirador-los-antis.webp`,
      alt: "Dos personas sentadas sobre la roca del mirador Los Antis frente al valle de Chanchamayo",
    },
  },
  {
    nombre: "Valle de San Ramón",
    distancia: "San Ramón",
    texto: "Ríos de montaña, puentes y bosque: el paisaje que rodea a la ciudad camino al club.",
    foto: { src: `${P}/san-ramon.webp`, alt: "Río entre la montaña de San Ramón con un puente rojo" },
    credito: {
      autor: "Ivan Brehaut",
      licencia: "CC BY-SA 4.0",
      fuente: "https://commons.wikimedia.org/wiki/File:San_Ram%C3%B3n,_Chanchamayo,_Jun%C3%ADn._12.jpg",
    },
  },
  {
    nombre: "Puente Kimiri",
    distancia: "La Merced",
    texto: "El histórico puente colgante de piedra sobre el río Chanchamayo, a la entrada de La Merced.",
    foto: { src: `${P}/puente-kimiri.webp`, alt: "Torre de piedra del puente colgante Kimiri" },
    credito: {
      autor: "Miguelcrux",
      licencia: "CC BY-SA 4.0",
      fuente: "https://commons.wikimedia.org/wiki/File:Puente_Colgante_Kimiri_La_Merced.jpg",
    },
  },
  {
    nombre: "Catarata Bayoz",
    distancia: "Perené",
    texto: "Pozas de agua turquesa y varias caídas en el corazón de la Selva Central.",
    foto: { src: `${P}/catarata-bayoz.webp`, alt: "Catarata Bayoz cayendo sobre una poza" },
    credito: { autor: "Harleyca", licencia: "CC BY-SA 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Catarata_Bayoz.jpg" },
  },
  {
    nombre: "Catarata Velo de la Novia",
    distancia: "Perené",
    texto: "Su caída larga y delgada le da el nombre. Está muy cerca de Bayoz, ideal para un mismo paseo.",
    foto: { src: `${P}/velo-de-la-novia.webp`, alt: "Catarata Velo de la Novia entre el bosque" },
    credito: { autor: "Tomato356", licencia: "CC BY 3.0", fuente: "https://commons.wikimedia.org/wiki/File:Velo_de_la_Novia_Falls.jpg" },
  },
];

/** Lugares por los que pasa el camino desde San Ramón (brochure). */
export const EN_EL_CAMINO = [
  "Ingreso al anexo de Chincana",
  "Fundo Selenita",
  "Iglesia Chincana",
  "Escuela Chincana",
  "Mirador El Mishasho, a 3 minutos",
];

/* ── Amenidades (+20), agrupadas por los cuatro elementos del brochure ── */

export interface Elemento {
  id: "agua" | "aire" | "fuego" | "tierra";
  nombre: string;
  lema: string;
  amenidades: { nombre: string; texto: string; foto: Foto }[];
}

export const ELEMENTOS: Elemento[] = [
  {
    id: "agua",
    nombre: "Agua",
    lema: "Fluye para renovar cuerpo y mente.",
    amenidades: [
      {
        nombre: "Piscina infinita",
        texto: "Piscina con borde infinito para tus momentos de relajación.",
        foto: { src: `${A}/element-agua-piscina-borde-infinito.webp`, alt: "Piscina de borde infinito con palmeras" },
      },
      {
        nombre: "Bar en la piscina",
        texto: "Una barra dentro del agua, bajo la pérgola.",
        foto: { src: `${A}/element-agua-bar-piscina.webp`, alt: "Bar dentro de la piscina bajo una pérgola" },
      },
      {
        nombre: "Lago y puentes",
        texto: "Un recorrido de agua entre la vegetación.",
        foto: { src: `${A}/element-agua-lago.webp`, alt: "Lago con puentes de madera" },
      },
    ],
  },
  {
    id: "aire",
    nombre: "Aire",
    lema: "Llena tus días de tranquilidad.",
    amenidades: [
      {
        nombre: "Mirador a San Ramón",
        texto: "Una torre de madera sobre el bosque para mantener tu frescura.",
        foto: { src: `${A}/element-aire-mirador.webp`, alt: "Torre mirador de madera sobre el bosque" },
      },
      {
        nombre: "Domos",
        texto: "Espacios abiertos al cielo entre las copas de los árboles.",
        foto: { src: `${A}/element-aire-domo.webp`, alt: "Domo rodeado de vegetación" },
      },
    ],
  },
  {
    id: "fuego",
    nombre: "Fuego",
    lema: "Despierta tu energía y pasión.",
    amenidades: [
      {
        nombre: "Zona espiritual",
        texto: "Un refugio para meditar y recargar energías.",
        foto: { src: `${A}/element-fuego-zona-espiritual.webp`, alt: "Zona espiritual con fogata de noche" },
      },
      {
        nombre: "Camping Zagari",
        texto: "Fogata y cielo abierto para dormir bajo las estrellas.",
        foto: { src: `${A}/element-fuego-camping.webp`, alt: "Zona de camping de noche con fogata" },
      },
    ],
  },
  {
    id: "tierra",
    nombre: "Tierra",
    lema: "Te brinda estabilidad y raíces sólidas.",
    amenidades: [
      {
        nombre: "Biohuerto",
        texto: "El biohuerto más grande de San Ramón: siembra y cosecha tus propios alimentos.",
        foto: { src: `${A}/element-tierra-biohuerto-mandarina.webp`, alt: "Biohuerto de mandarinas" },
      },
      {
        nombre: "La Diosa de los Elementos",
        texto: "La zona instagrameable del club, perfecta para capturar momentos únicos.",
        foto: { src: `${A}/element-tierra-diosa-de-elementos.webp`, alt: "Estatua de madera de la Diosa de los Elementos" },
      },
      {
        nombre: "Resto bar",
        texto: "Cocina y bar bajo techos de madera abiertos al verde.",
        foto: { src: `${A}/element-tierra-restaurant.webp`, alt: "Salón del restaurante de madera" },
      },
      {
        nombre: "Mini tenis y muro escalable",
        texto: "Deporte y altura junto a la piscina.",
        foto: { src: `${A}/element-tierra-tenis-muro-escalable.webp`, alt: "Cancha de mini tenis junto al muro escalable" },
      },
      {
        nombre: "Cancha de fútbol y vóley",
        texto: "Grass y vista a la montaña para jugar en familia.",
        foto: { src: `${A}/element-tierra-campo-futbol-voley.webp`, alt: "Cancha de fútbol y vóley del club" },
      },
      {
        nombre: "Gimnasio equipado",
        texto: "Entrena con vista abierta al bosque.",
        foto: { src: `${A}/element-tierra-gym.webp`, alt: "Gimnasio con piso de madera y vista al exterior" },
      },
      {
        nombre: "Mini golf",
        texto: "Para toda la familia.",
        foto: { src: `${A}/element-tierra-minigolf.webp`, alt: "Cancha de mini golf" },
      },
    ],
  },
];

/** Las más de 20 amenidades del club según el brochure. */
export const AMENIDADES = [
  "Piscina infinita",
  "Bar en la piscina",
  "Restaurante bar",
  "Cabañas de alojamiento",
  "Spa",
  "Yoga",
  "Gimnasio",
  "Muro escalable",
  "Mini tenis",
  "Frontón",
  "Cancha de fútbol",
  "Vóley",
  "Mini golf",
  "Zona de niños",
  "Zona de parrillas",
  "Camping",
  "Mirador",
  "Biohuerto",
  "Zona de trekking",
  "Zona espiritual",
  "Zona instagrameable",
  "Market Zagari",
  "Explanada de eventos",
];

/* ── Cabañas del club ── */

export const CABANAS = {
  texto:
    "Cabañas de madera entre la vegetación para quedarte más de un día. Socios y visitantes pueden reservarlas; los socios pagan menos según su categoría.",
  fotos: [
    { src: `${A}/cabanias-alojamiento.webp`, alt: "Cabañas de alojamiento del club entre la vegetación" },
    { src: `${H}/hero_cabagna.jpg`, alt: "Cabaña de arquitectura negra frente al valle al anochecer" },
    { src: `${C}/cabagna2.jpeg`, alt: "Interior de una cabaña del club" },
    { src: `${C}/cabagna3.jpeg`, alt: "Terraza de una cabaña del club" },
  ] satisfies Foto[],
  descuentos: [
    { categoria: "Plata", detalle: "10 % de descuento" },
    { categoria: "Oro", detalle: "25 % de descuento" },
    { categoria: "Platino", detalle: "40 % y salida tardía" },
  ],
};

/* ── Lotes: II etapa en preventa ── */

export const LOTES = {
  etapa: "II etapa · Preventa",
  area: { desde: 234, hasta: 525 },
  resumen:
    "Lotes en San Ramón dentro de Zagari Resort Club, con acceso a las más de 20 amenidades del club. La primera etapa ya se vendió.",
  ventajas: [
    { titulo: "Precios de preventa", texto: "Accede a las condiciones de lanzamiento de la segunda etapa." },
    { titulo: "Crédito directo", texto: "Paga hasta en 18 meses, sin bancos de por medio." },
    { titulo: "Asesoría 100 % personalizada", texto: "Un asesor te acompaña desde la elección del lote." },
  ],
  modelos: [
    { nombre: "Cabaña de 1 habitación", foto: { src: `${L}/cabana-1-habitacion.webp`, alt: "Cabaña de una habitación con techo inclinado" } },
    { nombre: "Cabaña de 2 habitaciones", foto: { src: `${L}/cabana-2-habitaciones.webp`, alt: "Cabaña de dos habitaciones en dos pisos" } },
    { nombre: "Cabaña de 3 habitaciones", foto: { src: `${L}/cabana-3-habitaciones.webp`, alt: "Cabaña de tres habitaciones con fachada de madera" } },
  ],
  alquiler:
    "Convierte tu inversión en ingresos: alquila tu cabaña en plataformas como Airbnb y deja que tu lote trabaje para ti.",
  zonas: [
    "Resort Club con más de 20 amenidades",
    "El biohuerto más grande de San Ramón",
    "Zona de trekking",
    "Primera etapa vendida",
    "Segunda etapa en preventa",
  ],
};

/* ── Tipos de cabaña (planos de venta, noviembre 2024) ── */

const T = "/assets/images/cabanas-tipos";

export interface TipoCabana {
  id: string;
  nombre: string;
  area: number;
  pisos: 1 | 2;
  habitaciones: number;
  resumen: string;
  /** Ambientes por piso, como en el plano de venta. */
  ambientes: { piso?: string; lista: string[] }[];
  fotos: Foto[];
  plano: Foto & { ancho: number; alto: number };
}

export const TIPOS_CABANA: TipoCabana[] = [
  {
    id: "superior",
    nombre: "Cabaña Superior",
    area: 25,
    pisos: 1,
    habitaciones: 1,
    resumen: "La escapada en pareja: una habitación con sala y baño propio, rodeada de jardín.",
    ambientes: [{ lista: ["Sala", "Habitación", "Baño"] }],
    fotos: [
      { src: `${T}/superior-exterior.webp`, alt: "Cabaña de techo inclinado y madera negra entre árboles de mandarina" },
      { src: `${T}/dormitorio-sala.webp`, alt: "Habitación de madera con cama doble y sala junto al ventanal" },
    ],
    plano: { src: `${T}/plano-superior.webp`, alt: "Plano de la Cabaña Superior: habitación con sala y baño, 25 m²", ancho: 794, alto: 618 },
  },
  {
    id: "deluxe",
    nombre: "Cabaña Deluxe",
    area: 36,
    pisos: 1,
    habitaciones: 1,
    resumen: "Todo lo de la Superior, más una terraza con tina para mirar el bosque.",
    ambientes: [{ lista: ["Sala", "Habitación", "Terraza con tina", "Baño"] }],
    fotos: [
      { src: `${T}/superior-exterior.webp`, alt: "Cabaña Deluxe de madera negra entre la vegetación" },
      { src: `${T}/dormitorio-terraza.webp`, alt: "Habitación de madera abierta a la terraza con silla colgante" },
      { src: `${T}/sala-terraza.webp`, alt: "Sala de la cabaña con ventanal plegable hacia el bosque" },
    ],
    plano: { src: `${T}/plano-deluxe.webp`, alt: "Plano de la Cabaña Deluxe: habitación con sala, baño y terraza con tina, 36 m²", ancho: 908, alto: 588 },
  },
  {
    id: "premium",
    nombre: "Cabaña Premium",
    area: 86,
    pisos: 2,
    habitaciones: 2,
    resumen: "Dos pisos y dos habitaciones, cada una con su baño y su terraza: para viajar en familia o con amigos.",
    ambientes: [
      { piso: "1.er piso · 43 m²", lista: ["Habitación doble", "Terraza", "Baño"] },
      { piso: "2.º piso · 43 m²", lista: ["Sala", "Habitación", "Terraza", "Baño"] },
    ],
    fotos: [
      { src: `${T}/premium-exterior.webp`, alt: "Cabaña Premium de dos pisos con fachada de vidrio y madera negra" },
      { src: `${T}/premium-dormitorio-doble.webp`, alt: "Habitación con dos camas dobles y paredes de madera" },
      { src: `${T}/sala-terraza.webp`, alt: "Sala con ventanal abierto a la terraza y al bosque" },
    ],
    plano: { src: `${T}/plano-premium.webp`, alt: "Plano de la Cabaña Premium en dos pisos, 86 m²", ancho: 848, alto: 1285 },
  },
  {
    id: "domo",
    nombre: "Domo Premium",
    area: 94,
    pisos: 2,
    habitaciones: 2,
    resumen: "Abajo, una habitación doble con gran terraza; arriba, el domo geodésico con vista al cielo.",
    ambientes: [
      { piso: "1.er piso · 47 m²", lista: ["Habitación doble", "Terraza", "Baño"] },
      { piso: "2.º piso, el domo · 47 m²", lista: ["Sala", "Habitación", "Terrazas", "Baño"] },
    ],
    fotos: [
      { src: `${T}/domo-exterior.webp`, alt: "Domo geodésico sobre una cabaña de madera negra con terraza y hamacas" },
      { src: `${T}/dormitorio-sala.webp`, alt: "Habitación de madera con cama doble y sala" },
    ],
    plano: { src: `${T}/plano-domo.webp`, alt: "Plano del Domo Premium en dos pisos, 94 m²", ancho: 931, alto: 1239 },
  },
];

/* ── Promociones (página /promociones): tres capítulos ── */

export interface Capitulo {
  id: "propietario" | "puntos" | "exclusivos";
  titulo: string;
  remate: string;
  texto: string;
  grupos: { titulo: string; items: string[] }[];
  fotos: [Foto, Foto];
  acciones: { label: string; href: string; externo?: boolean; destacada?: boolean }[];
  /** Frase corta que invita a dar el paso, sobre las cifras. */
  gancho?: string;
  cifras?: { valor: string; texto: string }[];
}

export const CAPITULOS: Capitulo[] = [
  {
    id: "propietario",
    titulo: "Por ser propietario",
    remate: "tu lote abre la puerta del club",
    texto: "Quien confía en Zagari desde el inicio entra al club desde el primer día, con beneficios que no vencen.",
    gancho: "Invierte en tu lote, vive como socio",
    cifras: [
      { valor: "234–525 m²", texto: "Lotes en preventa" },
      { valor: "18 meses", texto: "Crédito directo" },
      { valor: "1.er año", texto: "Oro sin costo" },
    ],
    grupos: [
      {
        titulo: "Propietarios de lote Zagari",
        items: [
          "Membresía Oro el primer año sin costo, automática al firmar.",
          "30 % de descuento permanente al renovar.",
          "Distinción de Socio Fundador, para siempre.",
          "Acceso al Resort Club y al biohuerto, y 30 % en productos seleccionados.",
          "Precios de preventa y crédito directo hasta en 18 meses.",
        ],
      },
      {
        titulo: "Propietarios de otros proyectos ANCOSUR",
        items: ["Membresía Plata el primer año sin costo.", "20 % de descuento permanente al renovar."],
      },
    ],
    fotos: [
      { src: "/assets/images/heroes/portico_familia.webp", alt: "Familia llegando al pórtico de Zagari Resort Club" },
      { src: "/assets/images/lotes/domos.webp", alt: "Cabañas con domo entre palmeras" },
    ],
    acciones: [
      { label: "Quiero ser propietario", href: "/lotes", destacada: true },
      {
        label: "Soy propietario ANCOSUR",
        href: whatsapp("Hola, soy propietario de un proyecto ANCOSUR y quiero activar mi membresía Plata en Zagari Resort Club."),
        externo: true,
      },
    ],
  },
  {
    id: "puntos",
    titulo: "Gana con tus puntos",
    remate: "mientras más vienes, más recibes",
    texto: "Los Puntos Zagari te suben de categoría y vuelven como saldo para gastar adentro. No vencen mientras tu membresía esté activa.",
    grupos: [
      {
        titulo: "Cómo se ganan",
        items: [
          "10 puntos cada vez que entras al club.",
          "5 puntos por cada reserva usada: parrilla, cancha, cabaña o spa.",
          "5 puntos por cada S/ 100 de consumo adentro.",
          "50 puntos por cada amigo que se hace socio.",
          "50 puntos y 10 % menos si renuevas antes de que venza tu membresía.",
        ],
      },
      {
        titulo: "Qué consigues",
        items: [
          "Con 300 puntos al año pasas de Plata a Oro.",
          "100 puntos son S/ 10 de saldo en restaurante o market.",
          "Canjéalos por masajes, invitados, salida tardía o productos Zagari.",
        ],
      },
    ],
    fotos: [
      { src: "/assets/images/amenities/element-tierra-restaurant.webp", alt: "Restaurante de madera del club" },
      { src: "/assets/images/amenities/element-fuego-camping.webp", alt: "Amigos alrededor de una fogata en el camping" },
    ],
    acciones: [{ label: "Elige tu membresía", href: "/membresias" }],
  },
  {
    id: "exclusivos",
    titulo: "Accesos exclusivos",
    remate: "lo mejor del club, primero para ti",
    texto: "Las categorías más altas abren espacios y servicios que no están a la venta en puerta.",
    grupos: [
      {
        titulo: "Socios Oro",
        items: ["Ingreso todos los días.", "Zona preferencial en los eventos del club.", "Reserva de canchas sin costo, día y noche."],
      },
      {
        titulo: "Socios Platino, solo por invitación",
        items: [
          "Ingreso preferente y estacionamiento asistido.",
          "Zona reservada en la piscina y zona exclusiva en eventos.",
          "Entrenador personal, un masaje al mes y canasta mensual del biohuerto.",
        ],
      },
    ],
    fotos: [
      { src: "/assets/images/amenities/element-agua-bar-piscina.webp", alt: "Bar dentro de la piscina del club" },
      { src: "/assets/images/amenities/element-fuego-zona-espiritual.webp", alt: "Zona espiritual del club de noche" },
    ],
    acciones: [{ label: "Comparar categorías", href: "/membresias#beneficios" }],
  },
];

export const CONDICIONES_PROMOCIONES = [
  "Los descuentos de socio no se acumulan con promociones o precios de temporada: se aplica el mayor de los dos.",
  "Las categorías, beneficios y condiciones forman parte del modelo propuesto y están sujetos a confirmación.",
  "Imágenes referenciales sujetas a variación del proyecto.",
];
