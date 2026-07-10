'use client';

const CAT_ORDER = ['Media & Creative Arts', 'Sales & Marketing', 'Hospitality', 'Personal Development'];
const CAT_COLOR = {
  'Media & Creative Arts': '#f04e3e',
  'Sales & Marketing': '#39bba1',
  'Hospitality': '#fbca0d',
  'Personal Development': '#89c242',
};

export default function StepCourse({ courses, data, errors, setField, selectedCourse }) {
  const groups = CAT_ORDER.map(cat => ({
    label: cat,
    courses: courses.filter(c => c.category === cat),
  })).filter(g => g.courses.length);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        <label className="form-label">Select a Level 1 course</label>
        <select
          name="course"
          value={data.course}
          onChange={(e) => setField('course', e.target.value)}
          className={`form-input ${errors.course ? 'error' : ''}`}
        >
          <option value="">Choose a programme…</option>
          {groups.map(grp => (
            <optgroup key={grp.label} label={grp.label}>
              {grp.courses.map(c => (
                <option key={c.courseId} value={c.courseId}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.course && <div className="form-error">{errors.course}</div>}
      </div>

      {/* Course Preview */}
      {selectedCourse && (
        <div style={{
          marginTop: 16,
          padding: '18px',
          borderRadius: 14,
          background: 'var(--primary-soft)',
          border: '1.5px solid var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          animation: 'fadeIn 0.25s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#fff',
              background: CAT_COLOR[selectedCourse.category] || 'var(--accent)',
              padding: '3px 9px',
              borderRadius: 20,
            }}>
              {selectedCourse.category}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary-dark)' }}>
              {selectedCourse.price}
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            {selectedCourse.name}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500 }}>
            Level 1 · {selectedCourse.duration} · Victoria University certified
          </div>
        </div>
      )}
    </div>
  );
}
