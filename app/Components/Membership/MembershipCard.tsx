import Image from "next/image";

import styles from "./Membership.module.css";

interface MembershipCardProps {
  tier: string;
  number?: string;
}

export default function MembershipCard({
  tier,
  number = "MEMBER 001",
}: MembershipCardProps) {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.cardTop}>
        <Image
          src="/assets/logo/logo-zagari.svg"
          alt=""
          width={700}
          height={320}
          className={styles.cardLogo}
        />

        <span className={styles.cardTier}>
          <span className={styles.cardTierLabel}>
            Membresía
          </span>

          <span className={styles.cardTierName}>
            {tier}
          </span>
        </span>
      </div>

      <span className={styles.cardNumber}>{number}</span>
    </div>
  );
}
