import Button from './Button';
import SkillBadge from './SkillBadge';

export default function CareerCard({
  career,
  matchPercentage,
  skills = [],
  missingSkills = [],
  description,
  onViewRoadmap,
  active = false,
}) {
  return (
    <article className={`career-card ${active ? 'active' : ''}`.trim()}>
      <div className="career-card-header">
        <h3 className="career-card-title">{career}</h3>
        <span className="career-card-match">{matchPercentage}% Match</span>
      </div>

      {description && <p className="career-card-desc">{description}</p>}

      {skills.length > 0 && (
        <div>
          <p className="career-card-section-label">Matching Skills</p>
          <div className="skill-badge-list">
            {skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="matched" />
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div>
          <p className="career-card-section-label">Skills to Learn</p>
          <div className="skill-badge-list">
            {missingSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      )}

      {onViewRoadmap && (
        <Button variant="secondary" size="sm" onClick={onViewRoadmap}>
          View Roadmap
        </Button>
      )}
    </article>
  );
}
