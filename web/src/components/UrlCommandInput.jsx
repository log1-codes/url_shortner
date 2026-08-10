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
    <div className="w-full bg-[#101013] border border-white/[0.09] rounded-2xl p-4 sm:p-5 shadow-[0_18px_45px_-15px_rgba(0,0,0,0.6)] space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="url-input" className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Create Short Link
        </label>
        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-zinc-300 font-mono">↵ Enter</kbd> to shorten
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#0a0a0c] border border-white/[0.08] rounded-xl focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition-all">
        <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
          <Link2 size={18} className="text-zinc-500 shrink-0" />
          <input
            id="url-input"
            type="url"
            className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 text-sm outline-none font-normal"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste destination URL (e.g. https://github.com/my-repo)..."
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        
        <button
          className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-xs sm:text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
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
              <span>Shorten Link</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
      
      <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 pt-1">
        <span>⚡ Sub-15ms direct 302 redirects</span>
        <span>🛡️ Zero tracking cookies</span>
      </div>
    </div>
  )
}
