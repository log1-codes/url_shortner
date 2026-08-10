import { useAppContext } from '../context/AppContext'
import { ToastNotification } from '../components/ToastNotification'
import { User } from 'lucide-react'

export const Profile = () => {
  const {
    message,
    setMessage,
    profile,
    links,
    totalRedirects,
  } = useAppContext()

  const averageClicks = links.length ? Math.round(totalRedirects / links.length) : 0

  return (
    <div className="relative min-h-screen flex flex-col">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          
          {/* Header */}
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs text-zinc-400">
              <User size={13} className="text-sky-400" />
              <span>Account Profile</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500">Tier: Free Core Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Account Overview
            </h1>
            <p className="text-sm text-zinc-400">
              Review your registered account profile, credentials, and cumulative link campaign activity.
            </p>
          </header>

          {/* Identity & Credentials */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Identity &amp; Credentials
            </h2>
            <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-5 divide-y divide-white/[0.06] space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Email Address</div>
                  <div className="text-xs text-zinc-400">Primary login identity for dashboard access</div>
                </div>
                <span className="text-sm font-medium text-zinc-200">{profile?.email || '—'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Account Identifier</div>
                  <div className="text-xs text-zinc-400">Unique account database key</div>
                </div>
                <span className="font-mono text-xs text-zinc-400 bg-black/40 border border-white/[0.08] px-2.5 py-1 rounded-lg">
                  {profile?.id || '—'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Member Since</div>
                  <div className="text-xs text-zinc-400">Account registration timestamp</div>
                </div>
                <span className="text-xs text-zinc-300">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleString()
                    : 'Active Member'}
                </span>
              </div>

            </div>
          </section>

          {/* Performance Metrics */}
          <section className="space-y-3">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Cumulative Performance Metrics
            </h2>
            <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-5 divide-y divide-white/[0.06] space-y-4">
              
              <div className="flex items-center justify-between gap-2 pt-0">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Total Short Links Created</div>
                  <div className="text-xs text-zinc-400">Active redirect destinations</div>
                </div>
                <span className="text-base font-bold text-zinc-100">{links.length}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Total Redirects (Clicks)</div>
                  <div className="text-xs text-zinc-400">Cumulative visitor engagements</div>
                </div>
                <span className="text-base font-bold text-emerald-400">{totalRedirects}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4">
                <div>
                  <div className="text-sm font-medium text-zinc-100">Average Clicks Per Link</div>
                  <div className="text-xs text-zinc-400">Campaign engagement efficiency</div>
                </div>
                <span className="text-base font-bold text-sky-400">{averageClicks}</span>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  )
}