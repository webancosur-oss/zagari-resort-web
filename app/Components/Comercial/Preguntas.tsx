import { InfoCircle, Plus } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { AVISO_TARIFAS, PREGUNTAS } from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Preguntas.module.css";

export default function Preguntas() {
  return (
    <Reveal as="section" id="preguntas" className={`${comun.seccion} ${comun.claro}`}>
      <div className={`${comun.inner} ${styles.disposicion}`}>
        <Cabecera
          etiqueta="Preguntas frecuentes"
          titulo={
            <>
              Reglas claras — <em>sin letra chica</em>
            </>
          }
          intro="Entradas, invitados, formas de acceso y de pago, y cómo funcionan los puntos."
        >
          <p className={comun.aviso} role="note" data-reveal data-entrada="sube">
            <InfoCircle size={17} aria-hidden="true" />
            {AVISO_TARIFAS}
          </p>
        </Cabecera>

        <div className={styles.lista} data-reveal data-entrada="sube">
          {PREGUNTAS.map((p) => (
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
    </Reveal>
  );
}
