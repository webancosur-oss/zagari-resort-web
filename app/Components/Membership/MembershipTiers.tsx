"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown } from "reicon-react";

import MembershipBenefits from "./MembershipBenefits";
import MembershipCard from "./MembershipCard";

import type { Tier } from "./membership.data";

import Reveal from "../Reveal/Reveal";

import styles from "./Membership.module.css";

interface MembershipTiersProps {
  tiers: Tier[];

  initial?: string;

  onElegir?: (tier: Tier) => void;
}

export default function MembershipTiers({
  tiers,
  initial = "oro",
  onElegir,
}: MembershipTiersProps) {
  const [activeId, setActiveId] = useState(
    tiers.some((t) => t.id === initial)
      ? initial
      : tiers[0].id
  );

  const active =
    tiers.find((t) => t.id === activeId) ?? tiers[0];

  return (
    <Reveal
      as="section"
      className={styles.tiersSection}
      aria-label="Niveles de membresía"
    >
      <div
        data-reveal
        className={styles.tabs}
        role="tablist"
        aria-label="Elegir nivel"
      >
        {tiers.map((tier) => {
          const selected = tier.id === activeId;

          return (
            <button
              key={tier.id}
              type="button"
              role="tab"
              id={`tab-${tier.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tier.id}`}
              className={`${styles.tab} ${
                styles[tier.tone]
              } ${selected ? styles.tabActive : ""}`}
              onClick={() => setActiveId(tier.id)}
            >
              <span className={styles.tabName}>
                {tier.name}
              </span>

              <span className={styles.tabTagline}>
                {tier.tagline}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${active.id}`}
        className={`${styles.panel} ${
          styles[`panel_${active.tone}`]
        }`}
      >
        <div className={styles.panelInner} data-reveal>

          <div className={styles.panelCard}>
            <MembershipCard tier={active.name} />
          </div>

          <div className={styles.panelBody}>
            <header className={styles.panelHeader}>
              <p className={styles.panelKicker}>
                Membresía
              </p>

              <h2 className={styles.panelTitle}>
                {active.name}
              </h2>

              <span className={styles.panelBadge}>
                <Crown
                  size={14}
                  weight="Filled"
                  aria-hidden="true"
                />
                Activa
              </span>
            </header>

            <MembershipBenefits
              benefits={active.benefits}
              tone="onGold"
              columns={2}
            />

            <div className={styles.panelActions}>
              <button
                type="button"
                className={styles.actionPrimary}
                onClick={() => onElegir?.(active)}
              >
                {active.cta}
              </button>

              <Link
                href="/terminos"
                className={styles.actionSecondary}
              >
                Términos y condiciones
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Reveal>
  );
}
