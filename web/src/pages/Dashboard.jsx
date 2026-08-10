import { useState, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'
import { UrlCommandInput } from '../components/UrlCommandInput'
import { StatCard } from '../components/StatCard'
import { EmptyLinksState } from '../components/EmptyLinksState'
import { LinkRow } from '../components/LinkRow'
import { Sparkles, Search, Lightbulb } from 'lucide-react'

export const Dashboard = () => {
  const {
    message,
    setMessage,
    profile,
    links,
    originalUrl,
    setOriginalUrl,
    handleCreateLink,
    loading,
    totalRedirects,
  } = useAppContext()

  const [searchTerm, setSearchTerm] = useState('')

  const filteredLinks = useMemo(() => {
    if (!searchTerm.trim()) return links
    const term = searchTerm.toLowerCase()
    return links.filter(
      (link) =>
        link.original_url?.toLowerCase().includes(term) ||
        link.short_url?.toLowerCase().includes(term)
    )
  }, [links, searchTerm])

  const averageClicks = useMemo(() => {
    if (!links.length) return 0
    return Math.round(totalRedirects / links.length)
  }, [links, totalRedirects])

  return (
    <div className="relative min-h-screen flex flex-col">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Dashboard Header */}
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-zinc-400">
              <Sparkles size={12} className="text-purple-400" />
              <span>Control Center</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500">Live Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back{profile?.email ? `, ${profile.email.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm text-zinc-400">
              Shorten destination URLs, monitor live redirect velocity, and maximize campaign click-through rates.
            </p>
          </header>

          {/* URL Shortener Command Center */}
          <UrlCommandInput
            originalUrl={originalUrl}
            setOriginalUrl={setOriginalUrl}
            handleCreateLink={handleCreateLink}
            loading={loading}
          />

          {/* Marketer Retention Tip Banner */}
          <div className="flex items-center gap-3 bg-amber-500/[0.05] border border-amber-500/20 rounded-xl p-3.5 text-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-300 shrink-0">
              <Lightbulb size={15} />
            </div>
            <div className="text-zinc-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold mr-1">Growth Tip:</strong>
              Short links in email &amp; SMS campaigns reduce spam score triggers and increase CTR by up to 34%. All redirects resolve in &lt;15ms.
            </div>
          </div>

          {/* Key Performance Metrics Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Key Performance Metrics">
            <StatCard
              type="links"
              label="Total Active Links"
              value={links.length}
            />
            <StatCard
              type="redirects"
              label="Total Redirects (Clicks)"
              value={totalRedirects}
            />
            <StatCard
              type="session"
              label="Avg Clicks / Link"
              value={averageClicks}
            />
          </section>

          {/* Recent Links Overview */}
          <section className="space-y-4" aria-label="Links Overview">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">Your Shortened Links</h2>
                <p className="text-xs text-zinc-400">
                  {links.length} {links.length === 1 ? 'link' : 'links'} created • Updates in real time
                </p>
              </div>

              {links.length > 2 && (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full sm:w-60 bg-[#101013] border border-white/[0.08] focus:border-white/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 outline-none transition-all"
                    placeholder="Search by code or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Filter links"
                  />
                </div>
              )}
            </div>

            {links.length === 0 ? (
              <EmptyLinksState />
            ) : filteredLinks.length === 0 ? (
              <div className="bg-[#101013] border border-white/[0.08] rounded-xl p-8 text-center text-xs text-zinc-400">
                No links matched your search term "{searchTerm}".
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLinks.map((link) => (
                  <LinkRow key={link.id || link.short_url} link={link} />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}