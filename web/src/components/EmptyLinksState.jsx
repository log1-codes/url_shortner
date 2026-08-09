import React from 'react'
import { Link2 } from 'lucide-react'

export function EmptyLinksState() {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <Link2 size={20} />
      </div>
      <h3 className="empty-state-title">No short links yet</h3>
      <p className="empty-state-desc">
        Paste any long destination URL into the box above to generate your first tracked short link.
      </p>
    </div>
  )
}
