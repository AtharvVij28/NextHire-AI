import { useState } from 'react';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import SkillBadge from '../components/SkillBadge';
import { loadResumeAnalysis } from '../utils/resume';
import { loadSessionUser, saveSessionUser } from '../utils/sessionUser';

function initialForm() {
  const user = loadSessionUser() || {};
  const analysis = loadResumeAnalysis();
  const skills = Array.isArray(user.skills) && user.skills.length
    ? user.skills
    : analysis?.extractedSkills || [];

  return {
    fullName: user.fullName || '',
    email: user.email || '',
    university: user.university || '',
    degree: user.degree || '',
    semester: user.semester || '',
    targetCareer: user.targetCareer || '',
    currentEducation: user.currentEducation || '',
    skills: skills.join(', '),
    careerInterests: user.careerInterests || '',
  };
}

function completionPercent(form) {
  const values = [
    form.fullName,
    form.email,
    form.university,
    form.degree,
    form.targetCareer,
    form.currentEducation,
    form.skills,
  ];
  const filled = values.filter((value) => String(value || '').trim()).length;
  return Math.round((filled / values.length) * 100);
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave(e) {
    e.preventDefault();
    const skills = form.skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    saveSessionUser({
      ...form,
      skills,
    });
    setForm((prev) => ({ ...prev, skills: skills.join(', ') }));
    setEditing(false);
  }

  const skillList = form.skills.split(',').map((skill) => skill.trim()).filter(Boolean);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Profile</h1>
          <p>Your account details. Skills fill in after you analyze a resume.</p>
        </div>
        <Button
          variant={editing ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="dash-panel" style={{ marginBottom: '1.5rem', maxWidth: 480 }}>
        <ProgressBar value={completionPercent(form)} label="Profile Completion" />
      </div>

      <form onSubmit={handleSave} className="dash-panel" style={{ maxWidth: 720 }}>
        <div className="grid-2" style={{ gap: '1rem' }}>
          {[
            ['fullName', 'Full Name', 'text'],
            ['email', 'Email', 'email'],
            ['university', 'University', 'text'],
            ['degree', 'Degree', 'text'],
            ['semester', 'Semester', 'text'],
            ['targetCareer', 'Target Career', 'text'],
            ['currentEducation', 'Current Education', 'text'],
          ].map(([name, label, type]) => (
            <div className="form-group" key={name}>
              <label className="form-label" htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                className="form-input"
                value={form[name]}
                onChange={handleChange}
                disabled={!editing || name === 'email'}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="skills">
            Skills
          </label>
          {editing ? (
            <input
              id="skills"
              name="skills"
              type="text"
              className="form-input"
              value={form.skills}
              onChange={handleChange}
              placeholder="Comma-separated skills"
            />
          ) : skillList.length > 0 ? (
            <div className="skill-badge-list" style={{ marginTop: '0.5rem' }}>
              {skillList.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="card-subtitle">No skills yet. Upload and analyze your resume first.</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="careerInterests">
            Career Interests
          </label>
          <input
            id="careerInterests"
            name="careerInterests"
            type="text"
            className="form-input"
            value={form.careerInterests}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {editing && <Button type="submit">Save Changes</Button>}
      </form>
    </div>
  );
}
