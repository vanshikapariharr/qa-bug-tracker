const STATUS_CONFIG = {
  'open':        { label: 'Open',        dot: '#f85149' },
  'in-progress': { label: 'In Progress', dot: '#f0883e' },
  'resolved':    { label: 'Resolved',    dot: '#3fb950' },
  'closed':      { label: 'Closed',      dot: '#8b949e' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['open']
  const cls = status === 'in-progress' ? 'badge badge-in-progress' : `badge badge-${status}`

  return (
    <span className={cls} data-cy={`status-badge-${status}`}>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <circle cx="3.5" cy="3.5" r="3.5" fill={config.dot} />
      </svg>
      {config.label}
    </span>
  )
}
