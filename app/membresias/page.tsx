import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "reicon-react";

import CabeceraPagina from "../Components/Sitio/CabeceraPagina";
import { CategoriaProvider } from "../Components/Comercial/CategoriaElegida";
import Membresias from "../Components/Comercial/Membresias";
import Puntos from "../Components/Comercial/Puntos";
import Contacto from "../Components/Comercial/Contacto";
import { CATEGORIAS, type IdCategoria } from "../lib/modelo";
import { metadatosDe } from "../lib/sitio";

import comun from "../Components/Comercial/comercial.module.css";
import styles from "../page.module.css";

export const metadata: Metadata = metadatosDe(
  "/membresias",
  "Membresías",
  "Membresías Plata, Oro y Platino de Zagari Resort Club: elige tu categoría y compara sus beneficios. Propietarios de lote Zagari: Oro el primer año sin costo."
);

const esCategoria = (v: unknown): v is IdCategoria => CATEGORIAS.some((c) => c.id === v);

export default async function PaginaMembresias({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <main className={styles.page}>
      <CabeceraPagina
        etiqueta="Membresías"
        titulo={
          <>
            Plata, Oro o Platino: <em>elige tu camino</em>
          </>
        }
        texto="Pagas una vez, vuelves cuando quieras: mientras más vienes, más ganas."
        imagen={{
          src: "/assets/images/amenities/element-agua-bar-piscina.webp",
          alt: "Socios en el bar dentro de la piscina del club",
        }}
      />
      <CategoriaProvider inicial={esCategoria(categoria) ? categoria : ""}>
        <Membresias />
        <Puntos />
        <section className={comun.seccion}>
          <div className={comun.inner}>
            <Link href="/preguntas" className={comun.boton}>
              Ver preguntas frecuentes
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
        <Contacto />
      </CategoriaProvider>
    </main>
  );
}
