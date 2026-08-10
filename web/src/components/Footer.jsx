import React from 'react'
import { Link2, ShieldCheck, Zap, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export function Footer() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAppContext()

  return (
    <footer className="w-full bg-[#0a0a0c] border-t border-white/[0.07] pt-14 pb-8 mt-auto" aria-label="Site Footer">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white">
                <Link2 size={15} strokeWidth={2.4} />
              </div>
              <span className="font-bold text-sm text-zinc-100 tracking-tight">ShortLink</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Next-generation URL shortening and real-time click intelligence. 
              Engineered with Go &amp; React for sub-15ms redirects and zero tracking cookies.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  URL Shortener
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Click Analytics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/settings' : '/login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Developer API
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Campaign Attribution
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions / Personas */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Growth Marketers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Content Creators
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Software Engineers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Social Media Teams
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <Zap size={13} className="text-amber-400 shrink-0" />
                <span>Go 1.26 High-Speed Core</span>
              </li>
              <li className="flex items-center gap-2">
                <BarChart3 size={13} className="text-emerald-400 shrink-0" />
                <span>PostgreSQL 16 Storage</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-sky-400 shrink-0" />
                <span>Tokenized Auth Sessions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} ShortLink. Zero-delay link management platform. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full text-zinc-400">Privacy-First</span>
            <span className="bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full text-zinc-400">Zero Cookie Tracking</span>
            <span className="bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full text-zinc-400">99.99% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
