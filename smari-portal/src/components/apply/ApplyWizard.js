'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import StepCourse from './steps/StepCourse';
import StepAboutYou from './steps/StepAboutYou';
import StepContact from './steps/StepContact';
import StepEducation from './steps/StepEducation';
import StepFunding from './steps/StepFunding';
import StepReview from './steps/StepReview';
import SuccessScreen from './SuccessScreen';
import styles from './ApplyWizard.module.css';

const STEP_META = [
  { n: 1, label: 'Course', color: '#f04e3e', title: 'Choose your course', sub: 'Pick the Level 1 programme you want to join.' },
  { n: 2, label: 'About you', color: '#39bba1', title: 'Tell us about you', sub: 'Your basic personal details.' },
  { n: 3, label: 'Contact', color: '#fbca0d', title: 'How we reach you', sub: 'Contact details and next of kin.' },
  { n: 4, label: 'Education', color: '#89c242', title: 'Your background', sub: 'Your most recent education.' },
  { n: 5, label: 'Funding', color: '#f04e3e', title: 'Payment & documents', sub: 'How you\u2019ll pay and proof of identity.' },
  { n: 6, label: 'Review', color: '#39bba1', title: 'Review & submit', sub: 'Check everything before you send.' },
];

const INITIAL_DATA = {
  course: '', fullName: '', dob: '', gender: '', photoFile: null, photoPreview: '',
  phone: '', email: '', address: '', city: '', country: 'Uganda',
  kinName: '', kinPhone: '',
  education: '', school: '', yearDone: '', working: '',
  funding: '', idDocFile: null, idDocName: '', certDocFile: null, certDocName: '', heardFrom: '',
  agree: false,
};

export default function ApplyWizard() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [narrow, setNarrow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const rootRef = useRef(null);

  // Fetch courses from API
  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => setCourses(d))
      .catch(() => {});
  }, []);

  // Responsive observer
  useEffect(() => {
    if (!rootRef.current) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setNarrow(w < 640);
    });
    ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  const setField = useCallback((name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const onField = useCallback((e) => {
    setField(e.target.name, e.target.value);
  }, [setField]);

  const validate = useCallback((s) => {
    const e = {};
    const req = (k, m) => { if (!String(data[k] || '').trim()) e[k] = m; };

    if (s === 1) { if (!data.course) e.course = 'Please select a course to continue.'; }
    if (s === 2) {
      req('fullName', 'Enter your full name.');
      req('dob', 'Enter your date of birth.');
      req('gender', 'Select your gender.');
    }
    if (s === 3) {
      req('phone', 'Enter a phone number.');
      if (!data.email.trim()) e.email = 'Enter your email.';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = 'Enter a valid email.';
      req('address', 'Enter your address.');
      req('kinName', 'Enter a next-of-kin name.');
      req('kinPhone', 'Enter their phone.');
    }
    if (s === 4) {
      req('education', 'Select your education level.');
      req('school', 'Enter your school.');
    }
    if (s === 5) {
      req('funding', 'Choose a funding option.');
      if (!data.idDocFile && !data.idDocName) e.idDoc = 'Upload your ID or passport.';
    }
    if (s === 6) {
      if (!data.agree) e.agree = 'Please confirm to submit.';
    }
    return e;
  }, [data]);

  const next = useCallback(() => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    const ns = Math.min(6, step + 1);
    setStep(ns);
    setMaxStep(prev => Math.max(prev, ns));
    setErrors({});
  }, [step, validate]);

  const back = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
    setErrors({});
  }, []);

  const goStep = useCallback((n) => {
    if (n <= maxStep) { setStep(n); setErrors({}); }
  }, [maxStep]);

  const submit = useCallback(async () => {
    const e = validate(6);
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('course', data.course);
      formData.append('fullName', data.fullName);
      formData.append('dob', data.dob);
      formData.append('gender', data.gender);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('country', data.country);
      formData.append('kinName', data.kinName);
      formData.append('kinPhone', data.kinPhone);
      formData.append('education', data.education);
      formData.append('school', data.school);
      formData.append('yearDone', data.yearDone);
      formData.append('working', data.working);
      formData.append('funding', data.funding);
      formData.append('heardFrom', data.heardFrom);

      if (data.photoFile) formData.append('photo', data.photoFile);
      if (data.idDocFile) formData.append('idDoc', data.idDocFile);
      if (data.certDocFile) formData.append('certDoc', data.certDocFile);

      const res = await fetch('/api/applications', { method: 'POST', body: formData });
      const result = await res.json();

      if (res.ok) {
        setRefNo(result.refNo);
        setSubmitted(true);
      } else {
        setErrors({ agree: result.error || 'Submission failed. Please try again.' });
      }
    } catch {
      setErrors({ agree: 'Network error. Please check your connection.' });
    } finally {
      setSubmitting(false);
    }
  }, [data, validate]);

  const restart = useCallback(() => {
    setStep(1);
    setMaxStep(1);
    setSubmitted(false);
    setData(INITIAL_DATA);
    setErrors({});
    setRefNo('');
  }, []);

  const selectedCourse = courses.find(c => c.courseId === data.course) || null;
  const meta = STEP_META[step - 1];
  const showRail = !narrow;

  if (submitted) {
    return (
      <div ref={rootRef} className={styles.root}>
        <SuccessScreen
          firstName={(data.fullName || '').split(' ')[0] || 'there'}
          courseName={selectedCourse?.name || ''}
          refNo={refNo}
          onRestart={restart}
        />
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.root} style={{ display: showRail ? 'flex' : 'block' }}>
      {/* Rail Sidebar */}
      {showRail && (
        <aside className={styles.rail}>
          <div className={styles.railBrand}>
            <img src="/smari-logo.svg" alt="" className={styles.railBrandMark} />
            <div>
              <div className={styles.railBrandName}>SMARI Institute</div>
              <div className={styles.railBrandSub}>Application 2026</div>
            </div>
          </div>

          <div className={styles.railSteps}>
            {STEP_META.map(s => {
              const isActive = s.n === step;
              const isDone = s.n < maxStep || s.n < step;
              const reachable = s.n <= maxStep;
              return (
                <button
                  key={s.n}
                  onClick={() => goStep(s.n)}
                  className={`${styles.railStep} ${isActive ? styles.railStepActive : ''}`}
                  style={{ borderLeftColor: isActive ? s.color : 'transparent', cursor: reachable ? 'pointer' : 'default' }}
                >
                  <span
                    className={styles.railDot}
                    style={{ background: isActive || isDone ? s.color : 'rgba(255,255,255,0.14)' }}
                  >
                    {isDone && !isActive ? '✓' : s.n}
                  </span>
                  <span className={styles.railLabel}>
                    <span className={styles.railKicker}>Step {s.n}</span>
                    <span>{s.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {selectedCourse && (
            <div className={styles.railCourse}>
              <div className={styles.railCourseKicker}>Selected course</div>
              <div className={styles.railCourseName}>{selectedCourse.name}</div>
              <div className={styles.railCourseMeta}>Level 1 · {selectedCourse.duration}</div>
              <div className={styles.railCoursePrice}>{selectedCourse.price}</div>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <div className={styles.main}>
        {/* Mobile Bar Stepper */}
        {narrow && (
          <div className={styles.barTop}>
            <div className={styles.barHead}>
              <span className={styles.barBrand}>SMARI · Apply</span>
              <span className={styles.barCount}>Step {step} of 6</span>
            </div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${(step / 6) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Step Header + Content */}
        <div className={`${styles.bodyWrap} custom-scroll`}>
          <div className={styles.stepHead} key={`step-${step}`}>
            <div className={styles.stepKicker}>Step {step} of 6</div>
            <h2 className={styles.stepTitle}>{meta.title}</h2>
            <p className={styles.stepSub}>{meta.sub}</p>
          </div>

          {step === 1 && <StepCourse courses={courses} data={data} errors={errors} setField={setField} onField={onField} selectedCourse={selectedCourse} />}
          {step === 2 && <StepAboutYou data={data} errors={errors} setField={setField} onField={onField} narrow={narrow} />}
          {step === 3 && <StepContact data={data} errors={errors} setField={setField} onField={onField} narrow={narrow} />}
          {step === 4 && <StepEducation data={data} errors={errors} setField={setField} onField={onField} narrow={narrow} />}
          {step === 5 && <StepFunding data={data} errors={errors} setField={setField} onField={onField} narrow={narrow} />}
          {step === 6 && <StepReview data={data} errors={errors} setField={setField} selectedCourse={selectedCourse} />}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {step > 1 ? (
            <button onClick={back} className="btn-ghost">Back</button>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Level 1 · 3 months · UGX 395,000</span>
          )}
          <button
            onClick={step === 6 ? submit : next}
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : step === 6 ? 'Submit application' : step === 1 ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
