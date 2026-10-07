import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "reicon-react";

import FooterIcon from "./FooterIcon";
import NewsletterForm from "./NewsletterForm";

import {
  FOOTER_COLUMNS,
  FOOTER_CONTACT,
  FOOTER_LEGAL,
  FOOTER_SOCIAL,
} from "./footer.data";

import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>

      <div className={styles.brandBar}>
        <span className={styles.rule} />

        <Link href="/" className={styles.brandLink}>
          <Image
            src="/assets/logo/logo-zagari.svg"
            alt="Zagari Resort Club"
            width={700}
            height={320}
            className={styles.logo}
          />
        </Link>

        <span className={styles.rule} />
      </div>

      <div className={styles.inner}>

        <div className={styles.newsletter}>
          <h2 className={styles.heading}>
            Suscríbete y recibe nuestras novedades
          </h2>

          <NewsletterForm />

          <ul className={styles.social}>
            {FOOTER_SOCIAL.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FooterIcon name={item.icon} />

                  <span className={styles.srOnly}>
                    {item.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav
            key={column.title}
            className={styles.column}
            aria-label={column.title}
          >
            <h3 className={styles.columnTitle}>
              {column.title}
            </h3>

            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={styles.link}
                  >
                    <ArrowRight
                      size={13}
                      className={styles.arrow}
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Contacto</h3>

          <ul className={styles.contact}>
            {FOOTER_CONTACT.map((item) => {
              const cuerpo = (
                <>
                  <span className={styles.contactIcon}>
                    <FooterIcon name={item.icon} />
                  </span>

                  <span>
                    {item.lines.map((line) => (
                      <span
                        key={line}
                        className={styles.contactLine}
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                </>
              );

              return (
                <li
                  key={item.icon}
                  className={styles.contactItem}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className={styles.contactLink}
                      {...(item.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      {cuerpo}
                    </a>
                  ) : (
                    cuerpo
                  )}
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} Zagari Resort Club. Todos los derechos
          reservados.
        </p>

        <ul className={styles.legal}>
          {FOOTER_LEGAL.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
