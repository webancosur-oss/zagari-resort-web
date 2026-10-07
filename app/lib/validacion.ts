export type Errores = Record<string, string>;

export function validarNombre(v: string): string | null {
  const t = v.trim();

  if (!t) return "Escribe tu nombre y apellidos.";
  if (t.length < 3) return "El nombre es demasiado corto.";
  if (!/^[\p{L}\s'.-]+$/u.test(t))
    return "El nombre solo puede llevar letras.";

  return null;
}

// Peru: movil de 9 digitos que empieza por 9; DNI de 8.
export function validarTelefono(v: string): string | null {
  const t = v.replace(/[\s()-]/g, "");

  if (!t) return "Escribe tu número de teléfono.";
  if (!/^\d+$/.test(t)) return "El teléfono solo lleva números.";
  if (!/^9\d{8}$/.test(t))
    return "Debe ser un móvil de 9 dígitos que empiece por 9.";

  return null;
}

export function validarDni(v: string): string | null {
  const t = v.trim();

  if (!t) return "Escribe tu DNI.";
  if (!/^\d{8}$/.test(t)) return "El DNI tiene 8 dígitos.";

  return null;
}

export function validarEmail(
  v: string,
  obligatorio = true
): string | null {
  const t = v.trim();

  if (!t) return obligatorio ? "Escribe tu correo." : null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t))
    return "El correo no parece válido.";

  return null;
}
