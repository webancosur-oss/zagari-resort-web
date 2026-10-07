"use client";

import { useEffect, useRef, useState } from "react";

import { enviarLead } from "../../lib/leads";
import {
  validarDni,
  validarNombre,
  validarTelefono,
  type Errores,
} from "../../lib/validacion";
import { useToast } from "../ui/Toast/ToastProvider";

import styles from "./WhatsAppWidget.module.css";

const NUMERO = "51971069763";

const MENSAJE =
  "Hola Zagari Resort Club, quisiera recibir más información.";

function enlaceWhatsApp(nombre?: string) {
  const texto = nombre
    ? `Hola Zagari Resort Club, soy ${nombre} y quisiera recibir más información.`
    : MENSAJE;

  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(
    texto
  )}&type=phone_number&app_absent=0`;
}

export default function WhatsAppWidget() {
  const [abierto, setAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [campos, setCampos] = useState({
    nombre: "",
    telefono: "",
    dni: "",
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const primeroRef = useRef<HTMLInputElement>(null);

  const { mostrar } = useToast();

  useEffect(() => {
    if (!abierto) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };

    const onFuera = (e: PointerEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onFuera);

    primeroRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onFuera);
    };
  }, [abierto]);

  const validar = () => {
    const e: Errores = {};

    const n = validarNombre(campos.nombre);
    const t = validarTelefono(campos.telefono);
    const d = validarDni(campos.dni);

    if (n) e.nombre = n;
    if (t) e.telefono = t;
    if (d) e.dni = d;

    setErrores(e);

    return Object.keys(e).length === 0;
  };

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (enviando) return;

    if (!validar()) {
      mostrar("aviso", "Revisa los campos marcados.");
      return;
    }

    setEnviando(true);

    const resultado = await enviarLead({
      codigoFormulario: "zagari_whatsapp",
      nombreFormulario: "Asistente WhatsApp Zagari",
      tipoFormulario: "contacto",
      nombre: campos.nombre,
      telefono: campos.telefono,
      dni: campos.dni,
      interes: "WhatsApp Web Zagari",
    });

    setEnviando(false);

    mostrar(resultado.ok ? "exito" : "error", resultado.mensaje);

    if (resultado.ok) {
      setAbierto(false);
      setCampos({ nombre: "", telefono: "", dni: "" });

      window.open(
        enlaceWhatsApp(campos.nombre.trim().split(" ")[0]),
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const campo = (
    id: "nombre" | "telefono" | "dni",
    etiqueta: string,
    extra: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <label className={styles.campo}>
      <span className={styles.etiqueta}>{etiqueta}</span>

      <input
        {...extra}
        ref={id === "nombre" ? primeroRef : undefined}
        value={campos[id]}
        onChange={(e) => {
          setCampos((c) => ({ ...c, [id]: e.target.value }));
          setErrores((x) => ({ ...x, [id]: "" }));
        }}
        className={`${styles.input} ${
          errores[id] ? styles.inputError : ""
        }`}
        aria-invalid={Boolean(errores[id])}
        aria-describedby={
          errores[id] ? `err-${id}` : undefined
        }
      />

      {errores[id] && (
        <span id={`err-${id}`} className={styles.error}>
          {errores[id]}
        </span>
      )}
    </label>
  );

  return (
    <div className={styles.raiz}>
      {abierto && (
        <div ref={panelRef} className={styles.panel}>
          <header className={styles.cabecera}>
            <div>
              <p className={styles.titulo}>
                ¿Necesitas ayuda?
              </p>
              <p className={styles.subtitulo}>
                Déjanos tus datos y te escribimos.
              </p>
            </div>

            <button
              type="button"
              className={styles.cerrar}
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </header>

          <form className={styles.form} onSubmit={enviar} noValidate>
            {campo("nombre", "Nombres y apellidos", {
              type: "text",
              autoComplete: "name",
              placeholder: "Ana Pérez Quispe",
            })}

            {campo("telefono", "Teléfono", {
              type: "tel",
              inputMode: "numeric",
              autoComplete: "tel",
              placeholder: "9XXXXXXXX",
              maxLength: 9,
            })}

            {campo("dni", "DNI", {
              type: "text",
              inputMode: "numeric",
              placeholder: "8 dígitos",
              maxLength: 8,
            })}

            <button
              type="submit"
              className={styles.enviar}
              disabled={enviando}
            >
              {enviando ? "Enviando…" : "Continuar en WhatsApp"}
            </button>

            <p className={styles.nota}>
              Al enviar aceptas nuestra{" "}
              <a href="/privacidad">política de privacidad</a>.
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        className={styles.flotante}
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={
          abierto
            ? "Cerrar el asistente de WhatsApp"
            : "Abrir el asistente de WhatsApp"
        }
      >
        <svg
          viewBox="0 0 24 24"
          width="27"
          height="27"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84a9.6 9.6 0 0 0 1.32 4.86L2 22l5.44-1.42a9.86 9.86 0 0 0 4.6 1.16h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm5.76 13.98c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.12.07-1.81-.11a16.4 16.4 0 0 1-1.64-.6c-2.89-1.25-4.77-4.16-4.92-4.35-.14-.2-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36l.55.01c.17.01.41-.7.64.49.24.56.81 1.97.88 2.12.07.14.12.31.02.5-.09.2-.14.32-.28.49l-.42.49c-.14.14-.28.3-.12.58.16.29.72 1.18 1.54 1.91 1.06.94 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.17-.2.7-.81.88-1.09.19-.29.37-.24.62-.14.26.09 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.68-.17 1.35Z" />
        </svg>
      </button>
    </div>
  );
}
