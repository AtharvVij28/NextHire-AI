import { useEffect, useState } from 'react';
import CareerCard from '../components/CareerCard';
import LoadingState from '../components/LoadingState';
import { getCareerRecommendations } from '../services/api';
import { buildResumeProfile } from '../utils/resumeProfile';

const ROADMAP_STEPS = [
  ['currentSkills', 'Current Skills'],
  ['skillsToLearn', 'Skills to Learn'],
  ['projects', 'Recommended Projects'],
  ['interviewPreparation', 'Interview Preparation'],
];

export default function CareerMentor() {
  const [profile] = useState(buildResumeProfile);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await getCareerRecommendations(profile);
        if (!active) return;
        setRecommendations(result.recommendations || []);
      } catch (err) {
        if (active) setError(err?.message || 'Unable to load career recommendations.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [profile]);

  const selected = recommendations[selectedId];

  return (
    <div>
      <div className="page-header">
        <h1>Your Career Recommendations</h1>
        <p>
          Paths based on {profile.name ? `${profile.name}'s` : 'your'} analyzed resume
          {profile.skills.length ? `, including ${profile.skills.slice(0, 3).join(', ')}` : ''}.
        </p>
      </div>

      {loading && (
        <LoadingState
          title="Building your recommendations..."
          message="The AI is comparing your skills, projects, and experience with career paths."
        />
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="career-grid">
            {recommendations.map((career, index) => (
              <CareerCard
                key={career.career}
                career={career.career}
                matchPercentage={career.matchPercentage}
                skills={career.skills}
                missingSkills={career.missingSkills}
                description={career.description}
                active={index === selectedId}
                onViewRoadmap={() => setSelectedId(index)}
              />
            ))}
          </div>

          {selected?.roadmap && (
            <section className="dash-panel roadmap" aria-label="Career roadmap">
              <h2 className="section-title">{selected.career} roadmap</h2>
              <ol className="roadmap-steps">
                {ROADMAP_STEPS.map(([key, label]) => (
                  <li key={key}>
                    <h3>{label}</h3>
                    <ul>
                      {(selected.roadmap[key] || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
                <li>
                  <h3>Job Ready</h3>
                  <p>{selected.roadmap.jobReady}</p>
                </li>
              </ol>
            </section>
          )}
        </>
      )}
    </div>
  );
}
