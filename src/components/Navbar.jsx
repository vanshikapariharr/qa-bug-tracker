import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useBugs } from '../context/BugContext'
import './Navbar.css'

export default function Navbar() {
  const { stats } = useBugs()
  const navigate = useNavigate()

  return (
    <nav className="navbar" data-cy="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/bugs" className="navbar-logo" data-cy="nav-logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="#f85149" strokeWidth="2"/>
            <line x1="11" y1="4" x2="11" y2="18" stroke="#f85149" strokeWidth="1.5" opacity="0.5"/>
            <line x1="4" y1="11" x2="18" y2="11" stroke="#f85149" strokeWidth="1.5" opacity="0.5"/>
            <circle cx="11" cy="11" r="2.5" fill="#f85149"/>
          </svg>
          <span className="navbar-brand">BugTracker</span>
          {stats.critical > 0 && (
            <span className="navbar-critical-badge" data-cy="critical-badge">
              {stats.critical} critical
            </span>
          )}
        </Link>

        {/* Nav links */}
        <div className="navbar-links">
          <NavLink
            to="/bugs"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            data-cy="nav-bugs"
          >
            All Bugs
            <span className="navbar-count">{stats.total}</span>
          </NavLink>
        </div>

        {/* CTA */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/bugs/new')}
          data-cy="nav-new-bug"
        >
          + New Bug
        </button>
      </div>
    </nav>
  )
}
