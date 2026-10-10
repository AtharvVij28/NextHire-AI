import { useState } from 'react';
import Button from '../components/Button';
import InterviewQuestion from '../components/InterviewQuestion';
import ProgressBar from '../components/ProgressBar';
import LoadingState from '../components/LoadingState';
import { startInterview, submitInterviewAnswer } from '../services/api';
import { buildResumeProfile } from '../utils/resumeProfile';
import { loadSessionUser } from '../utils/sessionUser';

const SCORE_FIELDS = [
  ['technicalAccuracy', 'Technical Accuracy'],
  ['relevance', 'Relevance'],
  ['completeness', 'Completeness'],
  ['clarity', 'Clarity'],
];

export default function InterviewCoach() {
  const profile = buildResumeProfile();
  const user = loadSessionUser();
  const [role, setRole] = useState(user?.targetCareer || profile.targetCareer || '');
  const [difficulty, setDifficulty] = useState('Medium');
  const [interviewType, setInterviewType] = useState('Mixed');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  async function handleStart(event) {
    event.preventDefault();
    if (!role.trim()) {
      setError('Enter the role you want to practice for.');
      return;
    }
    setLoading(true);
    setError('');
    setEvaluation(null);
    setFinished(false);
    try {
      const session = await startInterview({
        profile,
        role: role.trim(),
        difficulty,
        interviewType,
      });
      setQuestions(session.questions || []);
      setIndex(0);
      setAnswer('');
    } catch (err) {
      setError(err?.message || 'Unable to start the interview.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!answer.trim() || !current) return;
    setLoading(true);
    setError('');
    try {
      const result = await submitInterviewAnswer({
        role: role.trim(),
        question: current.question,
        answer: answer.trim(),
      });
      setEvaluation(result.evaluation);
    } catch (err) {
      setError(err?.message || 'Unable to evaluate this answer.');
    } finally {
      setLoading(false);
    }
  }

  function goNext() {
    if (index >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer('');
    setEvaluation(null);
    setError('');
  }

  function resetInterview() {
    setQuestions([]);
    setIndex(0);
    setAnswer('');
    setEvaluation(null);
    setFinished(false);
    setError('');
  }

  if (!questions.length) {
    return (
      <div className="resume-page">
        <div className="page-header">
          <h1>Interview Coach</h1>
          <p>Practice questions written from your analyzed resume and target role.</p>
        </div>
        <form className="dash-panel" onSubmit={handleStart}>
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Target role
            </label>
            <input
              id="role"
              className="form-input"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="difficulty">
                Difficulty
              </label>
              <select
                id="difficulty"
                className="form-select"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="interviewType">
                Interview type
              </label>
              <select
                id="interviewType"
                className="form-select"
                value={interviewType}
                onChange={(event) => setInterviewType(event.target.value)}
              >
                <option>Technical</option>
                <option>Behavioral</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Preparing questions...' : 'Start Interview'}
          </Button>
        </form>
        {loading && (
          <LoadingState
            title="Preparing your interview..."
            message="Questions are being written from your resume and the role you selected."
          />
        )}
      </div>
    );
  }

  if (finished) {
    return (
      <div className="resume-page">
        <div className="page-header">
          <h1>Interview complete</h1>
          <p>You finished the practice round for {role}.</p>
        </div>
        <Button onClick={resetInterview}>Practice again</Button>
      </div>
    );
  }

  return (
    <div className="resume-page">
      <InterviewQuestion
        question={current.question}
        questionNumber={index + 1}
        totalQuestions={questions.length}
      >
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="answer">
            Your answer
          </label>
          <textarea
            id="answer"
            className="form-textarea"
            style={{ minHeight: 180, margin: '0.5rem 0 1rem' }}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            disabled={loading || Boolean(evaluation)}
          />
          {error && (
            <p className="form-error" role="alert" style={{ marginBottom: '1rem' }}>
              {error}
            </p>
          )}
          <div className="interview-actions">
            <Button type="submit" disabled={loading || !answer.trim() || Boolean(evaluation)}>
              {loading ? 'Evaluating...' : 'Submit Answer'}
            </Button>
            <Button type="button" variant="secondary" onClick={goNext} disabled={loading}>
              Skip
            </Button>
            <Button type="button" variant="ghost" onClick={resetInterview} disabled={loading}>
              End Interview
            </Button>
          </div>
        </form>
      </InterviewQuestion>

      {loading && !evaluation && (
        <LoadingState title="Reviewing your answer..." message="This uses your question and response only." />
      )}

      {evaluation && (
        <section className="dash-panel" style={{ marginTop: '1.5rem' }}>
          <h2 className="section-title">Overall: {evaluation.overall}%</h2>
          <div className="resume-breakdown-list">
            {SCORE_FIELDS.map(([key, label]) => (
              <ProgressBar key={key} label={label} value={evaluation[key] || 0} />
            ))}
          </div>
          <p style={{ marginTop: '1rem' }}>{evaluation.feedback}</p>
          <Button style={{ marginTop: '1rem' }} onClick={goNext}>
            {index >= questions.length - 1 ? 'Finish' : 'Next Question'}
          </Button>
        </section>
      )}
    </div>
  );
}
