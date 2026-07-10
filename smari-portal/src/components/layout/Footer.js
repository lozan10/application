import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

const SITE = 'https://www.smari.ac.ug';

const PROGRAM_LINKS = [
  { label: 'Media & Creative Arts', href: `${SITE}/programs/media/` },
  { label: 'Sales & Marketing', href: `${SITE}/programs/marketing/` },
  { label: 'Hospitality Management', href: `${SITE}/programs/hospitality/` },
  { label: 'Personal Development', href: `${SITE}/programs/personal/` },
];

const ADMISSIONS_LINKS = [
  { label: 'Apply Now', href: '/apply', internal: true },
  { label: 'Requirements', href: `${SITE}/admissions/requirements/` },
  { label: 'Important Dates', href: `${SITE}/admissions/dates/` },
  { label: 'Tuition & Fees', href: `${SITE}/admissions/fees/` },
];

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 2H21l-6.52 7.45L22 22h-6.16l-4.82-6.32L5.5 22H2.74l6.98-7.98L2 2h6.31l4.36 5.77L18.24 2Zm-1.08 18h1.71L7.03 3.9H5.2L17.16 20Z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <span className={`${styles.tape} ${styles.tapeLeft}`} aria-hidden="true" />
          <span className={`${styles.tape} ${styles.tapeRight}`} aria-hidden="true" />

          <div className={styles.cardInner}>
            <div className={styles.brandCol}>
              <img src="/smari-logo.svg" alt="SMARI Institute" className={styles.logo} />
              <p className={styles.tagline}>
                Level 1 course applications for the 2026 intake — Media &amp; Creative Arts,
                Hospitality, Sales &amp; Marketing and Personal Development.
              </p>
            </div>

            <div className={styles.linkGrid}>
              <div className={styles.col}>
                <div className={styles.colTitle}>Programs</div>
                {PROGRAM_LINKS.map((item) => (
                  <a key={item.href} href={item.href} className={styles.link}>
                    {item.label}
                  </a>
                ))}
              </div>

              <div className={styles.col}>
                <div className={styles.colTitle}>Admissions</div>
                {ADMISSIONS_LINKS.map((item) =>
                  item.internal ? (
                    <Link key={item.href} href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <a key={item.href} href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  )
                )}
              </div>

              <div className={styles.col}>
                <div className={styles.colTitle}>Contact</div>
                <a href="https://wa.me/256758816661" className={styles.link}>
                  <MessageCircle size={14} strokeWidth={2.2} /> +256 758 816661
                </a>
                <a href="tel:0200920200" className={styles.link}>
                  <Phone size={14} strokeWidth={2.2} /> 0200 920 200
                </a>
                <a href="mailto:info@smari.ac.ug" className={styles.link}>
                  <Mail size={14} strokeWidth={2.2} /> info@smari.ac.ug
                </a>
                <span className={styles.staticLine}>
                  <MapPin size={14} strokeWidth={2.2} /> Victoria Building, Level 6, Kampala
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span className={styles.copyright}>© {year} SMARI Institute. All rights reserved.</span>
            <div className={styles.legalLinks}>
              <a href={`${SITE}/privacy/`}>Privacy Policy</a>
              <a href={`${SITE}/terms/`}>Terms of Service</a>
              <a href={SITE}>Main Website</a>
            </div>
          </div>

          <div className={styles.socials}>
            <a
              href="https://www.facebook.com/smariinstitute/"
              target="_blank"
              rel="nofollow noopener"
              aria-label="SMARI Institute on Facebook"
              className={styles.socialIcon}
            >
              <FacebookIcon width={16} height={16} />
            </a>
            <a
              href="https://www.instagram.com/smari_institute/"
              target="_blank"
              rel="nofollow noopener"
              aria-label="SMARI Institute on Instagram"
              className={styles.socialIcon}
            >
              <InstagramIcon width={16} height={16} />
            </a>
            <a
              href="https://x.com/smari_institute"
              target="_blank"
              rel="nofollow noopener"
              aria-label="SMARI Institute on X"
              className={styles.socialIcon}
            >
              <XIcon width={15} height={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
