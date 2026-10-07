import BenefitIcon from "./BenefitIcon";

import type { Benefit } from "./membership.data";

import styles from "./Membership.module.css";

interface MembershipBenefitsProps {
  benefits: Benefit[];

  tone?: "onGold" | "onLight";

  columns?: 2 | 4;
}

export default function MembershipBenefits({
  benefits,
  tone = "onGold",
  columns = 2,
}: MembershipBenefitsProps) {
  return (
    <ul
      className={`${styles.benefits} ${
        tone === "onLight" ? styles.onLight : styles.onGold
      } ${columns === 4 ? styles.cols4 : styles.cols2}`}
    >
      {benefits.map((benefit) => (
        <li
          key={benefit.title + benefit.detail}
          className={styles.benefit}
        >
          <span className={styles.benefitIcon}>
            <BenefitIcon name={benefit.icon} />
          </span>

          <span className={styles.benefitText}>
            <span className={styles.benefitTitle}>
              {benefit.title}
            </span>

            <span className={styles.benefitDetail}>
              {benefit.detail}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
