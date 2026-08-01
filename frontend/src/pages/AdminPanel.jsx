import { useEffect, useState } from 'react'
import {
  Users2, ShieldCheck, Eye, Trash2, ArrowUpDown, AlertCircle, Search, X, RefreshCw,
} from 'lucide-react'

import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AppLayout, { PageHeader } from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import CopyId from '../components/ui/CopyId'
import UserAvatar from '../components/connections/UserAvatar'
import { displayName, relativeTime } from '../utils/format'

export default function AdminPanel() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [query, setQuery] = useState('')

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

  async function removeUser(id) {
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

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const adminCount = users.filter((u) => u.role === 'admin').length
  const viewerCount = users.filter((u) => u.role === 'viewer').length

  const filtered = query.trim()
    ? users.filter((u) => {
        const q = query.trim().toLowerCase()
        return (u.full_name || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      })
    : users

  return (
    <AppLayout width="max-w-5xl">
      <PageHeader
        eyebrow="Administration"
        title="Member management"
        description="Review every account, adjust roles, and control platform access."
        actions={
          <Button size="sm" variant="outline" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2.2} />
            Refresh
          </Button>
        }
      />

      {/* summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Summary label="Total members" value={users.length} Icon={Users2} tone="slate" />
        <Summary label="Administrators" value={adminCount} Icon={ShieldCheck} tone="jade" />
        <Summary label="Viewers" value={viewerCount} Icon={Eye} tone="sunrise" />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 mb-5 px-4 py-3 rounded-lg
          bg-rose-50 border border-rose-200 text-[13px] text-rose-700">
          <AlertCircle className="w-4 h-4 mt-px shrink-0" strokeWidth={2.2} />
          <span className="min-w-0">{error}</span>
        </div>
      )}

      {/* search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" strokeWidth={2} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members by name or email"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-slate-900 placeholder:text-slate-400
            bg-white border border-slate-300 outline-none transition
            focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md
              hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.4} />
          </button>
        )}
      </div>

      {/* list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[86px] rounded-xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <Users2 className="w-6 h-6 mx-auto mb-2.5 text-slate-300" strokeWidth={1.8} />
          <p className="text-[14px] font-semibold text-slate-800">
            {query ? 'No members match your search' : 'No accounts yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => {
            const isSelf = u.id === user?.id
            const name = displayName(u)
            return (
              <div
                key={u.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5
                  transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <UserAvatar seed={u.id} label={name} size="md" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-900 truncate">
                          {name}
                          {isSelf && (
                            <span className="ml-2 text-[11px] font-medium text-slate-400">you</span>
                          )}
                        </p>
                        <p className="text-[12.5px] text-slate-500 truncate">{u.email}</p>
                      </div>
                      <div className="shrink-0">
                        <Badge
                          tone={u.role === 'admin' ? 'jade' : 'emerald'}
                          icon={u.role === 'admin' ? ShieldCheck : Eye}
                        >
                          <span className="capitalize">{u.role}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <CopyId id={u.id} />
                      <span className="text-[12px] text-slate-400">
                        Joined {relativeTime(u.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === u.id || isSelf}
                    title={isSelf ? 'You cannot change your own role' : ''}
                    onClick={() => changeRole(u.id, u.role === 'admin' ? 'viewer' : 'admin')}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                    Change to {u.role === 'admin' ? 'viewer' : 'admin'}
                  </Button>

                  <DeleteControl
                    busy={busyId === u.id}
                    disabled={isSelf}
                    onConfirm={() => removeUser(u.id)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}

function DeleteControl({ busy, disabled, onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (disabled) {
    return (
      <Button size="sm" variant="ghost" disabled title="You cannot delete your own account" className="ml-auto">
        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.2} />
        Delete
      </Button>
    )
  }

  if (!confirming) {
    return (
      <Button
        size="sm"
        variant="ghost"
        disabled={busy}
        onClick={() => setConfirming(true)}
        className="ml-auto text-slate-500 hover:text-rose-700 hover:bg-rose-50"
      >
        <Trash2 className="w-3.5 h-3.5" strokeWidth={2.2} />
        Delete
      </Button>
    )
  }

  return (
    <span className="ml-auto inline-flex items-center gap-2">
      <span className="text-[12px] text-slate-500 whitespace-nowrap">Delete permanently?</span>
      <Button size="xs" variant="danger" loading={busy} onClick={onConfirm}>
        Yes, delete
      </Button>
      <Button size="xs" variant="ghost" onClick={() => setConfirming(false)}>
        Cancel
      </Button>
    </span>
  )
}

const TONES = {
  jade: 'bg-teal-50 text-teal-700',
  sunrise: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
}

function Summary({ label, value, Icon, tone }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${TONES[tone]}`}>
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </span>
      <p className="mt-3 text-2xl font-bold text-slate-900 tabular leading-none">{value}</p>
      <p className="mt-1.5 text-[12px] font-medium text-slate-500 truncate">{label}</p>
    </div>
  )
}
