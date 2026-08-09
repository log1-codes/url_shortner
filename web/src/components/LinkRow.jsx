import React, { useState } from 'react'
import { Copy, Check, ExternalLink, BarChart2, Calendar } from 'lucide-react'

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
    <article className="link-row">
      <div className="link-main-col">
        <div className="link-short-group">
          <a
            className="link-short-anchor"
            href={fullShortUrl}
            target="_blank"
            rel="noreferrer"
            title="Open short link"
          >
            <span>{fullShortUrl}</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>

          <button
            type="button"
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy short link to clipboard"
          >
            {copied ? (
              <>
                <Check size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <p className="link-dest-url" title={link.original_url}>
          {link.original_url}
        </p>
      </div>

      <div className="link-meta-col">
        <div className="link-clicks-badge" title="Total redirects">
          <BarChart2 size={13} className="text-zinc-400" />
          <span>{link.clicks || 0} redirects</span>
        </div>

        <div className="link-date" title={`Created: ${new Date(link.created_at).toLocaleString()}`}>
          {formattedDate}
        </div>

        <div className="link-actions-group">
          <a
            href={fullShortUrl}
            target="_blank"
            rel="noreferrer"
            className="icon-action-btn"
            title="Visit redirect destination"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  )
}
