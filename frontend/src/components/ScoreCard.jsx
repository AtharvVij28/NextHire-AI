function getScoreColor(score) {
  if (score >= 80) return 'var(--score-high)';
  if (score >= 60) return 'var(--score-mid)';
  return 'var(--score-low)';
}

export default function ScoreCard({ title, score, description, icon: Icon, max = 100 }) {
  return (
    <article className="score-card">
      <div className="score-card-header">
        <p className="score-card-title">{title}</p>
        {Icon && (
          <div className="score-card-icon" aria-hidden="true">
            <Icon size={20} />
          </div>
        )}
      </div>
      <p className="score-card-value" style={{ color: getScoreColor(score) }}>
        {score}
        <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {' '}
          / {max}
        </span>
      </p>
      {description && <p className="score-card-desc">{description}</p>}
    </article>
  );
}
