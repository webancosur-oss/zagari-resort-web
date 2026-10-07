"use client";

import { useState } from "react";

import styles from "./Footer.module.css";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();

        setSent(true);
      }}
    >
      <label className={styles.srOnly} htmlFor="footer-email">
        Correo electrónico
      </label>

      <div className={styles.field}>
        <input
          id="footer-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className={styles.input}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSent(false);
          }}
        />

        <button type="submit" className={styles.submit}>
          SUSCRIBIRME
        </button>
      </div>

      <p
        className={styles.formNote}
        role="status"
        aria-live="polite"
      >
        {sent ? "¡Gracias! Te escribiremos pronto." : ""}
      </p>
    </form>
  );
}
