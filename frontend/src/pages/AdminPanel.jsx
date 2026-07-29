import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ROLE_BADGE = {
  admin: 'bg-indigo-100 text-indigo-700',
  viewer: 'bg-emerald-100 text-emerald-700',
}

export default function AdminPanel() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setError('')
    try {
      const data = await api.listUsers()
      setUsers(data.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function changeRole(id, role) {
    setBusyId(id)
    setError('')
    try {
      await api.updateUserRole(id, role)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  async function removeUser(id, email) {
    if (!window.confirm(`Delete ${email}? This cannot be undone.`)) return
    setBusyId(id)
    setError('')
    try {
      await api.deleteUser(id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin panel</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage accounts and roles</p>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left font-medium text-slate-600 px-4 py-3">User</th>
                    <th className="text-left font-medium text-slate-600 px-4 py-3">Role</th>
                    <th className="text-right font-medium text-slate-600 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u.id === user?.id
                    return (
                      <tr key={u.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">
                            {u.full_name || '—'}
                            {isSelf && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                          </p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_BADGE[u.role] || 'bg-slate-100 text-slate-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => changeRole(u.id, u.role === 'admin' ? 'viewer' : 'admin')}
                            disabled={busyId === u.id || isSelf}
                            title={isSelf ? 'You cannot change your own role' : ''}
                            className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Make {u.role === 'admin' ? 'viewer' : 'admin'}
                          </button>
                          <button
                            onClick={() => removeUser(u.id, u.email)}
                            disabled={busyId === u.id || isSelf}
                            title={isSelf ? 'You cannot delete your own account' : ''}
                            className="ml-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        No accounts yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          {users.length} account{users.length === 1 ? '' : 's'} · admin-only view
        </p>
      </div>
    </div>
  )
}
