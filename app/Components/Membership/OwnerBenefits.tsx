import BenefitIcon from "./BenefitIcon";
import MembershipBenefits from "./MembershipBenefits";
import MembershipCard from "./MembershipCard";

import {
  ORO_BENEFITS,
  OWNER_HIGHLIGHTS,
} from "./membership.data";

import styles from "./Membership.module.css";
import owner from "./Owner.module.css";

export default function OwnerBenefits() {
  return (
    <section
      className={`${styles.panel} ${styles.panel_oro}`}
      aria-label="Beneficios para propietarios"
    >
      <div className={owner.inner}>

        <p className={owner.pill}>
          Tu lote en Zagari te otorga
        </p>

        <h2 className={owner.title}>Membresía Oro</h2>

        <p className={owner.lead}>
          Desde el primer año, sin costo. Disfruta de todos
          los beneficios del club y vive experiencias únicas
          rodeado de naturaleza.
        </p>

        <div className={owner.top}>
          <div className={owner.card}>
            <MembershipCard tier="Oro" />
          </div>

          <ul className={owner.highlights}>
            {OWNER_HIGHLIGHTS.map((item) => (
              <li
                key={item.title}
                className={owner.highlight}
              >
                <span className={owner.highlightIcon}>
                  <BenefitIcon name={item.icon} size={18} />
                </span>

                <span>
                  <span className={owner.highlightTitle}>
                    {item.title}
                  </span>

                  <span className={owner.highlightDetail}>
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className={owner.pill}>
          Tus beneficios como propietario
        </p>

        <MembershipBenefits
          benefits={ORO_BENEFITS}
          tone="onGold"
          columns={4}
        />

      </div>
    </section>
  );
}
