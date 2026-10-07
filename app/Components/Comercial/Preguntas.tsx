import { Plus } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { GRUPOS_PREGUNTAS } from "../../lib/modelo";

import comun from "./comercial.module.css";
import sitio from "../Sitio/sitio.module.css";
import styles from "./Preguntas.module.css";

/** "Visitas e invitados" → "visitas-e-invitados", para las anclas de cada tema. */
export const anclaDe = (tema: string) =>
  tema
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Preguntas frecuentes por tema, con un índice para saltar entre ellos. */
export default function Preguntas() {
  return (
    <Reveal as="section" id="preguntas" className={`${comun.seccion} ${comun.claro}`}>
      <div className={comun.inner}>
        <nav aria-label="Temas" data-reveal data-entrada="sube">
          <ul className={sitio.chips}>
            {GRUPOS_PREGUNTAS.map((g) => (
              <li key={g.tema}>
                <a href={`#${anclaDe(g.tema)}`} className={sitio.chip}>
                  {g.tema}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {GRUPOS_PREGUNTAS.map((g) => (
          <div key={g.tema} id={anclaDe(g.tema)} className={styles.disposicion}>
            <h2 className={`display ${comun.titulo}`} data-reveal data-entrada="sube">
              {g.tema}
            </h2>
            <div className={styles.lista} data-reveal data-entrada="sube">
              {g.preguntas.map((p) => (
                <details key={p.pregunta} className={styles.item}>
                  <summary className={styles.pregunta}>
                    {p.pregunta}
                    <Plus size={18} aria-hidden="true" className={styles.icono} />
                  </summary>
                  <p className={styles.respuesta}>{p.respuesta}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
