'use client';

export default function StepAboutYou({ data, errors, setField, onField, narrow }) {
  const genders = ['Female', 'Male', 'Other'];

  const onPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setField('photoFile', f);
    const reader = new FileReader();
    reader.onload = () => setField('photoPreview', reader.result);
    reader.readAsDataURL(f);
  };

  return (
    <div>
      {/* Photo Upload */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20,
        padding: 16, background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)',
      }}>
        <div style={{
          width: 76, height: 76, flex: '0 0 auto', borderRadius: 14, overflow: 'hidden',
          background: 'repeating-linear-gradient(45deg, #eceae4, #eceae4 6px, #f4f2ec 6px, #f4f2ec 12px)',
          display: 'grid', placeItems: 'center', border: '1px solid var(--border)',
        }}>
          {data.photoPreview ? (
            <img src={data.photoPreview} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.05em' }}>Photo</span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div className="form-label">Passport photo <span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--muted)', marginLeft: 4 }}>optional</span></div>
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            fontSize: 13, fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-soft)',
            border: '1.5px solid var(--primary)', borderRadius: 9, cursor: 'pointer', width: 'fit-content',
          }}>
            <span>{data.photoPreview ? 'Change photo' : 'Upload photo'}</span>
            <input type="file" accept="image/*" onChange={onPhoto} style={{ display: 'none' }} />
          </label>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>Clear, front-facing. JPG or PNG.</div>
        </div>
      </div>

      {/* Full Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">Full name</label>
        <input name="fullName" value={data.fullName} onChange={onField} placeholder="e.g. Amina Okello" className={`form-input ${errors.fullName ? 'error' : ''}`} />
        {errors.fullName && <div className="form-error">{errors.fullName}</div>}
      </div>

      {/* DOB + Gender */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Date of birth</label>
          <input name="dob" type="date" value={data.dob} onChange={onField} className={`form-input ${errors.dob ? 'error' : ''}`} />
          {errors.dob && <div className="form-error">{errors.dob}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Gender</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {genders.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setField('gender', g)}
                style={{
                  padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: data.gender === g ? 'var(--primary)' : 'var(--card)',
                  color: data.gender === g ? '#fff' : 'var(--ink)',
                  border: `1.5px solid ${data.gender === g ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.gender && <div className="form-error">{errors.gender}</div>}
        </div>
      </div>
    </div>
  );
}
