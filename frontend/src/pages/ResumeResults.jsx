import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, FolderKanban, Award, User } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ResumeScore from '../components/ResumeScore';
import ScoreBreakdown from '../components/ScoreBreakdown';
import AnalysisSection from '../components/AnalysisSection';
import SkillList from '../components/SkillList';
import { loadResumeAnalysis, normalizeResumeAnalysis } from '../utils/resume';

function InfoBlock({ icon: Icon, title, items }) {
  return (
    <div className="resume-info-block">
      <div className="resume-info-heading">
        <Icon size={16} aria-hidden="true" />
        <h3>{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="card-subtitle">Not provided</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ResumeResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = useMemo(() => {
    if (location.state?.analysis) {
      return normalizeResumeAnalysis(location.state.analysis);
    }
    return loadResumeAnalysis();
  }, [location.state]);

  if (!analysis) {
    return (
      <EmptyState
        title="No analysis to show"
        message="Upload and analyze a resume first to see your results here."
        actionLabel="Go to Resume Analyzer"
        actionTo="/resume"
      />
    );
  }

  const hasEmptyPayload =
    !analysis.overallScore &&
    analysis.strengths.length === 0 &&
    analysis.improvements.length === 0 &&
    analysis.extractedSkills.length === 0;

  if (hasEmptyPayload) {
    return (
      <EmptyState
        title="Empty analysis response"
        message="The API returned an analysis payload without usable fields. Check the backend response contract."
        actionLabel="Try again"
        actionTo="/resume"
      />
    );
  }

  const { info } = analysis;

  return (
    <div className="resume-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Resume Results</h1>
          <p>
            {analysis.filename
              ? `Analysis for ${analysis.filename}`
              : 'Your latest resume analysis from the NextHire AI API.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={() => navigate('/resume')}>
            Analyze Another
          </Button>
          <Button size="sm" to="/job-matcher">
            Match With a Job
          </Button>
        </div>
      </div>

      <div className="resume-results-grid">
        <ResumeScore score={analysis.overallScore} />
        <ScoreBreakdown breakdown={analysis.breakdown} weights={analysis.weights} />
      </div>

      <div className="resume-results-split">
        <AnalysisSection
          title="Strengths"
          items={analysis.strengths}
          variant="success"
          emptyMessage="No strengths were returned for this resume."
        />
        <AnalysisSection
          title="Areas to Improve"
          items={analysis.improvements}
          variant="warning"
          emptyMessage="No improvement suggestions were returned."
        />
      </div>

      <SkillList skills={analysis.extractedSkills} />

      <section className="dash-panel resume-info-panel">
        <h2 className="section-title">Resume Information</h2>
        <div className="resume-info-grid">
          <div className="resume-info-block">
            <div className="resume-info-heading">
              <User size={16} aria-hidden="true" />
              <h3>Name</h3>
            </div>
            <p>{info.name || 'Not provided'}</p>
          </div>
          <InfoBlock icon={GraduationCap} title="Education" items={info.education} />
          <InfoBlock icon={FolderKanban} title="Projects" items={info.projects} />
          <InfoBlock icon={Briefcase} title="Experience" items={info.experience} />
          <InfoBlock icon={Award} title="Certifications" items={info.certifications} />
        </div>
      </section>
    </div>
  );
}
