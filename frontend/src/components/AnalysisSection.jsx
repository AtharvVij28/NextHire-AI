import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    className: 'analysis-section-success',
  },
  warning: {
    icon: AlertTriangle,
    className: 'analysis-section-warning',
  },
  info: {
    icon: Info,
    className: 'analysis-section-info',
  },
};

export default function AnalysisSection({
  title,
  items = [],
  variant = 'info',
  emptyMessage = 'No items available.',
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <section className={`dash-panel analysis-section ${config.className}`}>
      <h2 className="section-title">{title}</h2>
      {items.length === 0 ? (
        <p className="card-subtitle">{emptyMessage}</p>
      ) : (
        <ul className="analysis-list">
          {items.map((item) => (
            <li key={item}>
              <Icon size={16} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
