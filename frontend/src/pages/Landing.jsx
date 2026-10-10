import { FileSearch, BriefcaseBusiness, Compass, MessageSquare } from 'lucide-react';
import Button from '../components/Button';

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Resume Analysis',
    description:
      'Upload your resume and get a clear score with strengths, gaps, and actionable improvements.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Job Matching',
    description:
      'Compare your profile against target roles and see matched vs missing skills instantly.',
  },
  {
    icon: Compass,
    title: 'Career Guidance',
    description:
      'Discover career paths that fit your skills and follow a practical roadmap to get there.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Coaching',
    description:
      'Practice technical and behavioral questions with structured feedback before the real interview.',
  },
];

const STEPS = [
  {
    step: 1,
    title: 'Upload Resume',
    description: 'Add your latest resume in PDF or DOCX format.',
  },
  {
    step: 2,
    title: 'Analyze Your Profile',
    description: 'See scores across skills, projects, and experience.',
  },
  {
    step: 3,
    title: 'Discover Skill Gaps',
    description: 'Know exactly what to learn for your target role.',
  },
  {
    step: 4,
    title: 'Prepare for Interviews',
    description: 'Practice with guided questions and improve faster.',
  },
];

export default function Landing() {
  return (
    <>
      <section className="landing-hero">
        <div className="container landing-hero-grid">
          <div>
            <p className="landing-tagline">From Student to Job-Ready</p>
            <h1 className="landing-brand">
              NEXT HIRE <span>AI</span>
            </h1>
            <h2 className="landing-headline">Your AI Career Companion</h2>
            <p className="landing-support">
              Analyze your resume, discover your skill gaps, find your best-fit career paths, and
              prepare for interviews — all in one place.
            </p>
            <div className="landing-ctas">
              <Button to="/register" size="lg">
                Get Started
              </Button>
              <a href="#features" className="btn btn-secondary btn-lg">
                Explore Features
              </a>
            </div>
          </div>

          <aside className="hero-preview" aria-label="How to get started">
            <p className="hero-preview-title">Your first step</p>
            <h3 className="hero-start-heading">Create an account, then upload your resume.</h3>
            <ol className="hero-start-list">
              {STEPS.map(({ step, title }) => (
                <li key={step}>
                  <span>{step}</span>
                  {title}
                </li>
              ))}
            </ol>
            <Button to="/register">Create your account</Button>
          </aside>
        </div>
      </section>

      <section id="features" className="landing-section alt">
        <div className="container">
          <div className="landing-section-header">
            <h2>Everything you need to get job-ready</h2>
            <p>
              One platform for resume analysis, role matching, career direction, and interview
              practice.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="container">
          <div className="landing-section-header">
            <h2>How It Works</h2>
            <p>A simple path from uploaded resume to interview-ready confidence.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map(({ step, title, description }) => (
              <article key={step} className="step-card">
                <div className="step-number">{step}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <h2>Ready to become job-ready?</h2>
            <p>
              Join students using NextHire AI to understand their strengths, close skill gaps, and
              prepare with confidence.
            </p>
            <Button to="/register" variant="secondary" size="lg">
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <p className="footer-brand">
                NextHire <span>AI</span>
              </p>
              <p className="footer-desc">
                From Student to Job-Ready. An AI-powered career readiness platform for college
                students and fresh graduates.
              </p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="/register">Get Started</a>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} NextHire AI — BCA Semester 5 Capstone Project</p>
          </div>
        </div>
      </footer>
    </>
  );
}
