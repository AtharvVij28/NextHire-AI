import { useState } from 'react';
import Button from '../components/Button';
import { loadResumeAnalysis } from '../utils/resume';
import { loadSessionUser, saveSessionUser } from '../utils/sessionUser';

export default function Settings() {
  const analysis = loadResumeAnalysis();
  const user = loadSessionUser() || {};
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    targetCareer: user.targetCareer || '',
    currentEducation: user.currentEducation || '',
  });
  const [saved, setSaved] = useState(false);

  function handleChange(event) {
    setSaved(false);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    saveSessionUser(form);
    setSaved(true);
  }

  return (
    <div className="resume-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Account details for the resume you just analyzed.</p>
      </div>

      <form className="dash-panel" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            className="form-input"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input id="email" className="form-input" value={user.email || ''} disabled />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="targetCareer">
            Target career
          </label>
          <input
            id="targetCareer"
            name="targetCareer"
            className="form-input"
            value={form.targetCareer}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="currentEducation">
            Current education
          </label>
          <input
            id="currentEducation"
            name="currentEducation"
            className="form-input"
            value={form.currentEducation}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">Save settings</Button>
        {saved && (
          <p className="form-hint" role="status" style={{ marginTop: '0.75rem' }}>
            Settings saved for this session.
          </p>
        )}
      </form>

      <section className="dash-panel" style={{ marginTop: '1.5rem' }}>
        <h2 className="section-title">Analyzed resume</h2>
        <p>{analysis?.filename || 'Resume on file'}</p>
        <p className="card-subtitle">Overall score: {analysis?.overallScore ?? 0} / 100</p>
      </section>
    </div>
  );
}
