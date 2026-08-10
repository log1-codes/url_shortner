import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'

export const Settings = () => {
  const {
    message,
    setMessage,
    isAuthenticated,
    signOut,
  } = useAppContext()

  return (
    <div className="app-shell">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          <div className="settings-layout">
            <header className="page-header">
              <div className="eyebrow">
                <span className="eyebrow-pill">Security</span>
              </div>
              <h1 className="page-title">Session &amp; security</h1>
              <p className="page-subtitle">
                Manage your active authentication session, token storage, and credentials.
              </p>
            </header>

            <section className="info-section">
              <h2 className="info-section-title">Authentication &amp; storage</h2>
              <div className="info-card">
                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Authentication status</span>
                    <span className="info-desc">Your session is securely authenticated.</span>
                  </div>
                  <div className="metric-status-badge">
                    <span className="status-dot" />
                    <span>{isAuthenticated ? 'Authenticated' : 'Logged out'}</span>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Token storage</span>
                    <span className="info-desc">
                      Stored securely in localStorage for authorized API requests.
                    </span>
                  </div>
                  <span className="info-value-mono">localStorage</span>
                </div>

                <div className="info-row">
                  <div className="info-row-left">
                    <span className="info-label">Session termination</span>
                    <span className="info-desc">
                      Clear browser credentials and invalidate local token.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="danger-action-btn"
                    onClick={() => signOut('Signed out from settings')}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}