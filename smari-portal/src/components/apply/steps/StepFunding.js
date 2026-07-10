'use client';

const FUND_OPTIONS = ['Self / family funded', 'Scholarship', 'Employer sponsored', 'Instalment plan'];
const HEARD_OPTIONS = ['Social media', 'Friend or family', 'SMARI website', 'Radio / TV', 'Event or workshop', 'Other'];

export default function StepFunding({ data, errors, setField, onField, narrow }) {
  const onIdDoc = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setField('idDocFile', f);
      setField('idDocName', f.name);
    }
  };

  const onCertDoc = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setField('certDocFile', f);
      setField('certDocName', f.name);
    }
  };

  return (
    <div>
      {/* Funding */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">How will your studies be funded?</label>
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 10 }}>
          {FUND_OPTIONS.map(f => {
            const sel = data.funding === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setField('funding', f)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '13px 15px',
                  borderRadius: 12, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                  background: sel ? 'var(--primary-soft)' : 'var(--card)',
                  color: 'var(--ink)',
                  border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', flex: '0 0 auto',
                  display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, color: '#fff',
                  background: sel ? 'var(--primary)' : 'transparent',
                  border: `1.5px solid ${sel ? 'var(--primary)' : 'var(--border)'}`,
                }}>
                  {sel ? '✓' : ''}
                </span>
                {f}
              </button>
            );
          })}
        </div>
        {errors.funding && <div className="form-error">{errors.funding}</div>}
      </div>

      {/* File Uploads */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">National ID / Passport</label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px',
            border: '1.5px dashed var(--border)', borderRadius: 11, cursor: 'pointer',
            background: 'var(--bg)', transition: 'border-color 0.15s',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 8,
              background: 'var(--primary-soft)', color: 'var(--primary)',
              display: 'grid', placeItems: 'center', fontSize: 13, flex: '0 0 auto',
            }}>⬆</span>
            <span style={{
              fontSize: 13, fontWeight: 600, color: 'var(--muted)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {data.idDocName || 'Tap to upload'}
            </span>
            <input type="file" onChange={onIdDoc} style={{ display: 'none' }} />
          </label>
          {errors.idDoc && <div className="form-error">{errors.idDoc}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">
            Certificate / Results <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>optional</span>
          </label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px',
            border: '1.5px dashed var(--border)', borderRadius: 11, cursor: 'pointer',
            background: 'var(--bg)', transition: 'border-color 0.15s',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 8,
              background: 'var(--primary-soft)', color: 'var(--primary)',
              display: 'grid', placeItems: 'center', fontSize: 13, flex: '0 0 auto',
            }}>⬆</span>
            <span style={{
              fontSize: 13, fontWeight: 600, color: 'var(--muted)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {data.certDocName || 'Tap to upload'}
            </span>
            <input type="file" onChange={onCertDoc} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Heard From */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <label className="form-label">How did you hear about SMARI?</label>
        <select name="heardFrom" value={data.heardFrom} onChange={onField} className="form-input">
          <option value="">Select…</option>
          {HEARD_OPTIONS.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
