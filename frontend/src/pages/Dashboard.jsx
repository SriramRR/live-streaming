import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const ROLE_BADGE = {
  admin: 'bg-indigo-100 text-indigo-700',
  viewer: 'bg-emerald-100 text-emerald-700',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  // Shared endpoint — both roles can read this.
  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    api.stats()
      .then((d) => setStats(d.stats))
      .catch((err) => setStatsError(err.message))
  }, [])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">You are signed in</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Admin-only link — viewers never see it (server also enforces this) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Admin panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 select-none">
              {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.full_name || '—'}</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_BADGE[user?.role] || 'bg-slate-100 text-slate-700'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="text-sm">
            <Row label="Email" value={user?.email} />
            <Row label="Role" value={user?.role} />
            <Row label="User ID" value={<span className="font-mono text-xs text-slate-500">{user?.id}</span>} />
          </div>
        </div>

        {/* Shared data: visible to both admin and viewer */}
        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <p className="text-sm font-semibold text-slate-800 mb-3">Account statistics</p>
          {statsError ? (
            <p className="text-sm text-red-600">{statsError}</p>
          ) : !stats ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Total" value={stats.total} />
              <Stat label="Admins" value={stats.admins} />
              <Stat label="Viewers" value={stats.viewers} />
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          {isAdmin
            ? 'You have full administrative access.'
            : 'You have read-only access. Admin features are hidden and blocked by the server.'}
        </p>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 sm:w-24 shrink-0">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200 py-3">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}
