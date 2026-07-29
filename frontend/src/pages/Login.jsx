import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Full static class strings (Tailwind can't detect dynamically built class names).
const ROLE_META = {
  admin: { title: 'Admin', badge: 'bg-indigo-100 text-indigo-700' },
  viewer: { title: 'Viewer', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function Login() {
  const { role } = useParams()
  const meta = ROLE_META[role]
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Unknown role in URL → back to role select.
  if (!meta) return <Navigate to="/" replace />
  // Already logged in → dashboard.
  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const loggedIn = await login(form.email.trim(), form.password)
      // Enforce that the account's role matches the chosen login page.
      if (loggedIn.role !== role) {
        setError(`This is not ${role === 'admin' ? 'an' : 'a'} ${meta.title} account.`)
        setSubmitting(false)
        return
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <span className={`inline-block px-2.5 py-0.5 mb-3 rounded-full text-xs font-medium ${meta.badge}`}>
            {meta.title} portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{meta.title} sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to continue.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            No account?{' '}
            <Link to={`/register/${role}`} className="text-indigo-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            <Link to="/" className="hover:underline">← Choose a different role</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
