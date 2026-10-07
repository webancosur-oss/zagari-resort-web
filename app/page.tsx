import HeroInicio from "./Components/Sitio/HeroInicio";
import DestinosInicio from "./Components/Sitio/DestinosInicio";
import Ventajas from "./Components/Sitio/Ventajas";
import Promociones from "./Components/Sitio/Promociones";
import Cercanos from "./Components/Sitio/Cercanos";
import ExperienciaZagari from "./Components/Sitio/ExperienciaZagari";
import MembresiasResumen from "./Components/Sitio/MembresiasResumen";
import LlamadoFinal from "./Components/Sitio/LlamadoFinal";
import DatosEstructurados from "./Components/Seo/DatosEstructurados";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <DatosEstructurados />
      <HeroInicio />
      <DestinosInicio />
      <Ventajas />
      <Promociones />
      <Cercanos />
      <ExperienciaZagari />
      <MembresiasResumen />
      <LlamadoFinal />
    </main>
  );
}
