import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ToastNotification } from '../components/ToastNotification'
import { ArrowRight } from 'lucide-react'

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    setMessage,
    loading,
    handleLogin,
  } = useAppContext()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="app-main">
        <div className="app-container">
          <div className="auth-wrapper">
            <section className="auth-box">
              <div className="auth-header-group">
                <div className="eyebrow">
                  <span className="eyebrow-pill">Welcome back</span>
                </div>
                <h1 className="auth-title">Sign in</h1>
                <p className="auth-desc">
                  Enter your credentials to access your dashboard and manage links.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleLogin}>
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <div className="auth-switch-row">
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => navigate('/signup')}
                >
                  Don&apos;t have an account?{' '}
                  <span className="auth-switch-highlight">Create an account</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}