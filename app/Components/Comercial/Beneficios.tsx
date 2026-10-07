"use client";

import { BENEFICIOS, CATEGORIAS, soles, type IdCategoria } from "../../lib/modelo";
import { useCategoria } from "./CategoriaElegida";

import styles from "./Beneficios.module.css";

/** Comparativa completa; vive dentro del desplegable de Membresías. */
export default function Beneficios() {
  const { categoria, elegir } = useCategoria();
  // Sin elección previa se muestra Oro: es la categoría con que entran los propietarios.
  const activa: IdCategoria = categoria || "oro";
  const elegida = CATEGORIAS.find((c) => c.id === activa)!;

  return (
    <div className={styles.comparativa}>
      <p className={styles.intro}>
        El socio entra sin pagar entrada y usa las instalaciones base. Lo que
        consume aparte lo paga, con el descuento de su categoría.
      </p>

      <div className={styles.selector} role="group" aria-label="Categoría a destacar en la comparativa">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={activa === c.id}
            className={styles.opcion}
            onClick={() => elegir(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <div className={styles.marco}>
        <table className={styles.tabla} data-activa={activa}>
          <caption className={styles.oculto}>
            Comparativa de beneficios por categoría. Destacada: {elegida.nombre}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Servicio</th>
              {CATEGORIAS.map((c) => (
                <th key={c.id} scope="col" data-col={c.id}>
                  {c.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENEFICIOS.map((fila) => (
              <tr key={fila.servicio}>
                <th scope="row">{fila.servicio}</th>
                {CATEGORIAS.map((c) => (
                  <td key={c.id} data-col={c.id}>
                    {fila[c.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.resumen} aria-live="polite">
        <span className="display">{elegida.nombre}</span> · {soles(elegida.precio)} al año,
        tarifa propuesta. {elegida.ingreso}.
      </p>
    </div>
  );
}
