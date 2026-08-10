import React, { useState } from 'react'
import { Link2, LogOut, LayoutDashboard, User, Settings, ArrowRight, Menu, X, Sparkles } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, signOut } = useAppContext()

  const currentPath = location.pathname

  const handleNav = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/80 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group text-left cursor-pointer"
          aria-label="ShortLink Home"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white group-hover:border-white/25 group-hover:bg-white/[0.1] transition-all">
            <Link2 size={16} strokeWidth={2.4} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                ShortLink
              </span>
              <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-1.5 py-0.2 rounded-full">
                v2.0
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              Fast • Minimal • Real-time Analytics
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => handleNav('/')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPath === '/'
                ? 'text-white bg-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`}
          >
            Home
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('/dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/dashboard'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard size={14} className="opacity-70" />
                Dashboard
              </button>

              <button
                onClick={() => handleNav('/profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/profile'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <User size={14} className="opacity-70" />
                Profile
              </button>

              <button
                onClick={() => handleNav('/settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/settings'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Settings size={14} className="opacity-70" />
                Settings
              </button>

              <div className="w-px h-4 bg-white/10 mx-1.5" />

              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sign out of account"
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('/login')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === '/login'
                    ? 'text-white bg-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                Sign in
              </button>

              <button
                onClick={() => handleNav('/signup')}
                className="ml-2 inline-flex items-center gap-1.5 bg-white text-zinc-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs hover:bg-zinc-200 shadow-sm transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight size={13} />
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.07] bg-[#0c0c0f] px-4 py-4 space-y-2">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
          >
            Home
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('/dashboard')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
              <button
                onClick={() => handleNav('/profile')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
              >
                <User size={15} />
                Profile
              </button>
              <button
                onClick={() => handleNav('/settings')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
              >
                <Settings size={15} />
                Settings
              </button>
              <button
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('/login')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/[0.06] cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="w-full flex items-center justify-center gap-1.5 bg-white text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-zinc-200 cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
