import React from 'react'
import { Link2, ArrowRight } from 'lucide-react'

export function UrlCommandInput({ originalUrl, setOriginalUrl, handleCreateLink, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && originalUrl.trim()) {
      e.preventDefault()
      handleCreateLink()
    }
  }

  return (
    <div className="command-card">
      <div className="command-label-row">
        <label htmlFor="url-input" className="command-label">
          Create a short link
        </label>
        <span className="command-shortcut-hint">
          Press <span className="kbd">↵</span> to shorten
        </span>
      </div>

      <div className="command-input-wrapper">
        <Link2 size={18} className="command-icon" />
        <input
          id="url-input"
          type="url"
          className="command-input"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a long destination URL (e.g. https://github.com/...)"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          className="command-submit-btn"
          disabled={loading || !originalUrl.trim()}
          onClick={handleCreateLink}
          type="button"
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <span>Shorten</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
