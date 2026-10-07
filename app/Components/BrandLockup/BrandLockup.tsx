import styles from "./BrandLockup.module.css";

interface BrandLockupProps {
  variant?: "inline" | "block";

  className?: string;
}

export default function BrandLockup({
  variant = "inline",
  className = "",
}: BrandLockupProps) {
  return (
    <span
      className={`${styles.lockup} ${
        variant === "block" ? styles.block : styles.inline
      } ${className}`}
    >
      <span className={styles.zagari}>Zagari</span>{" "}
      <span className={styles.resort}>Resort</span>{" "}
      <span className={styles.club}>Club</span>
    </span>
  );
}
