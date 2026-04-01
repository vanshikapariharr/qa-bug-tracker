const PRIORITY_CONFIG = {
  critical: { label: 'Critical', icon: '🔴' },
  high:     { label: 'High',     icon: '🟠' },
  medium:   { label: 'Medium',   icon: '🟡' },
  low:      { label: 'Low',      icon: '🟢' },
}

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['medium']

  return (
    <span className={`badge badge-${priority}`} data-cy={`priority-badge-${priority}`}>
      {config.label}
    </span>
  )
}
