import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: React.ReactNode;

  tone?: "dark" | "light";

  className?: string;
}

export default function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: EyebrowProps) {
  return (
    <span
      className={`${styles.pill} ${
        tone === "light" ? styles.light : styles.dark
      } ${className}`}
    >
      <span className={styles.text}>{children}</span>

      <span
        className={styles.glow}
        aria-hidden="true"
      />
    </span>
  );
}
