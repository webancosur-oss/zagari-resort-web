import BrandLockup from "../BrandLockup/BrandLockup";
import Reveal from "../Reveal/Reveal";
import Eyebrow from "../ui/Eyebrow/Eyebrow";

import styles from "./SectionIntro.module.css";

interface SectionIntroProps {
  eyebrow: string;
  description: string;

  showBrand?: boolean;

  align?: "center" | "left";

  className?: string;
}

export default function SectionIntro({
  eyebrow,
  description,
  showBrand = true,
  align = "center",
  className = "",
}: SectionIntroProps) {
  return (
    <section
      className={`${styles.section} ${
        align === "left" ? styles.left : styles.center
      } ${className}`}
    >
      <div className={styles.container}>

        <Reveal
          delay={0}
          duration={0.75}
          distance={18}
          className={styles.eyebrowReveal}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>

        <Reveal
          as="p"
          delay={0.1}
          duration={0.9}
          distance={22}
          className={styles.intro}
        >
          {showBrand && (
            <>
              <BrandLockup />{" "}
            </>
          )}

          <span className={styles.description}>
            {description}
          </span>
        </Reveal>

      </div>
    </section>
  );
}
