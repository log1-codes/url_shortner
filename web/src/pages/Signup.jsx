import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ToastNotification } from '../components/ToastNotification'
import { ArrowRight, CheckCircle2, Zap, ShieldCheck, BarChart3, Sparkles } from 'lucide-react'

export const Signup = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    setMessage,
    loading,
    handleSignup,
  } = useAppContext()
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Value Proposition & Onboarding Benefits */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-zinc-400">
              <Sparkles size={12} className="text-purple-400" />
              <span>Instant Free Access</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Start shortening links and boosting CTR in seconds.
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Create your account to unlock unlimited short links, real-time click tracking, and developer API access. No credit card required.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Forever Free Core Tier</h4>
                  <p className="text-[11px] text-zinc-400">Shorten unlimited URLs with permanent persistence.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <BarChart3 size={14} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Real-Time Redirect Telemetry</h4>
                  <p className="text-[11px] text-zinc-400">Instant click counts without intrusive user tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Zap size={14} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Instant Token Generation</h4>
                  <p className="text-[11px] text-zinc-400">Generate API keys to automate your marketing stack.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-emerald-500/[0.05] border border-emerald-500/20 p-3 rounded-xl">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span className="text-[11px] text-zinc-300">
                Zero spam, zero ad redirects, 100% data ownership. We never sell your click data.
              </span>
            </div>
          </div>

          {/* Right Column: Signup Form */}
          <div className="bg-[#101013] border border-white/[0.09] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Create Account</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Get Started with ShortLink</h1>
              <p className="text-xs text-zinc-400">
                Join thousands of marketers and developers shortening links today.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300" htmlFor="auth-email">
                  Work or personal email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-white/30 focus:ring-2 focus:ring-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300" htmlFor="auth-password">
                  Create password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] focus:border-white/30 focus:ring-2 focus:ring-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    <span>Setting up dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-white/[0.06]">
              <button
                type="button"
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Already have an account?{' '}
                <span className="font-semibold text-white underline underline-offset-2">Sign in here</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}