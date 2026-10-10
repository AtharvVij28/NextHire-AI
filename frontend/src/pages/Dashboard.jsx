import { FileSearch } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ResumeScore from '../components/ResumeScore';
import ScoreBreakdown from '../components/ScoreBreakdown';
import SkillList from '../components/SkillList';
import AnalysisSection from '../components/AnalysisSection';
import { loadResumeAnalysis } from '../utils/resume';
import { loadSessionUser } from '../utils/sessionUser';

export default function Dashboard() {
  const user = loadSessionUser();
  const analysis = loadResumeAnalysis();
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  if (!analysis) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Upload your resume first"
        message="Create your account, then upload a PDF or DOCX resume. Your scores will show up here after the analysis finishes."
        actionLabel="Upload Resume"
        actionTo="/resume"
      />
    );
  }

  return (
    <div>
      <div className="dash-greeting">
        <h1>Welcome, {firstName}</h1>
        <p>
          {analysis.filename
            ? `Your latest analysis is based on ${analysis.filename}.`
            : 'Your resume analysis is ready.'}
        </p>
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
    </div>
  );
}
