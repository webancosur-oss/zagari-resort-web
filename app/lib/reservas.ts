/** Planes del buscador de reservas; los comparten el buscador y /contacto. */
export const PLANES = [
  { id: "dia", nombre: "Entrada por día" },
  { id: "cabana", nombre: "Cabaña" },
  { id: "membresia", nombre: "Membresía" },
  { id: "lote", nombre: "Lote" },
] as const;

export type IdPlan = (typeof PLANES)[number]["id"];

export const esPlan = (v: unknown): v is IdPlan => PLANES.some((p) => p.id === v);

/** "2026-10-12" → "12 de octubre de 2026", sin depender de la zona horaria. */
export function fechaLegible(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const esFecha = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** "Somos 2 adultos y 1 niño." */
export function personas(adultos: number, ninos: number) {
  return `Somos ${adultos} ${adultos === 1 ? "adulto" : "adultos"}${
    ninos ? ` y ${ninos} ${ninos === 1 ? "niño" : "niños"}` : ""
  }.`;
}
