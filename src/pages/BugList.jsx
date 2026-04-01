import { Link } from 'react-router-dom'
import { useBugs } from '../context/BugContext'
import BugCard from '../components/BugCard'
import './BugList.css'

export default function BugList() {
  const { filteredBugs, filters, stats, setFilter, resetFilters } = useBugs()

  const hasActiveFilters =
    filters.status !== 'all' || filters.priority !== 'all' || filters.search !== ''

  return (
    <div className="page">
      <div className="container">

        {/* ── Page Header ── */}
        <div className="buglist-header fade-in">
          <div>
            <h1 className="buglist-title">Bug Tracker</h1>
            <p className="buglist-subtitle">
              Track, triage, and resolve issues across your projects
            </p>
          </div>
          <Link to="/bugs/new" className="btn btn-primary" data-cy="new-bug-btn">
            + New Bug
          </Link>
        </div>

        {/* ── Stats Strip ── */}
        <div className="stats-strip fade-in" data-cy="stats-strip">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--accent-red)' }}>{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--accent-orange)' }}>{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.resolved}</span>
            <span className="stat-label">Resolved</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--accent-red)' }}>{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="filters-bar fade-in" data-cy="filters-bar">
          <div className="filter-search-wrap">
            <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="var(--text-muted)" strokeWidth="1.5"/>
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search bugs..."
              className="filter-search"
              value={filters.search}
              onChange={e => setFilter({ search: e.target.value })}
              data-cy="search-input"
            />
          </div>

          <select
            className="form-select filter-select"
            value={filters.status}
            onChange={e => setFilter({ status: e.target.value })}
            data-cy="status-filter"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="form-select filter-select"
            value={filters.priority}
            onChange={e => setFilter({ priority: e.target.value })}
            data-cy="priority-filter"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {hasActiveFilters && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={resetFilters}
              data-cy="reset-filters"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Results Count ── */}
        <div className="results-meta text-sm text-muted mb-16" data-cy="results-count">
          {hasActiveFilters
            ? `${filteredBugs.length} of ${stats.total} bugs`
            : `${stats.total} bugs`}
        </div>

        {/* ── Bug Grid ── */}
        {filteredBugs.length === 0 ? (
          <div className="empty-state" data-cy="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No bugs found</h3>
            <p>Try adjusting your filters or{' '}
              <Link to="/bugs/new">report a new bug</Link>
            </p>
          </div>
        ) : (
          <div className="bugs-grid" data-cy="bugs-grid">
            {filteredBugs.map(bug => (
              <BugCard key={bug.id} bug={bug} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
