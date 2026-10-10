import { useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { loadSessionUser } from '../utils/sessionUser';
import { ANALYSIS_GATED_PATHS, hasResumeAnalysis } from '../utils/resumeProfile';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/resume': 'Resume Analyzer',
  '/resume/results': 'Resume Results',
  '/job-matcher': 'Job Matcher',
  '/career-mentor': 'Career Mentor',
  '/interview': 'Interview Coach',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'NextHire AI';
  const analysisReady = hasResumeAnalysis();
  const locked = !analysisReady && ANALYSIS_GATED_PATHS.includes(pathname);
  const user = loadSessionUser();
  const displayName = user?.fullName || 'Account';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        analysisReady={analysisReady}
      />

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="icon-btn sidebar-menu-btn"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="dashboard-topbar-title">{title}</h1>
          </div>

          <div className="dashboard-topbar-actions">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <Link to="/profile" className="user-chip" aria-label="View profile">
              <span className="user-avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="user-chip-name">{displayName.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          {locked ? <Navigate to="/resume" replace /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
