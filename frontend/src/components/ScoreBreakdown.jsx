import ProgressBar from './ProgressBar';
import { BREAKDOWN_LABELS, SCORE_WEIGHTS } from '../utils/resume';

export default function ScoreBreakdown({
  breakdown = {},
  weights = SCORE_WEIGHTS,
  title = 'Score Breakdown',
}) {
  const entries = Object.keys(BREAKDOWN_LABELS);

  return (
    <section className="dash-panel resume-breakdown">
      <h2 className="section-title">{title}</h2>
      <div className="resume-breakdown-list">
        {entries.map((key) => {
          const score = Number(breakdown[key] ?? 0);
          const weight = weights?.[key];
          const label =
            weight != null
              ? `${BREAKDOWN_LABELS[key]} (${weight}% weight)`
              : BREAKDOWN_LABELS[key];

          return (
            <ProgressBar
              key={key}
              label={label}
              value={score}
              showValue
            />
          );
        })}
      </div>
    </section>
  );
}
