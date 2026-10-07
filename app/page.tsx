import LandingHero from "./Components/Landing/LandingHero";
import { CategoriaProvider } from "./Components/Comercial/CategoriaElegida";
import Presentacion from "./Components/Comercial/Presentacion";
import Membresias from "./Components/Comercial/Membresias";
import Experiencias from "./Components/Comercial/Experiencias";
import Puntos from "./Components/Comercial/Puntos";
import Visita from "./Components/Comercial/Visita";
import Preguntas from "./Components/Comercial/Preguntas";
import Contacto from "./Components/Comercial/Contacto";
import LocationRoute from "./Components/LocationRoute/LocationRoute";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <CategoriaProvider>
        <LandingHero />
        <Presentacion />
        <Membresias />
        <Experiencias />
        <Puntos />
        <Visita />
        <Preguntas />

        <div id="ubicacion">
          <LocationRoute />
        </div>

        <Contacto />
      </CategoriaProvider>
    </main>
  );
}
