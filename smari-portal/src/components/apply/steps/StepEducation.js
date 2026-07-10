'use client';

export default function StepEducation({ data, errors, setField, onField, narrow }) {
  const educationLevels = [
    'Primary (PLE)', 'O-Level (UCE)', 'A-Level (UACE)',
    'Certificate', 'Diploma', "Bachelor's degree", 'Other',
  ];

  return (
    <div>
      {/* Education Level */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">Highest level completed</label>
        <select
          name="education"
          value={data.education}
          onChange={onField}
          className={`form-input ${errors.education ? 'error' : ''}`}
        >
          <option value="">Select level…</option>
          {educationLevels.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        {errors.education && <div className="form-error">{errors.education}</div>}
      </div>

      {/* School */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">School / Institution</label>
        <input name="school" value={data.school} onChange={onField} placeholder="Name of your last school" className={`form-input ${errors.school ? 'error' : ''}`} />
        {errors.school && <div className="form-error">{errors.school}</div>}
      </div>

      {/* Year + Working */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Year completed</label>
          <input name="yearDone" value={data.yearDone} onChange={onField} placeholder="e.g. 2024" className="form-input" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Do you work currently?</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Yes', 'No'].map(w => (
              <button
                key={w}
                type="button"
                onClick={() => setField('working', w)}
                style={{
                  padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: data.working === w ? 'var(--primary)' : 'var(--card)',
                  color: data.working === w ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${data.working === w ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
