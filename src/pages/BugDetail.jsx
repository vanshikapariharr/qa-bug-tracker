import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBugs } from '../context/BugContext'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import './BugDetail.css'

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function BugDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { bugs, deleteBug } = useBugs()

  const bug = bugs.find(b => b.id === id)

  if (!bug) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state" data-cy="bug-not-found">
            <div className="empty-icon">⚠️</div>
            <h3>Bug not found</h3>
            <p>This bug may have been deleted.</p>
            <Link to="/bugs" className="btn btn-ghost mt-16">← Back to list</Link>
          </div>
        </div>
      </div>
    )
  }

  function handleDelete() {
    if (window.confirm(`Delete bug #${bug.id}: "${bug.title}"? This cannot be undone.`)) {
      deleteBug(bug.id)
      navigate('/bugs')
    }
  }

  return (
    <div className="page">
      <div className="container">

        {/* ── Breadcrumb ── */}
        <div className="breadcrumb fade-in" data-cy="breadcrumb">
          <Link to="/bugs" className="breadcrumb-link">All Bugs</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">#{bug.id}</span>
        </div>

        {/* ── Detail Card ── */}
        <div className="bug-detail-card fade-in" data-cy="bug-detail">

          {/* Header */}
          <div className="bug-detail-header">
            <div className="bug-detail-badges">
              <PriorityBadge priority={bug.priority} />
              <StatusBadge status={bug.status} />
            </div>
            <div className="bug-detail-actions">
              <Link
                to={`/bugs/${bug.id}/edit`}
                className="btn btn-ghost btn-sm"
                data-cy="edit-bug-btn"
              >
                ✎ Edit
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDelete}
                data-cy="delete-bug-btn"
              >
                🗑 Delete
              </button>
            </div>
          </div>

          <h1 className="bug-detail-title" data-cy="bug-title">{bug.title}</h1>

          <hr className="divider" />

          {/* Body */}
          <div className="bug-detail-body">
            <div className="bug-detail-main">
              <section data-cy="bug-description-section">
                <h3 className="detail-section-label">Description</h3>
                <p className="bug-detail-description" data-cy="bug-description">
                  {bug.description}
                </p>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="bug-detail-sidebar">
              <div className="sidebar-field">
                <span className="sidebar-label">Status</span>
                <StatusBadge status={bug.status} />
              </div>
              <div className="sidebar-field">
                <span className="sidebar-label">Priority</span>
                <PriorityBadge priority={bug.priority} />
              </div>
              {bug.environment && (
                <div className="sidebar-field">
                  <span className="sidebar-label">Environment</span>
                  <span className="sidebar-value" data-cy="bug-environment">{bug.environment}</span>
                </div>
              )}
              {bug.assignee && (
                <div className="sidebar-field">
                  <span className="sidebar-label">Assignee</span>
                  <div className="sidebar-assignee" data-cy="bug-assignee">
                    <span className="assignee-avatar">
                      {bug.assignee.charAt(0).toUpperCase()}
                    </span>
                    {bug.assignee}
                  </div>
                </div>
              )}
              <hr className="divider" />
              <div className="sidebar-field">
                <span className="sidebar-label">Created</span>
                <span className="sidebar-value text-xs" data-cy="bug-created">{formatDate(bug.createdAt)}</span>
              </div>
              <div className="sidebar-field">
                <span className="sidebar-label">Updated</span>
                <span className="sidebar-value text-xs" data-cy="bug-updated">{formatDate(bug.updatedAt)}</span>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Back Link ── */}
        <div className="mt-24">
          <Link to="/bugs" className="btn btn-ghost btn-sm" data-cy="back-to-list">
            ← Back to list
          </Link>
        </div>
      </div>
    </div>
  )
}
