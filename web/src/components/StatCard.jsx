import React from 'react'
import { Link2, MousePointerClick, ShieldCheck } from 'lucide-react'

export function StatCard({ type, label, value, isSecure }) {
  const getIcon = () => {
    switch (type) {
      case 'links':
        return <Link2 size={16} className="metric-icon" />
      case 'redirects':
        return <MousePointerClick size={16} className="metric-icon" />
      case 'session':
        return <ShieldCheck size={16} className="metric-icon" />
      default:
        return null
    }
  }

  return (
    <div className="metric-item">
      <div className="metric-label-row">
        <span className="metric-label">{label}</span>
        {getIcon()}
      </div>

      {type === 'session' ? (
        <div className="metric-status-badge">
          <span className="status-dot" />
          <span>{value}</span>
        </div>
      ) : (
        <div className="metric-value">{value}</div>
      )}
    </div>
  )
}
