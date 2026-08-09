import React, { useState } from 'react'
import { Link2, LogOut, LayoutDashboard, User, Settings, ArrowRight, Menu, X } from 'lucide-react'

export function TopNav({ page, setPage, isAuthenticated, signOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNav = (targetPage) => {
    setPage(targetPage)
    setMobileMenuOpen(false)
  }

  return (
    <header className="topbar-wrapper">
      <div className="app-container">
        <div className="topbar-inner">
          {/* Brand Logo */}
          <button className="brand-container" onClick={() => handleNav('home')}>
            <div className="brand-glyph">
              <Link2 size={16} strokeWidth={2.2} />
            </div>
            <div className="brand-text-group">
              <span className="brand-name">URL Shortener</span>
              <span className="brand-tagline">Fast, minimal, secure</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="nav-group nav-group-desktop" aria-label="Main Navigation">
            <button
              className={`nav-link-btn ${page === 'home' ? 'active' : ''}`}
              onClick={() => handleNav('home')}
            >
              Home
            </button>

            {isAuthenticated ? (
              <>
                <button
                  className={`nav-link-btn ${page === 'dashboard' ? 'active' : ''}`}
                  onClick={() => handleNav('dashboard')}
                >
                  <LayoutDashboard size={14} className="opacity-70" />
                  Dashboard
                </button>
                <button
                  className={`nav-link-btn ${page === 'profile' ? 'active' : ''}`}
                  onClick={() => handleNav('profile')}
                >
                  <User size={14} className="opacity-70" />
                  Profile
                </button>
                <button
                  className={`nav-link-btn ${page === 'settings' ? 'active' : ''}`}
                  onClick={() => handleNav('settings')}
                >
                  <Settings size={14} className="opacity-70" />
                  Settings
                </button>

                <div className="nav-divider" />

                <button
                  className="nav-link-btn nav-signout-btn"
                  onClick={() => signOut()}
                  title="Sign out of your account"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className={`nav-link-btn ${page === 'login' ? 'active' : ''}`}
                  onClick={() => handleNav('login')}
                >
                  Sign in
                </button>
                <button
                  className="nav-action-btn nav-action-primary"
                  onClick={() => handleNav('signup')}
                >
                  <span>Get started</span>
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-menu-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <button
            className={`nav-link-btn ${page === 'home' ? 'active' : ''}`}
            onClick={() => handleNav('home')}
          >
            Home
          </button>

          {isAuthenticated ? (
            <>
              <button
                className={`nav-link-btn ${page === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNav('dashboard')}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </button>
              <button
                className={`nav-link-btn ${page === 'profile' ? 'active' : ''}`}
                onClick={() => handleNav('profile')}
              >
                <User size={14} />
                Profile
              </button>
              <button
                className={`nav-link-btn ${page === 'settings' ? 'active' : ''}`}
                onClick={() => handleNav('settings')}
              >
                <Settings size={14} />
                Settings
              </button>
              <button
                className="nav-link-btn nav-signout-btn"
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-link-btn ${page === 'login' ? 'active' : ''}`}
                onClick={() => handleNav('login')}
              >
                Sign in
              </button>
              <button
                className="nav-action-btn nav-action-primary"
                onClick={() => handleNav('signup')}
              >
                Create an account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
