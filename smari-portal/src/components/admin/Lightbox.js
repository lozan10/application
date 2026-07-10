'use client';

import { useEffect } from 'react';
import { X, Download } from 'lucide-react';
import styles from '../../app/admin/admin.module.css';

export default function Lightbox({ src, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!src) return null;

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>
      <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={title} className={styles.lightboxImg} />
        <div className={styles.lightboxBar}>
          <span className={styles.lightboxTitle}>{title}</span>
          <a href={src} download className={styles.lightboxBtn}>
            <Download size={15} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}
