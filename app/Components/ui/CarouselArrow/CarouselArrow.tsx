import { ChevronLeft, ChevronRight } from "reicon-react";

import styles from "./CarouselArrow.module.css";

interface CarouselArrowProps {
  direction: "prev" | "next";

  onClick: () => void;

  disabled?: boolean;

  tone?: "dark" | "light" | "plain";

  label?: string;

  className?: string;
}

export default function CarouselArrow({
  direction,
  onClick,
  disabled = false,
  tone = "dark",
  label,
  className = "",
}: CarouselArrowProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      className={`${styles.arrow} ${
        styles[tone]
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={
        label ??
        (isPrev ? "Anterior" : "Siguiente")
      }
    >
      {isPrev ? (
        <ChevronLeft size={20} aria-hidden="true" />
      ) : (
        <ChevronRight size={20} aria-hidden="true" />
      )}
    </button>
  );
}
