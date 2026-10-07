"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import type { IdCategoria } from "../../lib/modelo";

interface Contexto {
  categoria: IdCategoria | "";
  elegir: (id: IdCategoria) => void;
}

const CategoriaContext = createContext<Contexto>({
  categoria: "",
  elegir: () => undefined,
});

/** Une el botón de cada membresía con el selector del formulario de contacto. */
export function CategoriaProvider({
  children,
  inicial = "",
}: {
  children: ReactNode;
  inicial?: IdCategoria | "";
}) {
  const [categoria, setCategoria] = useState<IdCategoria | "">(inicial);
  return (
    <CategoriaContext.Provider value={{ categoria, elegir: setCategoria }}>
      {children}
    </CategoriaContext.Provider>
  );
}

export function useCategoria() {
  return useContext(CategoriaContext);
}
