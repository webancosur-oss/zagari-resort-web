// El CRM de dev/produccion se elige en el servidor de la API.
const API_BASE =
  process.env.NEXT_PUBLIC_LEADS_API ??
  "https://ancosur-api-production.up.railway.app";

export const PROYECTO = "Zagari Resort Club";

export interface LeadInput {
  codigoFormulario: string;
  nombreFormulario: string;
  tipoFormulario: "contacto" | "lotes" | "promocion";

  nombre: string;
  telefono: string;
  email?: string;
  dni?: string;
  mensaje?: string;

  interes?: string;
}

export interface LeadResult {
  ok: boolean;
  mensaje: string;
}

function leerUtm() {
  if (typeof window === "undefined") return {};

  const p = new URLSearchParams(window.location.search);

  return {
    utm_source: p.get("utm_source") ?? "",
    utm_medium: p.get("utm_medium") ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
    utm_content: p.get("utm_content") ?? "",
    utm_term: p.get("utm_term") ?? "",
  };
}

export async function enviarLead(
  datos: LeadInput
): Promise<LeadResult> {
  const cuerpo = {
    codigo_formulario: datos.codigoFormulario,
    nombre_formulario: datos.nombreFormulario,
    tipo_formulario: datos.tipoFormulario,

    nombre: datos.nombre.trim(),
    telefono: datos.telefono.replace(/\s+/g, ""),
    email: datos.email?.trim() ?? "",
    dni: datos.dni?.trim() ?? "",
    mensaje: datos.mensaje?.trim() ?? "",

    proyecto: PROYECTO,
    interes: datos.interes ?? "WEB Zagari",
    campania: PROYECTO,
    anuncio: "Web",

    fuente_id: 4,
    fuente_descripcion: "PAGINA WEB",

    ruta_pagina:
      typeof window !== "undefined"
        ? window.location.pathname
        : "",
    url_pagina:
      typeof window !== "undefined"
        ? window.location.href
        : "",
    pagina_referencia:
      typeof document !== "undefined"
        ? document.referrer
        : "",

    ...leerUtm(),
  };

  try {
    const control = new AbortController();
    const limite = setTimeout(() => control.abort(), 15000);

    const respuesta = await fetch(
      `${API_BASE}/api/formularios`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
        signal: control.signal,
      }
    );

    clearTimeout(limite);

    if (!respuesta.ok) {
      if (respuesta.status >= 500) {
        return {
          ok: false,
          mensaje:
            "El servidor no está disponible ahora mismo. Inténtalo en unos minutos o escríbenos por WhatsApp.",
        };
      }

      if (respuesta.status === 429) {
        return {
          ok: false,
          mensaje:
            "Has enviado varias solicitudes seguidas. Espera un momento antes de volver a intentarlo.",
        };
      }

      return {
        ok: false,
        mensaje:
          "No pudimos registrar tus datos. Revisa la información e inténtalo de nuevo.",
      };
    }

    return {
      ok: true,
      mensaje: "¡Gracias! Un asesor se contactará contigo.",
    };
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      return {
        ok: false,
        mensaje:
          "La solicitud tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.",
      };
    }

    return {
      ok: false,
      mensaje:
        "No hay conexión con el servidor. Comprueba tu internet o escríbenos por WhatsApp.",
    };
  }
}
