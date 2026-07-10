import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <img src="/smari-logo.svg" alt="SMARI Institute" className={styles.logo} />
          <span className={styles.brandText}>
            <span className={styles.brandName}>SMARI Institute</span>
            <span className={styles.brandSub}>Application Portal</span>
          </span>
        </Link>

        <a href="https://www.smari.ac.ug/" className={styles.backLink} aria-label="Back to website">
          <span className={styles.backArrow} aria-hidden="true">←</span>
          <span className={styles.backLabel}>Back to website</span>
        </a>
      </div>
    </header>
  );
}
