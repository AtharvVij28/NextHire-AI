const TYPE_CLASS = {
  default: 'skill-badge-default',
  matched: 'skill-badge-matched',
  missing: 'skill-badge-missing',
  priority: 'skill-badge-priority',
};

export default function SkillBadge({ skill, type = 'default' }) {
  return (
    <span className={`skill-badge ${TYPE_CLASS[type] || TYPE_CLASS.default}`}>
      {skill}
    </span>
  );
}
