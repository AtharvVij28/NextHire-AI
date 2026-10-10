import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  BriefcaseBusiness,
  Compass,
  MessageSquare,
  User,
  Settings,
  Briefcase,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resume', label: 'Resume Analyzer', icon: FileSearch },
  { to: '/job-matcher', label: 'Job Matcher', icon: BriefcaseBusiness },
  { to: '/career-mentor', label: 'Career Mentor', icon: Compass },
  { to: '/interview', label: 'Interview Coach', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const LOCKED_UNTIL_ANALYSIS = ['/job-matcher', '/career-mentor', '/interview', '/settings'];

export default function Sidebar({ open = false, onClose, analysisReady = false }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`.trim()} aria-label="App navigation">
      <NavLink to="/dashboard" className="sidebar-brand" onClick={onClose}>
        <span className="navbar-logo" aria-hidden="true">
          <Briefcase size={16} />
        </span>
        NextHire AI
      </NavLink>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const locked = !analysisReady && LOCKED_UNTIL_ANALYSIS.includes(to);
          if (locked) {
            return (
              <span
                key={to}
                className="sidebar-link locked"
                aria-disabled="true"
                title="Analyze your resume to open this page"
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </span>
            );
          }
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          From Student to Job-Ready.
        </p>
      </div>
    </aside>
  );
}
