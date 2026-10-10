function getVariant(value) {
  if (value >= 80) return 'success';
  if (value >= 60) return 'warning';
  return 'danger';
}

export default function ProgressBar({ value, label, showValue = true, variant }) {
  const clamped = Math.min(100, Math.max(0, value));
  const fillVariant = variant || getVariant(clamped);

  return (
    <div className="progress-bar-wrap">
      {(label || showValue) && (
        <div className="progress-bar-meta">
          {label && <span className="progress-bar-label">{label}</span>}
          {showValue && <span className="progress-bar-value">{clamped}%</span>}
        </div>
      )}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`progress-bar-fill ${fillVariant}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
