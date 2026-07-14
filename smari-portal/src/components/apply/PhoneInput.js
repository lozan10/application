'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const COUNTRIES = [
  { iso: 'UG', name: 'Uganda', dial: '+256', flag: '🇺🇬' },
  { iso: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { iso: 'TZ', name: 'Tanzania', dial: '+255', flag: '🇹🇿' },
  { iso: 'RW', name: 'Rwanda', dial: '+250', flag: '🇷🇼' },
  { iso: 'SS', name: 'South Sudan', dial: '+211', flag: '🇸🇸' },
  { iso: 'BI', name: 'Burundi', dial: '+257', flag: '🇧🇮' },
  { iso: 'CD', name: 'DR Congo', dial: '+243', flag: '🇨🇩' },
  { iso: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { iso: 'SO', name: 'Somalia', dial: '+252', flag: '🇸🇴' },
  { iso: 'SD', name: 'Sudan', dial: '+249', flag: '🇸🇩' },
  { iso: 'ZM', name: 'Zambia', dial: '+260', flag: '🇿🇲' },
  { iso: 'MW', name: 'Malawi', dial: '+265', flag: '🇲🇼' },
  { iso: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { iso: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { iso: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { iso: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { iso: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { iso: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { iso: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { iso: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
];

export function findCountry(iso) {
  return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES[0];
}

export default function PhoneInput({ name, country, onCountryChange, value, onValueChange, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selected = findCountry(country);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'flex', gap: 8 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px',
          border: `1.5px solid ${error ? 'var(--err)' : 'var(--border)'}`, borderRadius: 10,
          background: 'var(--card)', cursor: 'pointer', fontSize: 14, flex: '0 0 auto',
        }}
        aria-label="Select country code"
        aria-expanded={open}
      >
        <span style={{ fontSize: 17, lineHeight: 1 }}>{selected.flag}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{selected.dial}</span>
        <ChevronDown size={14} style={{ color: 'var(--muted)' }} />
      </button>

      <input
        name={name}
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        style={{ flex: 1, minWidth: 0 }}
      />

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 20,
          width: 250, maxHeight: 260, overflowY: 'auto', background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
          padding: 6,
        }}>
          {COUNTRIES.map((c) => (
            <button
              key={c.iso}
              type="button"
              onClick={() => { onCountryChange(c.iso); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px',
                background: c.iso === selected.iso ? 'var(--primary-soft)' : 'transparent',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{c.flag}</span>
              <span style={{ flex: 1, color: 'var(--ink)' }}>{c.name}</span>
              <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{c.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
