import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'
import { ShieldCheck, Copy, Check, LogOut, Terminal, KeyRound } from 'lucide-react'

export const Settings = () => {
  const {
    message,
    setMessage,
    isAuthenticated,
    token,
    signOut,
  } = useAppContext()

  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedCurl, setCopiedCurl] = useState(false)

  const curlSnippet = `curl -X POST https://surl.anurag.engineer/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://yourwebsite.com/campaign"}'`

  const handleCopyToken = async () => {
    if (!token) return
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(token)
        setCopiedToken(true)
        setTimeout(() => setCopiedToken(false), 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCopyCurl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(curlSnippet)
        setCopiedCurl(true)
        setTimeout(() => setCopiedCurl(false), 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          {/* Header */}
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-zinc-400">
              <ShieldCheck size={13} className="text-sky-400" />
              <span>Security &amp; API</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500">Cryptographic Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Session &amp; Developer Access
            </h1>
            <p className="text-sm text-zinc-400">
              Manage your active authentication token, API integration snippets, and session security.
            </p>
          </header>

          {/* Active Session & Security Section */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Active Session &amp; Security
            </h2>

            <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-5 divide-y divide-white/[0.06] space-y-4">

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Authentication Status</div>
                  <div className="text-xs text-zinc-400">Encrypted token validation status</div>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                  <span>{isAuthenticated ? 'Authenticated & Secure' : 'Logged Out'}</span>
                </div>
              </div>

              {/* Token */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Session Token Storage</div>
                  <div className="text-xs text-zinc-400">Stored locally in browser for authorized sub-15ms requests</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.08] px-2.5 py-1 rounded-lg max-w-[200px] truncate">
                    {token ? `${token.substring(0, 18)}...` : 'None'}
                  </span>
                  {token && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer shrink-0"
                      onClick={handleCopyToken}
                      title="Copy full token"
                    >
                      {copiedToken ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Session Termination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Session Termination</div>
                  <div className="text-xs text-zinc-400">Safely clear browser tokens and invalidate session credentials</div>
                </div>
                <button
                  type="button"
                  onClick={() => signOut('Signed out from settings')}
                  className="inline-flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer w-fit"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>
          </section>

          {/* Developer REST API Integration Guide */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Developer REST API Integration
              </h2>
              <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                JSON API
              </span>
            </div>

            <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={15} className="text-purple-400" />
                  <span className="text-xs font-semibold text-zinc-200">Programmatic Shortening</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCurl}
                  className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer"
                >
                  {copiedCurl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedCurl ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
              </div>

              <div className="bg-[#050507] border border-white/[0.06] rounded-xl p-3.5 overflow-x-auto">
                <pre className="font-mono text-xs text-purple-200 leading-relaxed">
                  {curlSnippet}
                </pre>
              </div>

              <p className="text-xs text-zinc-400">
                Returns a fast JSON response with an 8-character unique short code mapping to the destination URL.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}