import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import './BugCard.css'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0)  return `${mins}m ago`
  return 'just now'
}

export default function BugCard({ bug }) {
  return (
    <Link to={`/bugs/${bug.id}`} className="bug-card fade-in" data-cy="bug-card">
      <div className="bug-card-header">
        <div className="bug-card-badges">
          <PriorityBadge priority={bug.priority} />
          <StatusBadge status={bug.status} />
        </div>
        <span className="bug-card-id text-xs text-muted">#{bug.id}</span>
      </div>

      <h3 className="bug-card-title">{bug.title}</h3>
      <p className="bug-card-description">{bug.description}</p>

      <div className="bug-card-footer">
        <div className="bug-card-meta">
          {bug.environment && (
            <span className="bug-card-env">{bug.environment}</span>
          )}
          {bug.assignee && (
            <span className="bug-card-assignee">
              <span className="assignee-avatar">
                {bug.assignee.charAt(0).toUpperCase()}
              </span>
              {bug.assignee}
            </span>
          )}
        </div>
        <span className="text-xs text-muted">{timeAgo(bug.createdAt)}</span>
      </div>
    </Link>
  )
}
