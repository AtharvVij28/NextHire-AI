import { useState } from 'react';
import Button from '../components/Button';
import SkillBadge from '../components/SkillBadge';
import LoadingState from '../components/LoadingState';
import { matchJob } from '../services/api';
import { buildResumeProfile } from '../utils/resumeProfile';

export default function JobMatcher() {
  const profile = buildResumeProfile();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyze(event) {
    event.preventDefault();
    if (jobDescription.trim().length < 20) {
      setError('Paste a job description of at least a few sentences.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const match = await matchJob({ profile, jobDescription: jobDescription.trim() });
      setResult(match);
    } catch (err) {
      setError(err?.message || 'Unable to compare this job with your resume.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Job Matcher</h1>
        <p>Compare your analyzed resume with a role you want to apply for.</p>
      </div>

      <div className="job-match-grid">
        <section className="dash-panel">
          <h2 className="section-title">Your resume profile</h2>
          <p className="recommended-career-title">{profile.name || 'Your profile'}</p>
          {profile.targetCareer && (
            <p className="card-subtitle">Target career: {profile.targetCareer}</p>
          )}
          <div className="job-profile-block">
            <p className="career-card-section-label">Skills</p>
            <div className="skill-badge-list">
              {profile.skills.length ? (
                profile.skills.map((skill) => <SkillBadge key={skill} skill={skill} />)
              ) : (
                <p className="card-subtitle">No skills were extracted.</p>
              )}
            </div>
          </div>
          <ProfileList title="Projects" items={profile.projects} />
          <ProfileList title="Experience" items={profile.experience} />
          <ProfileList title="Education" items={profile.education} />
        </section>

        <form className="dash-panel" onSubmit={handleAnalyze}>
          <h2 className="section-title">Job description</h2>
          <label className="form-label" htmlFor="jobDescription">
            Paste the role you want to match
          </label>
          <textarea
            id="jobDescription"
            className="form-textarea"
            style={{ minHeight: 220, marginTop: '0.5rem' }}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the full job description here"
          />
          {error && (
            <p className="form-error" role="alert" style={{ marginTop: '0.75rem' }}>
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Comparing...' : 'Analyze Match'}
          </Button>
        </form>
      </div>

      {loading && (
        <LoadingState
          title="Comparing your resume..."
          message="The AI is matching your analyzed profile against this job description."
        />
      )}

      {result && !loading && (
        <section className="dash-panel" style={{ marginTop: '1.5rem' }}>
          <h2 className="section-title">Compatibility</h2>
          <p className="match-score">{result.compatibility}%</p>
          <div className="resume-results-split">
            <div>
              <p className="career-card-section-label">Matched skills</p>
              <div className="skill-badge-list">
                {(result.matchedSkills || []).map((skill) => (
                  <SkillBadge key={skill} skill={skill} type="matched" />
                ))}
              </div>
            </div>
            <div>
              <p className="career-card-section-label">Missing skills</p>
              <div className="skill-badge-list">
                {(result.missingSkills || []).map((skill) => (
                  <SkillBadge key={skill} skill={skill} type="missing" />
                ))}
              </div>
            </div>
          </div>
          <h3 className="section-title" style={{ marginTop: '1.5rem' }}>
            Why this score?
          </h3>
          <p className="card-subtitle">{result.explanation}</p>
        </section>
      )}
    </div>
  );
}

function ProfileList({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="job-profile-block">
      <p className="career-card-section-label">{title}</p>
      <ul className="analysis-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
