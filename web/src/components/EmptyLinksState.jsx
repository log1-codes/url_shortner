import React from 'react'
import { Link2, ArrowRight } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export function EmptyLinksState() {
  const { setOriginalUrl } = useAppContext()

  const handleSuggestion = (url) => {
    setOriginalUrl(url)
    const input = document.getElementById('url-input')
    if (input) {
      input.focus()
    }
  }

  return (
    <div className="bg-[#101013] border border-white/[0.08] rounded-xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-zinc-400">
        <Link2 size={20} />
      </div>
      <h3 className="text-sm font-semibold text-zinc-200">No short links created yet</h3>
      <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
        Paste any destination URL in the command center above to generate your first tracked short link in under 1 second.
      </p>

      {/* Suggested quick-start ideas */}
      <div className="flex flex-col items-center gap-2.5 mt-3 w-full">
        <span className="text-[11px] text-zinc-500 font-medium">Try shortening one of these:</span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-zinc-300 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer"
            onClick={() => handleSuggestion('https://github.com/log1-codes/url_shortner')}
          >
            <span>GitHub Repository</span>
            <ArrowRight size={11} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-zinc-300 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer"
            onClick={() => handleSuggestion('https://twitter.com/')}
          >
            <span>Social Profile Link</span>
            <ArrowRight size={11} />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-zinc-300 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer"
            onClick={() => handleSuggestion('https://news.ycombinator.com/')}
          >
            <span>Newsletter Article</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}
