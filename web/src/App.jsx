import { useEffect, useMemo, useState } from 'react'
import { Link2, ShieldCheck, BarChart3, ArrowRight, User, KeyRound, Sparkles, ExternalLink, Calendar, CheckCircle } from 'lucide-react'
import { TopNav } from './components/TopNav'
import { StatCard } from './components/StatCard'
import { UrlCommandInput } from './components/UrlCommandInput'
import { LinkRow } from './components/LinkRow'
import { EmptyLinksState } from './components/EmptyLinksState'
import { ToastNotification } from './components/ToastNotification'

const apiBase = '/api'
const protectedPages = ['dashboard', 'profile', 'settings']

function App() {
  const [page, setPage] = useState('home')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [token, setToken] = useState(localStorage.getItem('auth_token') || '')
  const [loading, setLoading] = useState(false)

  
  const isAuthenticated = Boolean(token)
  const totalRedirects = useMemo(
    () => links.reduce((sum, link) => sum + (link.clicks || 0), 0),
    [links]
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token)
      fetchProfile()
      fetchLinks()
    } else {
      localStorage.removeItem('auth_token')
      setProfile(null)
      setLinks([])
    }
  }, [token])

  useEffect(() => {
    if (isAuthenticated === false && protectedPages.includes(page)) {
      setPage('login')
    }
  }, [isAuthenticated, page])

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const apiRequest = async (path, options = {}) => {
    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers
      },
      ...options
    })

    if (response.status === 401) {
      signOut('Session expired. Please log in again.')
      throw new Error('Unauthorized')
    }

    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.error || 'Request failed')
    }

    return data
  }

  const setAlert = (text) => {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 5000)
  }

  const signOut = (text = 'Signed out successfully') => {
    setToken('')
    setPage('home')
    setEmail('')
    setPassword('')
    setOriginalUrl('')
    setAlert(text)
  }

  const handleLogin = async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setAlert('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setToken(data.token)
      setPage('dashboard')
      setAlert('Welcome back!')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    if (e) e.preventDefault()
    if (!email || !password) {
      setAlert('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setToken(data.token)
      setPage('dashboard')
      setAlert('Account created successfully')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    if (!token) return
    try {
      const data = await apiRequest('/me', { method: 'GET' })
      setProfile(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchLinks = async () => {
    if (!token) return
    try {
      const data = await apiRequest('/links', { method: 'GET' })
      setLinks(data || [])
    } catch (err) {
      setAlert(err.message)
    }
  }

  const handleCreateLink = async () => {
    if (!originalUrl.trim()) {
      setAlert('Enter a URL to shorten')
      return
    }
    setLoading(true)
    try {
      const data = await apiRequest('/links/create', {
        method: 'POST',
        body: JSON.stringify({ original_url: originalUrl.trim() })
      })
      setLinks((current) => [data, ...current])
      setOriginalUrl('')
      setAlert('Link created successfully')
    } catch (err) {
      setAlert(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* Render Pages */
  const renderHome = () => (
    <div className="app-shell">
      <TopNav
        page={page}
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        signOut={signOut}
      />
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
                  <button className="btn-primary" onClick={()=>setPage("signup")} >
                  <span>HMR IS WORKING 123</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary" onClick={() => setPage('login')}>
                    Sign in
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={() => setPage('dashboard')}>
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

  const renderAuthForm = (mode) => (
    <div className="app-shell">
      <TopNav
        page={page}
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        signOut={signOut}
      />
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          <div className="auth-wrapper">
            <section className="auth-box">
              <div className="auth-header-group">
                <div className="eyebrow">
                  <span className="eyebrow-pill">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </span>
                </div>
                <h1 className="auth-title">
                  {mode === 'login' ? 'Sign in' : 'Create your account'}
                </h1>
                <p className="auth-desc">
                  {mode === 'login'
                    ? 'Enter your credentials to access your dashboard and manage links.'
                    : 'Start shortening URLs and tracking redirects in seconds.'}
                </p>
              </div>

              <form
                className="auth-form"
                onSubmit={mode === 'login' ? handleLogin : handleSignup}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-email">
                    Email address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-password">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-row">
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => setPage(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? (
                    <>
                      Don&apos;t have an account?{' '}
                      <span className="auth-switch-highlight">Create an account</span>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <span className="auth-switch-highlight">Sign in</span>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )

  const renderDashboard = () => (
    <div className="app-shell">
      <TopNav
        page={page}
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        signOut={signOut}
      />
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

  const renderProfile = () => (
    <div className="app-shell">
      <TopNav
        page={page}
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        signOut={signOut}
      />
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

  const renderSettings = () => (
    <div className="app-shell">
      <TopNav
        page={page}
        setPage={setPage}
        isAuthenticated={isAuthenticated}
        signOut={signOut}
      />
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

  if (page === 'home') return renderHome()
  if (page === 'login') return renderAuthForm('login')
  if (page === 'signup') return renderAuthForm('signup')
  if (page === 'dashboard') return renderDashboard()
  if (page === 'profile') return renderProfile()
  if (page === 'settings') return renderSettings()

  return renderHome()
}

export default App
