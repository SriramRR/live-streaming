import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, Zap, Globe2 } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import Brand from '../components/layout/Brand'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'

const STATS = [
  { value: '2.4K+', label: 'Creators' },
  { value: '18K+', label: 'Live hours' },
  { value: '99.9%', label: 'Uptime' },
]

const TRUST = [
  { Icon: ShieldCheck, label: 'Encrypted sessions' },
  { Icon: Zap, label: 'Low-latency delivery' },
  { Icon: Globe2, label: 'Global edge network' },
]

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already signed in → straight to the right home for this role.
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // The server returns the account's role — route accordingly.
      const account = await login(form.email.trim(), form.password, remember)
      navigate(account.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Sign in failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ─────────── Left: brand story ─────────── */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden
        px-12 xl:px-16 py-12 bg-gradient-to-br from-teal-50 via-white to-amber-50">
        {/* soft sunrise wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 w-[26rem] h-[26rem] rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 w-[28rem] h-[28rem] rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="relative">
          <Brand size="lg" tagline />
        </div>

        <div className="relative max-w-lg">
          <h1 className="text-[42px] xl:text-[52px] font-bold tracking-tight leading-[1.06] text-slate-900">
            Build your
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              streaming network
            </span>
          </h1>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
            One workspace to go live, grow an audience, and connect with the creators
            you collaborate with — secure by default, built for scale.
          </p>

          <div className="mt-8 h-px w-56 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400" />

          {/* headline numbers */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur px-4 py-3.5"
              >
                <p className="text-xl font-bold text-slate-900 tabular leading-none">{value}</p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* trust strip */}
        <div className="relative flex flex-wrap items-center gap-2.5">
          {TRUST.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                border border-slate-200/80 bg-white/70 backdrop-blur text-[12px] font-medium text-slate-600"
            >
              <Icon className="w-3.5 h-3.5 text-teal-600" strokeWidth={2.2} />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────── Right: sign-in ─────────── */}
      <section className="flex items-center justify-center px-5 sm:px-8 py-10 lg:py-12">
        <div className="w-full max-w-[400px]">
          {/* brand shown here on small screens */}
          <div className="lg:hidden mb-8">
            <Brand size="lg" tagline />
          </div>

          <h2 className="text-[26px] font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to your StreamHub account to continue.
          </p>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 mt-6 px-3.5 py-3 rounded-lg
                bg-rose-50 border border-rose-200 text-[13px] text-rose-700"
            >
              <AlertCircle className="w-4 h-4 mt-px shrink-0" strokeWidth={2.2} />
              <span className="min-w-0">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <Field
              label="Email"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Field
              label="Password"
              type="password"
              icon={Lock}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />

            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 accent-teal-600
                  focus:ring-2 focus:ring-teal-100 cursor-pointer"
              />
              <span className="text-[13px] text-slate-600">Keep me signed in</span>
            </label>

            <Button type="submit" size="block" loading={submitting} className="mt-1">
              {submitting ? 'Signing in…' : 'Sign in'}
              {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2.4} />}
            </Button>
          </form>

          <p className="mt-7 text-center text-[13px] text-slate-500">
            New to StreamHub?{' '}
            <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-slate-400">
            Protected by encrypted sessions. By continuing you agree to our
            Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  )
}
