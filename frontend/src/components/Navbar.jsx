import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Briefcase, Menu, X } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="NextHire AI home">
          <span className="navbar-logo" aria-hidden="true">
            <Briefcase size={18} />
          </span>
          NextHire <span style={{ color: 'var(--color-primary)' }}>AI</span>
        </Link>

        <nav className="navbar-links" aria-label="Primary">
          <a href="/#features" className="navbar-link">
            Features
          </a>
          <a href="/#how-it-works" className="navbar-link">
            How It Works
          </a>
          <NavLink to="/login" className="navbar-link">
            Login
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <Button to="/login" variant="ghost" size="sm">
            Sign In
          </Button>
          <Button to="/register" size="sm">
            Get Started
          </Button>
          <button
            type="button"
            className="navbar-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
          aria-label="Mobile"
        >
          <a href="/#features" className="navbar-link" onClick={() => setMobileOpen(false)}>
            Features
          </a>
          <a href="/#how-it-works" className="navbar-link" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>
          <Button to="/login" variant="secondary" block onClick={() => setMobileOpen(false)}>
            Sign In
          </Button>
          <Button to="/register" block onClick={() => setMobileOpen(false)}>
            Get Started
          </Button>
        </nav>
      )}
    </header>
  );
}
