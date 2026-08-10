import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ToastNotification } from '../components/ToastNotification'
import { ArrowRight, BarChart3, ShieldCheck, User } from 'lucide-react'

export const Home = () => {
  const { message, setMessage, isAuthenticated } = useAppContext()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="eyebrow">
              <span className="eyebrow-pill">URL Shortener</span>
              <span>Fast &amp; minimal</span>
            </div>

            <h1 className="hero-headline">
              Short links.<br />
              <span className="hero-headline-accent">Without the clutter.</span>
            </h1>

            <p className="hero-description">
              Transform long, complex URLs into concise, branded links. Real-time redirect analytics, instant clipboard sharing, and secure token access.
            </p>

            <div className="hero-cta-group">
              {!isAuthenticated ? (
                <>
                  <button className="btn-primary" onClick={() => navigate('/signup')}>
                    <span>Get started free</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/login')}>
                    Sign in
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  <span>Go to dashboard</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </section>

          {/* Clean 3-Column Feature Row */}
          <section className="features-container">
            <div className="feature-grid-3">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <BarChart3 size={18} />
                </div>
                <h2 className="feature-title">Track your links</h2>
                <p className="feature-desc">
                  See each short URL alongside real-time redirect counts, creation timestamps, and original destinations.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <ShieldCheck size={18} />
                </div>
                <h2 className="feature-title">Secure auth</h2>
                <p className="feature-desc">
                  Authentication is token-based, signed cryptographically, and stored securely in local browser storage.
                </p>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <User size={18} />
                </div>
                <h2 className="feature-title">Profile management</h2>
                <p className="feature-desc">
                  Review your account credentials, monitor active sessions, and safely sign out anytime from settings.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}