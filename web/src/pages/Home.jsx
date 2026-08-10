import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ToastNotification } from '../components/ToastNotification'
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Share2,
  Lock,
  Check
} from 'lucide-react'

export const Home = () => {
  const { message, setMessage, isAuthenticated, setOriginalUrl } = useAppContext()
  const navigate = useNavigate()

  const [openFaq, setOpenFaq] = useState(null)
  const [demoCopied, setDemoCopied] = useState(false)
  const [testUrl, setTestUrl] = useState('')

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleDemoCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText('https://shortlink.dev/r/launch26')
        setDemoCopied(true)
        setTimeout(() => setDemoCopied(false), 2000)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleTestShorten = (e) => {
    e.preventDefault()
    if (testUrl.trim()) {
      setOriginalUrl(testUrl.trim())
    }
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/signup')
    }
  }

  const faqs = [
    {
      q: 'How does ShortLink increase my click-through rates (CTR)?',
      a: 'Cluttered URLs filled with lengthy UTM strings look suspicious and trigger spam warnings. ShortLink transforms ugly 140+ character URLs into clean, recognizable 8-character links, boosting user trust and improving CTR by up to 34% on social media, SMS, and email campaigns.'
    },
    {
      q: 'Will short links slow down the redirect experience for my users?',
      a: 'Not at all. ShortLink is engineered in Go with high-performance PostgreSQL indexing, delivering sub-15ms 302 redirects. This is faster than standard browser DNS resolution and eliminates the redirect lag common in legacy shorteners.'
    },
    {
      q: 'Can I track click analytics in real time without violating privacy?',
      a: 'Yes. Every redirect automatically updates live click counters without placing invasive tracking cookies or harvesting personal identifying information (PII). You get instant attribution data while staying fully compliant with GDPR and CCPA.'
    },
    {
      q: 'Is there a developer REST API for automated link shortening?',
      a: 'Absolutely. ShortLink provides standard JSON REST endpoints (`POST /shorten`, `GET /redirect/{code}`) ready to drop into your CI/CD pipelines, marketing automation tools, or custom backend services.'
    },
    {
      q: 'Do my shortened links expire?',
      a: 'No. All generated links are stored persistently in our PostgreSQL database and remain active permanently unless explicitly removed.'
    }
  ]

  return (
    <div className="relative min-h-screen flex flex-col">
      <ToastNotification message={message} onDismiss={() => setMessage('')} />

      <main className="flex-1 pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-24">
          
          {/* =================================================================
              1. HERO SECTION (Balanced, High-Converting)
             ================================================================= */}
          <section className="pt-8 pb-4 text-center max-w-3xl mx-auto space-y-6" aria-label="Hero Section">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:border-white/15 px-3 py-1.5 rounded-full text-xs transition-all">
              <span className="flex items-center gap-1 font-semibold text-purple-300">
                <Sparkles size={13} className="text-purple-400" />
                Next-Gen Link Intelligence
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">Sub-15ms Redirects</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              Shorten links.<br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-purple-300 bg-clip-text text-transparent">
                Maximize every click.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Transform cluttered, intimidating URLs into crisp, high-converting short links. 
              Real-time redirect analytics, instant clipboard sharing, and developer-grade Go performance.
            </p>

            {/* Interactive Quick Test Drive Box */}
            <form onSubmit={handleTestShorten} className="pt-2 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#101013] border border-white/[0.12] rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] focus-within:border-white/30 focus-within:ring-2 focus-within:ring-white/10 transition-all">
                <input
                  type="url"
                  className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
                  placeholder="Paste your long URL here (e.g. https://yourbrand.com/promo)..."
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  aria-label="Destination URL"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-zinc-200 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  <span>{isAuthenticated ? 'Shorten in Dashboard' : 'Shorten & Track Free'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 mt-2.5 flex-wrap">
                <span>✓ Free tier forever</span>
                <span>•</span>
                <span>✓ No credit card required</span>
                <span>•</span>
                <span>✓ Instant live analytics</span>
              </div>
            </form>

            {/* Trust Badges Strip */}
            <div className="pt-6 flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
                <Zap size={13} className="text-amber-400" />
                <span>&lt;15ms Redirect Latency</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
                <BarChart3 size={13} className="text-emerald-400" />
                <span>Real-Time Click Telemetry</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
                <ShieldCheck size={13} className="text-sky-400" />
                <span>Zero Tracking Cookies</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
                <Code2 size={13} className="text-purple-400" />
                <span>REST API Ready</span>
              </div>
            </div>
          </section>

          {/* =================================================================
              2. BEFORE & AFTER TRANSFORMATION (Visual CTR Proof)
             ================================================================= */}
          <section className="space-y-8" aria-label="Link Transformation Proof">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Why Clean Links Convert
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ugly URLs cost you traffic. ShortLink fixes it.
              </h2>
              <p className="text-sm text-zinc-400">
                Bloated UTM strings look like spam and trigger user hesitation. Clean links inspire confidence and increase CTR.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cluttered URL Card */}
              <div className="bg-[#141010]/70 border border-red-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                    ❌ Cluttered Long URL
                  </span>
                  <span className="text-xs font-semibold text-red-400">~14% Low CTR</span>
                </div>

                <div className="p-3 bg-black/40 border border-dashed border-red-500/25 rounded-xl font-mono text-xs text-zinc-500 break-all leading-relaxed">
                  https://store.example.com/products/summer-sale?utm_source=newsletter&utm_medium=email&utm_campaign=flash_sale_2026&utm_content=hero_cta_v2
                </div>

                <ul className="space-y-2 text-xs text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                    <span>Breaks line wrapping on mobile and SMS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                    <span>Triggers spam filters and user skepticism</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                    <span>Impossible to memorize or read aloud</span>
                  </li>
                </ul>
              </div>

              {/* ShortLink Card */}
              <div className="bg-[#0e1713]/70 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_35px_rgba(52,211,153,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    ✨ ShortLink Optimized
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">+34% Higher CTR</span>
                </div>

                <div className="p-3 bg-black/50 border border-emerald-500/25 rounded-xl flex items-center justify-between gap-2">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-white truncate">
                    https://shortlink.dev/r/launch26
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer shrink-0"
                    onClick={handleDemoCopy}
                  >
                    {demoCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{demoCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Instant sub-15ms direct 302 forwarding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Real-time redirect analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Clean, verified appearance on any platform</span>
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* =================================================================
              3. METRICS BANNER
             ================================================================= */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/[0.08] text-center" aria-label="Performance Numbers">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">34%</div>
              <div className="text-xs text-zinc-400">Average CTR Lift</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">&lt;15ms</div>
              <div className="text-xs text-zinc-400">Redirect Speed (Go Core)</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">99.99%</div>
              <div className="text-xs text-zinc-400">Uptime Reliability</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">0</div>
              <div className="text-xs text-zinc-400">Annoying Ad Delays</div>
            </div>
          </section>

          {/* =================================================================
              4. 6-FEATURE GRID
             ================================================================= */}
          <section className="space-y-8" aria-label="Features">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Enterprise-Grade Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Everything you need to scale your link strategy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <Zap size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Lightning 302 Redirects</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Powered by Go 1.26 and PostgreSQL indexing. Visitors reach their destination in milliseconds without intermediate landing delays.
                </p>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <TrendingUp size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Real-Time Click Velocity</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitor campaign engagement as it happens. Watch redirect counts tick up live the second your newsletter or tweet goes out.
                </p>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Privacy-First Tracking</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We count redirects without injecting third-party tracking pixels or collecting user personal data. Fully GDPR compliant.
                </p>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <Code2 size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Developer REST API</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Generate, manage, and query short links programmatically via standard JSON REST endpoints. Easy integration for apps and bots.
                </p>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <Lock size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">Cryptographic Token Auth</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Secure tokenized sessions keep your link management dashboard protected while allowing instant, seamless cross-tab synchronization.
                </p>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <Share2 size={16} />
                </div>
                <h3 className="text-sm font-semibold text-white">1-Click Fast Sharing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Instant clipboard copying with robust cross-browser fallback and direct destination previews so you never send broken links.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================================
              5. AUDIENCE & PERSONAS
             ================================================================= */}
          <section className="space-y-8" aria-label="Use Cases">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Tailored For Your Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Built for the teams driving traffic
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-6 space-y-4 flex flex-col">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Growth Marketers</span>
                <h3 className="text-sm font-bold text-white leading-snug">Clean attribution for social, email &amp; SMS campaigns</h3>
                <p className="text-xs text-zinc-400 flex-1 leading-relaxed">
                  Shorten long UTM campaign URLs into sleek links that fit SMS character limits and look verified in Twitter/X and LinkedIn bios.
                </p>
                <div className="pt-2 space-y-2 border-t border-white/[0.06] text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>34% higher average CTR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Never flagged by spam filters</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-6 space-y-4 flex flex-col">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Content Creators</span>
                <h3 className="text-sm font-bold text-white leading-snug">Crisp bio links and video descriptions</h3>
                <p className="text-xs text-zinc-400 flex-1 leading-relaxed">
                  Share sponsor links, affiliate codes, and newsletter signups without ugly multi-line wraps in YouTube and Instagram captions.
                </p>
                <div className="pt-2 space-y-2 border-t border-white/[0.06] text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>1-Click clipboard instant share</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>No sketchy intermediate ads</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#101013] border border-white/[0.08] rounded-2xl p-6 space-y-4 flex flex-col">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Developers</span>
                <h3 className="text-sm font-bold text-white leading-snug">Automate link generation with simple JSON API</h3>
                <p className="text-xs text-zinc-400 flex-1 leading-relaxed">
                  Embed link shortening directly into your transactional email servers, Slack notification bots, or customer invitation engines.
                </p>
                <div className="pt-2 space-y-2 border-t border-white/[0.06] text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Sub-15ms redirect latency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Go + PostgreSQL robust backend</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              6. FAQ SECTION
             ================================================================= */}
          <section className="space-y-8" aria-label="Frequently Asked Questions">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`bg-[#101013] border rounded-xl p-4 cursor-pointer transition-all ${
                    openFaq === index ? 'border-white/30 bg-[#16161a]' : 'border-white/[0.08] hover:border-white/15'
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{faq.q}</h3>
                    <ChevronDown
                      size={16}
                      className={`text-zinc-400 transition-transform shrink-0 ${openFaq === index ? 'rotate-180 text-white' : ''}`}
                    />
                  </div>
                  {openFaq === index && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-zinc-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* =================================================================
              7. FINAL CTA BANNER
             ================================================================= */}
          <section className="pt-6" aria-label="Call to Action">
            <div className="bg-gradient-to-b from-white/[0.07] to-[#101013] border border-white/[0.12] rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-2xl">
              <span className="inline-block text-[11px] font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full">
                Get Started in Seconds
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to upgrade your link game?
              </h2>
              <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Join growth marketers, developers, and creators who rely on ShortLink for instant redirects and real-time click intelligence.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate('/signup')}
                      className="inline-flex items-center gap-2 bg-white text-zinc-950 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-zinc-200 shadow-md transition-all cursor-pointer"
                    >
                      <span>Create Free Account</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white font-medium px-5 py-3 rounded-xl text-sm transition-all cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 bg-white text-zinc-950 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-zinc-200 shadow-md transition-all cursor-pointer"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}