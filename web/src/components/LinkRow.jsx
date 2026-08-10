import React, { useState } from 'react'
import { Copy, Check, ExternalLink, BarChart2 } from 'lucide-react'

export function LinkRow({ link }) {
  const [copied, setCopied] = useState(false)
  const fullShortUrl = `${window.location.origin}/r/${link.short_url}`

  const handleCopy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullShortUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = fullShortUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formattedDate = link.created_at
    ? new Date(link.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently'

  return (
    <article className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group">
      
      {/* Short Link & Original Destination */}
      <div className="space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={fullShortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono font-semibold text-xs sm:text-sm text-zinc-100 hover:text-white hover:underline truncate"
            title="Open short link"
          >
            <span>{fullShortUrl}</span>
            <ExternalLink size={12} className="text-zinc-500" />
          </a>

          <button
            type="button"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-sans transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 border border-white/10'
            }`}
            onClick={handleCopy}
            title="Copy short link to clipboard"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-zinc-400 truncate max-w-lg" title={link.original_url}>
          {link.original_url}
        </p>
      </div>

      {/* Stats & Meta */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
        <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-zinc-300" title="Total Redirects">
          <BarChart2 size={12} className="text-zinc-400" />
          <span className="font-semibold text-emerald-400">{link.clicks || 0}</span>
          <span className="text-zinc-500 text-[11px]">clicks</span>
        </div>

        <span className="text-[11px] text-zinc-500">
          {formattedDate}
        </span>

        <a
          href={fullShortUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Visit destination"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  )
}
