import SkillBadge from './SkillBadge';

export default function SkillList({
  skills = [],
  title = 'Extracted Skills',
  type = 'default',
  emptyMessage = 'No skills were extracted from this resume.',
}) {
  return (
    <section className="dash-panel">
      <h2 className="section-title">{title}</h2>
      {skills.length === 0 ? (
        <p className="card-subtitle">{emptyMessage}</p>
      ) : (
        <div className="skill-badge-list">
          {skills.map((skill) => (
            <SkillBadge key={skill} skill={skill} type={type} />
          ))}
        </div>
      )}
    </section>
  );
}
