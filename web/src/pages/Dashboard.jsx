import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'
import { UrlCommandInput } from '../components/UrlCommandInput'
import { StatCard } from '../components/StatCard'
import { EmptyLinksState } from '../components/EmptyLinksState'
import { LinkRow } from '../components/LinkRow'

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
    isAuthenticated,
    totalRedirects,
  } = useAppContext()

  return (
    <div className="app-shell">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          {/* Dashboard Header */}
          <header className="page-header">
            <div className="eyebrow">
              <span className="eyebrow-pill">Dashboard</span>
            </div>
            <h1 className="page-title">
              Welcome back{profile?.email ? `, ${profile.email.split('@')[0]}` : ''}
            </h1>
            <p className="page-subtitle">
              Track links, monitor redirects in real-time, and manage your account.
            </p>
          </header>

          {/* Primary Action Area: URL Shortener Command Center */}
          <UrlCommandInput
            originalUrl={originalUrl}
            setOriginalUrl={setOriginalUrl}
            handleCreateLink={handleCreateLink}
            loading={loading}
          />

          {/* Subtle Stats Row */}
          <section className="metrics-strip" aria-label="Key Performance Metrics">
            <StatCard
              type="links"
              label="Total links"
              value={links.length}
            />
            <StatCard
              type="redirects"
              label="Total redirects"
              value={totalRedirects}
            />
            <StatCard
              type="session"
              label="Active session"
              value={isAuthenticated ? 'Secure' : 'None'}
            />
          </section>

          {/* Recent Links List */}
          <section className="links-container" aria-label="Links Overview">
            <div className="section-header">
              <div>
                <h2 className="section-title">Your short links</h2>
                <p className="section-subtitle">
                  {links.length} {links.length === 1 ? 'link' : 'links'} generated
                </p>
              </div>
            </div>

            {links.length === 0 ? (
              <EmptyLinksState />
            ) : (
              <div className="links-list">
                {links.map((link) => (
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