import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, AlertCircle, Check, Eye } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import Brand from '../components/layout/Brand'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const PERKS = [
  'Connect with other creators on the platform',
  'Manage your network from one dashboard',
  'Secure, encrypted account by default',
]

export default function Register() {
  const navigate = useNavigate()
  const { user, register } = useAuth()

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />

  function validate() {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Please enter your name.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.password.length < 6) e.password = 'Use at least 6 characters.'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setError('')
    setSubmitting(true)
    try {
      // Public sign-up always creates a viewer account.
      await register({
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim(),
        role: 'viewer',
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ─────────── Left: value proposition ─────────── */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden
        px-12 xl:px-16 py-12 bg-gradient-to-br from-teal-50 via-white to-amber-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 w-[26rem] h-[26rem] rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 w-[28rem] h-[28rem] rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="relative">
          <Brand size="lg" tagline />
        </div>

        <div className="relative max-w-lg">
          <h1 className="text-[42px] xl:text-[52px] font-bold tracking-tight leading-[1.06] text-slate-900">
            Start your
            <br />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              creator journey
            </span>
          </h1>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
            Create a free viewer account to follow streams and start building
            connections across the StreamHub community.
          </p>

          <div className="mt-8 h-px w-56 bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400" />

          <ul className="mt-8 space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-teal-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-[14px] text-slate-600">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-[12px] text-slate-500">
          Already streaming with us?{' '}
          <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Sign in instead
          </Link>
        </div>
      </section>

      {/* ─────────── Right: form ─────────── */}
      <section className="flex items-center justify-center px-5 sm:px-8 py-10 lg:py-12">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden mb-8">
            <Brand size="lg" tagline />
          </div>

          <Badge tone="emerald" icon={Eye} className="mb-3">
            Viewer account
          </Badge>

          <h2 className="text-[26px] font-bold tracking-tight text-slate-900">Create your account</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Free to join. No card required. Admin access is granted by an
            existing administrator.
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
              label="Full name"
              icon={User}
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.full_name}
              error={errors.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
            <Field
              label="Email"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Field
              label="Password"
              type="password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
            <Field
              label="Confirm password"
              type="password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirm}
              error={errors.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            />

            <Button type="submit" size="block" loading={submitting} className="mt-1">
              {submitting ? 'Creating account…' : 'Create account'}
              {!submitting && <ArrowRight className="w-4 h-4" strokeWidth={2.4} />}
            </Button>
          </form>

          <p className="mt-7 text-center text-[13px] text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
