import Reveal from "../Reveal/Reveal";
import {
  ACCESOS,
  FORMAS_DE_PAGO,
  HIJOS_18_A_25,
  SOCIO_FUNDADOR,
  soles,
} from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Acceso.module.css";

export default function Acceso() {
  return (
    <Reveal as="section" id="acceso" className={`${comun.seccion} ${comun.arena}`}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Cómo acceder y pagar"
          titulo={
            <>
              Cada quien entra <em>a su manera</em>
            </>
          }
          intro="La categoría con que empiezas depende de cómo llegas al club. Los propietarios de proyectos ANCOSUR tienen el primer año sin costo."
        />

        <ul className={styles.accesos} data-reveal data-entrada="sube">
          {ACCESOS.map((a) => (
            <li key={a.quien} className={styles.acceso}>
              <h3 className={styles.quien}>{a.quien}</h3>
              <p className={styles.como}>{a.comoEntra}</p>
              <p className={styles.arranca}>{a.conQueArranca}</p>
              {a.renovacion !== undefined && (
                <p className={styles.renovacion}>
                  Desde el segundo año: <strong>{soles(a.renovacion)}</strong> al año
                </p>
              )}
            </li>
          ))}
        </ul>

        <p className={styles.fundador} data-reveal data-entrada="sube">
          <strong>Socio Fundador.</strong> {SOCIO_FUNDADOR}
        </p>

        <div className={styles.pagos} data-reveal data-entrada="sube">
          <h3 className={`display ${styles.subtitulo}`}>Formas de pago</h3>
          <ul className={styles.listaPagos}>
            {FORMAS_DE_PAGO.map((f) => (
              <li key={f.titulo}>
                <h4>{f.titulo}</h4>
                <p>{f.detalle}</p>
              </li>
            ))}
            <li>
              <h4>Hijos de 18 a 25 años</h4>
              <p>
                {soles(HIJOS_18_A_25.precio)} al año cada uno. {HIJOS_18_A_25.detalle}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
