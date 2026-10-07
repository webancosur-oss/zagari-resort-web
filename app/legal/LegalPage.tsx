import type { ReactNode } from "react";

import { EMPRESA } from "./empresa";

import styles from "./legal.module.css";

interface LegalPageProps {
  title: string;
  intro: string;
  children: ReactNode;
}

export default function LegalPage({
  title,
  intro,
  children,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Información legal</p>

          <h1 className={styles.title}>{title}</h1>

          <p className={styles.intro}>{intro}</p>

          <p className={styles.meta}>
            Última actualización: {EMPRESA.actualizado}
          </p>
        </header>

        <div className={styles.body}>{children}</div>

        <footer className={styles.identidad}>
          <h2>Titular</h2>

          <dl>
            <div>
              <dt>Razón social</dt>
              <dd>{EMPRESA.razonSocial}</dd>
            </div>
            <div>
              <dt>RUC</dt>
              <dd>{EMPRESA.ruc}</dd>
            </div>
            <div>
              <dt>Domicilio fiscal</dt>
              <dd>{EMPRESA.domicilioFiscal}</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>{EMPRESA.telefono}</dd>
            </div>
            <div>
              <dt>Ubicación del proyecto</dt>
              <dd>{EMPRESA.ubicacionProyecto}</dd>
            </div>
          </dl>
        </footer>
      </article>
    </main>
  );
}
