"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CloseCircle, TickCircle, Warning } from "reicon-react";

import styles from "./Toast.module.css";

type Tono = "exito" | "error" | "aviso";

interface Toast {
  id: number;
  tono: Tono;
  texto: string;
}

interface ToastApi {
  mostrar: (tono: Tono, texto: string) => void;
}

const Contexto = createContext<ToastApi | null>(null);

export function useToast() {
  const api = useContext(Contexto);

  if (!api) {
    throw new Error(
      "useToast debe usarse dentro de <ToastProvider>"
    );
  }

  return api;
}

const DURACION = 6000;

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lista, setLista] = useState<Toast[]>([]);

  const cerrar = useCallback((id: number) => {
    setLista((l) => l.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (tono: Tono, texto: string) => {
      const id = Date.now() + Math.random();

      setLista((l) => [...l, { id, tono, texto }]);

      window.setTimeout(() => cerrar(id), DURACION);
    },
    [cerrar]
  );

  const api = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <Contexto.Provider value={api}>
      {children}

      <div
        className={styles.zona}
        role="status"
        aria-live="polite"
      >
        {lista.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${styles[t.tono]}`}
          >
            <span className={styles.icono}>
              {t.tono === "exito" && (
                <TickCircle size={20} weight="Filled" aria-hidden="true" />
              )}
              {t.tono === "error" && (
                <CloseCircle size={20} weight="Filled" aria-hidden="true" />
              )}
              {t.tono === "aviso" && (
                <Warning size={20} weight="Filled" aria-hidden="true" />
              )}
            </span>

            <p className={styles.texto}>{t.texto}</p>

            <button
              type="button"
              className={styles.cerrar}
              onClick={() => cerrar(t.id)}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Contexto.Provider>
  );
}
