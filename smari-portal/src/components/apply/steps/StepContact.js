'use client';

import PhoneInput from '../PhoneInput';

export default function StepContact({ data, errors, setField, onField, narrow }) {
  return (
    <div>
      {/* Phone + Email */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
          <label className="form-label">Phone number</label>
          <PhoneInput
            name="phone"
            country={data.phoneCountry}
            onCountryChange={(iso) => setField('phoneCountry', iso)}
            value={data.phone}
            onValueChange={(v) => setField('phone', v)}
            placeholder="7XX XXX XXX"
            error={!!errors.phone}
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
          <label className="form-label">Email address</label>
          <input name="email" type="email" value={data.email} onChange={onField} placeholder="you@email.com" className={`form-input ${errors.email ? 'error' : ''}`} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
      </div>

      {/* Address */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">Residential address</label>
        <input name="address" value={data.address} onChange={onField} placeholder="Street / village, area" className={`form-input ${errors.address ? 'error' : ''}`} />
        {errors.address && <div className="form-error">{errors.address}</div>}
      </div>

      {/* City + Country */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">City / District</label>
          <input name="city" value={data.city} onChange={onField} placeholder="e.g. Kampala" className="form-input" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Country</label>
          <input name="country" value={data.country} onChange={onField} placeholder="Uganda" className="form-input" />
        </div>
      </div>

      {/* Section Divider */}
      <div style={{
        fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--muted)', margin: '6px 0 14px', paddingBottom: 8, borderBottom: '1px solid var(--border)',
      }}>
        Next of kin
      </div>

      {/* Next of Kin */}
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Full name</label>
          <input name="kinName" value={data.kinName} onChange={onField} placeholder="Parent / guardian" className={`form-input ${errors.kinName ? 'error' : ''}`} />
          {errors.kinName && <div className="form-error">{errors.kinName}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <label className="form-label">Their phone</label>
          <PhoneInput
            name="kinPhone"
            country={data.kinPhoneCountry}
            onCountryChange={(iso) => setField('kinPhoneCountry', iso)}
            value={data.kinPhone}
            onValueChange={(v) => setField('kinPhone', v)}
            placeholder="7XX XXX XXX"
            error={!!errors.kinPhone}
          />
          {errors.kinPhone && <div className="form-error">{errors.kinPhone}</div>}
        </div>
      </div>
    </div>
  );
}
