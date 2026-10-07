"use client";

import { useState, type ReactNode } from "react";

import { enviarLead } from "../../lib/leads";
import {
  validarEmail,
  validarNombre,
  validarTelefono,
  type Errores,
} from "../../lib/validacion";
import { useToast } from "../ui/Toast/ToastProvider";

import Reveal from "../Reveal/Reveal";

import styles from "./ContactForm.module.css";

export interface ContactFormOption {
  value: string;
  label: string;
}

interface ContactFormProps {
  id?: string;

  title: string;
  lead: string;

  selectLabel?: string;
  selectOptions?: ContactFormOption[];

  selectValue?: string;

  submitLabel?: string;

  codigoFormulario: string;
  nombreFormulario: string;
  tipoFormulario?: "contacto" | "lotes" | "promocion";

  /** Contenido junto al formulario; con él, la sección pasa a dos columnas. */
  complemento?: ReactNode;
}

const VACIO = {
  nombre: "",
  email: "",
  telefono: "",
  tipo: "",
  mensaje: "",
};

export default function ContactForm({
  id = "formulario-contacto",
  title,
  lead,
  selectLabel,
  selectOptions,
  selectValue,
  submitLabel = "Enviar solicitud",
  codigoFormulario,
  nombreFormulario,
  tipoFormulario = "contacto",
  complemento,
}: ContactFormProps) {
  const [campos, setCampos] = useState({
    ...VACIO,
    tipo: selectOptions?.[0]?.value ?? "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const { mostrar } = useToast();

  const [ultimaCategoria, setUltimaCategoria] =
    useState(selectValue);

  if (selectValue && selectValue !== ultimaCategoria) {
    setUltimaCategoria(selectValue);
    setCampos((c) => ({ ...c, tipo: selectValue }));
  }

  const validar = () => {
    const e: Errores = {};

    const n = validarNombre(campos.nombre);
    const c = validarEmail(campos.email);
    const t = validarTelefono(campos.telefono);

    if (n) e.nombre = n;
    if (c) e.email = c;
    if (t) e.telefono = t;

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

    const etiqueta = selectOptions?.find(
      (o) => o.value === campos.tipo
    )?.label;

    const resultado = await enviarLead({
      codigoFormulario,
      nombreFormulario,
      tipoFormulario,
      nombre: campos.nombre,
      telefono: campos.telefono,
      email: campos.email,
      mensaje: campos.mensaje,
      interes: etiqueta
        ? `${selectLabel}: ${etiqueta}`
        : undefined,
    });

    setEnviando(false);

    mostrar(resultado.ok ? "exito" : "error", resultado.mensaje);

    if (resultado.ok) {
      setCampos({
        ...VACIO,
        tipo: selectOptions?.[0]?.value ?? "",
      });
      setErrores({});
    }
  };

  const texto = (
    clave: "nombre" | "email" | "telefono",
    etiqueta: string,
    extra: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{etiqueta}</span>

      <input
        {...extra}
        value={campos[clave]}
        onChange={(e) => {
          setCampos((c) => ({
            ...c,
            [clave]: e.target.value,
          }));
          setErrores((x) => ({ ...x, [clave]: "" }));
        }}
        className={`${styles.input} ${
          errores[clave] ? styles.inputError : ""
        }`}
        aria-invalid={Boolean(errores[clave])}
        aria-describedby={
          errores[clave] ? `err-${clave}` : undefined
        }
      />

      {errores[clave] && (
        <span id={`err-${clave}`} className={styles.error}>
          {errores[clave]}
        </span>
      )}
    </label>
  );

  return (
    <Reveal
      as="section"
      id={id}
      className={`${styles.section} ${complemento ? styles.conComplemento : ""}`}
      aria-label={title}
    >
      <div className={styles.inner}>
        <div className={styles.cabecera}>
          <h2 className={`display ${styles.title}`} data-reveal>
            {title}
          </h2>

          <p className={styles.lead} data-reveal>
            {lead}
          </p>

          {complemento && <div data-reveal>{complemento}</div>}
        </div>

        <form
          data-reveal
          className={styles.form}
          onSubmit={enviar}
          noValidate
        >
          <div className={styles.grid}>
            {texto("nombre", "Nombre y apellidos", {
              type: "text",
              autoComplete: "name",
              placeholder: "Ana Pérez Quispe",
            })}

            {texto("email", "Correo electrónico", {
              type: "email",
              autoComplete: "email",
              placeholder: "ana@correo.com",
            })}

            {texto("telefono", "Teléfono", {
              type: "tel",
              inputMode: "numeric",
              autoComplete: "tel",
              placeholder: "9XXXXXXXX",
              maxLength: 9,
            })}

            {selectOptions && selectOptions.length > 0 && (
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  {selectLabel}
                </span>

                <select
                  value={campos.tipo}
                  onChange={(e) =>
                    setCampos((c) => ({
                      ...c,
                      tipo: e.target.value,
                    }))
                  }
                  className={styles.input}
                >
                  {selectOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label
              className={`${styles.field} ${styles.fieldWide}`}
            >
              <span className={styles.fieldLabel}>
                Mensaje (opcional)
              </span>

              <textarea
                rows={4}
                value={campos.mensaje}
                onChange={(e) =>
                  setCampos((c) => ({
                    ...c,
                    mensaje: e.target.value,
                  }))
                }
                className={`${styles.input} ${styles.textarea}`}
              />
            </label>
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={enviando}
          >
            {enviando ? "Enviando…" : submitLabel}
          </button>

          <p className={styles.note}>
            Al enviar aceptas nuestra{" "}
            <a href="/privacidad">política de privacidad</a>.
          </p>
        </form>
      </div>
    </Reveal>
  );
}
