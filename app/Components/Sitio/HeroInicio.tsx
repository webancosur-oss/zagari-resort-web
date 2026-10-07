import Image from "next/image";

import Buscador from "./Buscador";

import styles from "./HeroInicio.module.css";

/** Hero del inicio: foto fija a sangre y el buscador de reservas encima. */
export default function HeroInicio() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="titulo-inicio">
      <div className={styles.escena}>
        <Image
          src="/assets/images/heroes/zagari-hero.jpg"
          alt="Piscina de Zagari Resort Club al atardecer, frente a las montañas de San Ramón"
          fill
          preload
          sizes="100vw"
          className={styles.imagen}
        />
        <span className={styles.velo} aria-hidden="true" />

        <div className={styles.texto}>
          <p className={styles.lugar}>Zagari Resort Club · San Ramón, Selva Central</p>
          <h1 id="titulo-inicio" className={`display ${styles.titulo}`}>
            Más cerca de lo natural
          </h1>
          <p className={styles.parrafo}>
            Un club privado de naturaleza, descanso y experiencias, a 15 minutos de San Ramón.
          </p>
        </div>
      </div>

      <div className={styles.barra}>
        <Buscador />
      </div>
    </section>
  );
}
