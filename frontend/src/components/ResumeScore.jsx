function getScoreColor(score) {
  if (score >= 80) return 'var(--score-high)';
  if (score >= 60) return 'var(--score-mid)';
  return 'var(--score-low)';
}

export default function ResumeScore({ score = 0, max = 100, label = 'Overall Resume Score' }) {
  const value = Math.round(Number(score) || 0);

  return (
    <div className="resume-score">
      <p className="resume-score-label">{label}</p>
      <p className="resume-score-value" style={{ color: getScoreColor(value) }}>
        {value}
        <span>
          {' '}
          / {max}
        </span>
      </p>
      <p className="resume-score-caption">
        {value >= 80
          ? 'Strong resume — small refinements will help.'
          : value >= 60
            ? 'Solid foundation — focus on the improvement areas below.'
            : 'Needs work — prioritize skills, projects, and keywords.'}
      </p>
    </div>
  );
}
