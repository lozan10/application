'use client';

export default function StepReview({ data, errors, setField, selectedCourse }) {
  const reviewItems = [
    { k: 'Course', v: selectedCourse?.name || '—' },
    { k: 'Full name', v: data.fullName || '—' },
    { k: 'Date of birth', v: data.dob || '—' },
    { k: 'Gender', v: data.gender || '—' },
    { k: 'Phone', v: data.phone || '—' },
    { k: 'Email', v: data.email || '—' },
    { k: 'Address', v: [data.address, data.city].filter(Boolean).join(', ') || '—' },
    { k: 'Education', v: [data.education, data.school].filter(Boolean).join(' · ') || '—' },
    { k: 'Funding', v: data.funding || '—' },
    { k: 'ID document', v: data.idDocName || '—' },
  ];

  return (
    <div>
      {/* Review Table */}
      <div style={{
        border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 18,
      }}>
        {reviewItems.map((r, i) => (
          <div key={r.k} style={{
            display: 'flex', justifyContent: 'space-between', gap: 16,
            padding: '12px 16px', borderBottom: i < reviewItems.length - 1 ? '1px solid var(--border)' : 'none',
            background: 'var(--card)',
          }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', flex: '0 0 auto' }}>{r.k}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Agreement */}
      <label style={{
        display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 13, lineHeight: 1.5,
        color: 'var(--ink)', cursor: 'pointer', padding: '2px 0',
      }}>
        <input
          type="checkbox"
          checked={data.agree}
          onChange={(e) => setField('agree', e.target.checked)}
          style={{
            width: 18, height: 18, marginTop: 1,
            accentColor: 'var(--primary)', flex: '0 0 auto', cursor: 'pointer',
          }}
        />
        <span>I confirm the information above is accurate and I accept SMARI&apos;s admission terms.</span>
      </label>
      {errors.agree && <div className="form-error">{errors.agree}</div>}
    </div>
  );
}
