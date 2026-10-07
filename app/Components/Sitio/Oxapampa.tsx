"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Notification } from "reicon-react";

import Reveal from "../Reveal/Reveal";
import { DESTINOS } from "../../lib/contenido";
import { enviarLead } from "../../lib/leads";
import { validarNombre, validarTelefono, type Errores } from "../../lib/validacion";
import { useToast } from "../ui/Toast/ToastProvider";

import comun from "../Comercial/comercial.module.css";
import sitio from "./sitio.module.css";
import styles from "./Oxapampa.module.css";

const OXAPAMPA = DESTINOS.find((d) => d.id === "oxapampa")!;

/** Oxapampa, próximamente: guarda el interés como lead. */
export default function Oxapampa() {
  const { mostrar } = useToast();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;

    const nuevos: Errores = {};
    const n = validarNombre(nombre);
    const t = validarTelefono(telefono);
    if (n) nuevos.nombre = n;
    if (t) nuevos.telefono = t;
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    setEnviando(true);
    const resultado = await enviarLead({
      codigoFormulario: "zagari_oxapampa_avisame",
      nombreFormulario: "Avísame cuando abra — Oxapampa",
      tipoFormulario: "promocion",
      nombre,
      telefono,
      interes: "Destino Oxapampa (próximamente)",
    });
    setEnviando(false);
    mostrar(resultado.ok ? "exito" : "error", resultado.ok ? "Listo: te avisaremos cuando abra Oxapampa." : resultado.mensaje);
    if (resultado.ok) {
      setListo(true);
      setNombre("");
      setTelefono("");
    }
  };

  return (
    <Reveal as="section" id="oxapampa" className={comun.seccion}>
      <div className={comun.inner}>
        <div className={styles.tarjeta}>
          <Image src={OXAPAMPA.foto.src} alt={OXAPAMPA.foto.alt} fill sizes="100vw" className={styles.imagen} />
          <span className={styles.velo} aria-hidden="true" />

          <div className={styles.contenido} data-reveal data-entrada="sube">
            <span className={sitio.pildora}>Próximamente</span>
            <h2 className={`display ${styles.titulo}`}>{OXAPAMPA.nombre}</h2>
            <p className={styles.region}>{OXAPAMPA.region}</p>
            <p className={styles.texto}>{OXAPAMPA.resumen}</p>

            {listo ? (
              <p className={styles.listo} role="status">
                <Notification size={18} aria-hidden="true" />
                Te avisaremos por WhatsApp cuando abra Oxapampa.
              </p>
            ) : (
              <form className={styles.formulario} onSubmit={enviar} noValidate>
                <label className={styles.campo}>
                  <span className={styles.oculto}>Nombre y apellidos</span>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre y apellidos"
                    autoComplete="name"
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={errores.nombre ? "oxa-nombre" : undefined}
                  />
                  {errores.nombre && (
                    <span id="oxa-nombre" className={styles.error}>
                      {errores.nombre}
                    </span>
                  )}
                </label>
                <label className={styles.campo}>
                  <span className={styles.oculto}>Celular</span>
                  <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Celular"
                    inputMode="tel"
                    autoComplete="tel-national"
                    aria-invalid={Boolean(errores.telefono)}
                    aria-describedby={errores.telefono ? "oxa-telefono" : undefined}
                  />
                  {errores.telefono && (
                    <span id="oxa-telefono" className={styles.error}>
                      {errores.telefono}
                    </span>
                  )}
                </label>
                <button type="submit" className={styles.enviar} disabled={enviando}>
                  {enviando ? "Enviando…" : "Avísame cuando abra"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
