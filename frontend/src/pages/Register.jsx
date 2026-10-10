import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { registerUser } from '../services/api';
import { clearResumeAnalysis } from '../utils/resume';
import { saveSessionUser } from '../utils/sessionUser';

const INITIAL = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  targetCareer: '',
  currentEducation: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(form);
      clearResumeAnalysis();
      saveSessionUser(result.user);
      navigate('/resume');
    } catch (err) {
      setError(err?.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-header">
          <h1>Create your account</h1>
          <p>Start building your path from student to job-ready.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="Your full name"
              autoComplete="name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@college.edu"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Create a password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="targetCareer">
              Target Career <span className="form-hint">(optional)</span>
            </label>
            <input
              id="targetCareer"
              name="targetCareer"
              type="text"
              className="form-input"
              placeholder="e.g. Machine Learning Engineer"
              value={form.targetCareer}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="currentEducation">
              Current Education <span className="form-hint">(optional)</span>
            </label>
            <input
              id="currentEducation"
              name="currentEducation"
              type="text"
              className="form-input"
              placeholder="e.g. BCA Semester 5"
              value={form.currentEducation}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="form-error" role="alert" style={{ marginBottom: '1rem' }}>
              {error}
            </p>
          )}

          <Button type="submit" block disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
