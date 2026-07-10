'use client';

import { useEffect, useState } from 'react';

const SMARI_WEBSITE = 'https://www.smari.ac.ug/';
const REDIRECT_SECONDS = 10;

export default function SuccessScreen({ firstName, courseName, refNo, onRestart }) {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      window.location.href = SMARI_WEBSITE;
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  return (
    <div style={{
      padding: '48px 32px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      gap: 14, background: 'var(--bg)', minHeight: 360, justifyContent: 'center',
    }}>
      {/* Check Circle */}
      <div style={{
        width: 70, height: 70, borderRadius: '50%',
        background: 'linear-gradient(135deg, #39bba1, #89c242)',
        color: '#fff', display: 'grid', placeItems: 'center',
        fontSize: 34, fontWeight: 800,
        animation: 'popIn 0.5s cubic-bezier(0.3, 1.4, 0.5, 1)',
        boxShadow: '0 12px 30px -10px rgba(57,187,161,0.6)',
      }}>
        ✓
      </div>

      <h2 style={{
        margin: 0, fontSize: 26, fontWeight: 800,
        color: 'var(--ink)', letterSpacing: '-0.02em',
      }}>
        Application received
      </h2>

      <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 360 }}>
        Thank you, {firstName}. Your application for <b>{courseName}</b> is in review.
      </p>

      {/* Reference Box */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center',
        padding: '12px 26px', background: 'var(--card)',
        border: '1px dashed var(--primary)', borderRadius: 12, margin: '4px 0',
      }}>
        <span style={{
          fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--muted)', fontWeight: 700,
        }}>Your reference</span>
        <span style={{
          fontSize: 19, fontWeight: 800, color: 'var(--primary)',
          fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
        }}>{refNo}</span>
      </div>

      {/* Next Steps */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 9,
        margin: '8px 0 6px', textAlign: 'left', maxWidth: 340, width: '100%',
      }}>
        {[
          "We'll email you within 3 working days.",
          'Bring your original documents to campus.',
          'Pay to confirm your place & start learning.',
        ].map((text, i) => (
          <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'center', fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%', flex: '0 0 auto',
              display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800,
              color: '#fff', background: 'var(--primary)',
            }}>{i + 1}</span>
            {text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <a href={SMARI_WEBSITE} className="btn-primary" style={{ textDecoration: 'none' }}>
          Return to SMARI website
        </a>
        <button onClick={onRestart} className="btn-ghost">
          Start another application
        </button>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)' }}>
          Taking you back to smari.ac.ug in {secondsLeft}s…
        </p>
      </div>
    </div>
  );
}
