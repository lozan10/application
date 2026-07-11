import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.content}>
            <span className={styles.kicker}>2026 intake now open</span>

            <h1 className={styles.title}>Apply to SMARI Institute in minutes</h1>

            <p className={styles.subtitle}>
              Choose from 26 Level 1 programmes in Media &amp; Creative Arts, Hospitality, Sales &amp;
              Marketing and Personal Development — and submit your application online today.
            </p>

            <div className={styles.ctaRow}>
              <a href="https://admissions.smari.ac.ug/" className={styles.cta}>
                Start Your Application
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </a>
            </div>

            <p className={styles.help}>
              Need help? WhatsApp <b>+256 758 816661</b> · info@smari.ac.ug
              <br />Victoria Building, Level 6, Kampala
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardHeadTitle}>Level 1 programme</span>
              <span className={styles.cardHeadBadge}>2026 intake</span>
            </div>

            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <span className={styles.statValue}>26</span>
                <span className={styles.statLabel}>Programmes on offer</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>1–9 mo</span>
                <span className={styles.statLabel}>Course duration</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>395K</span>
                <span className={styles.statLabel}>UGX tuition</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>3 days</span>
                <span className={styles.statLabel}>Review turnaround</span>
              </div>
            </div>

            <div className={styles.cardFoot}>
              <span className={styles.cardFootDot} />
              Applications open — apply online, no visit required
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
