import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'

export const Profile = () => {
  const {
    message,
    setMessage,
    profile,
    links,
    totalRedirects,
  } = useAppContext()

  return (
    <div className="app-shell">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          <div className="settings-layout">
            <header className="page-header">
              <div className="eyebrow">
                <span className="eyebrow-pill">Account</span>
              </div>
              <h1 className="page-title">Your account</h1>
              <p className="page-subtitle">
                Review your registered account profile, credentials, and link activity.
              </p>
            </header>

            <section className="info-section">
              <h2 className="info-section-title">Account overview</h2>
              <div className="info-card">
                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Email address</span>
                    <span className="info-desc">Primary login identity</span>
                  </div>
                  <span className="info-value">{profile?.email || '—'}</span>
                </div>

                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Account ID</span>
                    <span className="info-desc">Unique identifier</span>
                  </div>
                  <span className="info-value-mono">{profile?.id || '—'}</span>
                </div>

                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Member since</span>
                    <span className="info-desc">Account registration date</span>
                  </div>
                  <span className="info-value">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleString()
                      : '—'}
                  </span>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h2 className="info-section-title">Usage statistics</h2>
              <div className="info-card">
                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Total short links</span>
                    <span className="info-desc">Active links created</span>
                  </div>
                  <span className="info-value">{links.length}</span>
                </div>

                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Total redirects</span>
                    <span className="info-desc">Cumulative clicks recorded</span>
                  </div>
                  <span className="info-value">{totalRedirects}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}