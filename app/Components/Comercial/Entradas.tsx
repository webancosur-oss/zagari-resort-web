import { InfoCircle } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { AVISO_TARIFAS, ENTRADAS, soles } from "../../lib/modelo";
import Cabecera from "./Cabecera";

import comun from "./comercial.module.css";
import styles from "./Entradas.module.css";

export default function Entradas() {
  return (
    <Reveal as="section" id="entradas" className={`${comun.seccion} ${comun.claro}`}>
      <div className={comun.inner}>
        <Cabecera
          etiqueta="Invitados y entradas"
          titulo={
            <>
              Para venir <em>sin ser socio</em>
            </>
          }
          intro="Cualquiera puede conocer el club con una entrada por el día. Cada categoría incluye invitados sin costo al año; los adicionales pagan su entrada con el descuento del socio."
        >
          <p className={comun.aviso} role="note" data-reveal data-entrada="sube">
            <InfoCircle size={18} aria-hidden="true" />
            {AVISO_TARIFAS}
          </p>
        </Cabecera>

        <div className={styles.rejilla} data-reveal data-entrada="sube">
          <article className={styles.tarjeta}>
            <h3 className={styles.titulo}>Entrada por día</h3>
            <dl className={styles.precios}>
              <div>
                <dt>Adulto</dt>
                <dd className={styles.monto}>{soles(ENTRADAS.adulto.precio)}</dd>
                  <dd className={styles.detalle}>{ENTRADAS.adulto.detalle}</dd>
              </div>
              <div>
                <dt>Niño</dt>
                <dd className={styles.monto}>{soles(ENTRADAS.nino.precio)}</dd>
                  <dd className={styles.detalle}>{ENTRADAS.nino.detalle}</dd>
              </div>
            </dl>
            <p className={styles.pie}>
              {ENTRADAS.gratis}. {ENTRADAS.sinPuntos}
            </p>
          </article>

          <article className={styles.tarjeta}>
            <h3 className={styles.titulo}>Invitado adicional de un socio</h3>
            <dl className={styles.precios}>
              {ENTRADAS.invitadoAdicional.map((i) => (
                <div key={i.categoria}>
                  <dt>Socio {i.categoria}</dt>
                  <dd className={styles.monto}>{soles(i.precio)}</dd>
                  <dd className={styles.detalle}>{i.detalle}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.pie}>{ENTRADAS.regla}</p>
          </article>
        </div>
      </div>
    </Reveal>
  );
}
