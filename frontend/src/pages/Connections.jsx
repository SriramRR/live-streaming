import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, X, Users2, UserPlus, Compass, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { displayName } from '../utils/format'

import AppLayout, { PageHeader } from '../components/layout/AppLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import UserAvatar from '../components/connections/UserAvatar'
import PeopleTabs from '../components/connections/PeopleTabs'
import EmptyState from '../components/connections/EmptyState'
import ProfileDrawer from '../components/connections/ProfileDrawer'
import { DiscoverCard, RequestCard, FriendCard } from '../components/connections/cards'

export default function Connections() {
  const { user } = useAuth()

  // ── State (API calls and logic unchanged) ──────────────────────
  const [tab, setTab] = useState('discover')
  const [query, setQuery] = useState('')
  const [viewers, setViewers] = useState([])
  const [requests, setRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [busy, setBusy] = useState(null)
  const [toast, setToast] = useState(null)
  const [drawerPerson, setDrawerPerson] = useState(null)

  const notify = useCallback((kind, text) => {
    setToast({ kind, text })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const load = useCallback(async ({ quiet } = {}) => {
    if (!quiet) setLoading(true)
    try {
      const [v, r, f] = await Promise.all([
        api.listOtherViewers(),
        api.incomingRequests(),
        api.friends(),
      ])
      setViewers(v.viewers)
      setRequests(r.requests)
      setFriends(f.friends)
    } catch (err) {
      notify('err', err.message)
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    load()
  }, [load])

  async function act(key, fn, successText) {
    setBusy(key)
    try {
      await fn()
      await load({ quiet: true })
      if (successText) notify('ok', successText)
    } catch (err) {
      notify('err', err.message)
    } finally {
      setBusy(null)
    }
  }

  async function refresh() {
    setRefreshing(true)
    await load({ quiet: true })
    setRefreshing(false)
  }

  // ── Derived ────────────────────────────────────────────────────
  const notConnected = useMemo(
    () => viewers.filter((v) => v.status !== 'connected'),
    [viewers]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notConnected
    return notConnected.filter(
      (v) => (v.full_name || '').toLowerCase().includes(q) || v.email.toLowerCase().includes(q)
    )
  }, [notConnected, query])

  const counts = {
    discover: notConnected.length,
    requests: requests.length,
    friends: friends.length,
  }

  return (
    <AppLayout pendingCount={requests.length} width="max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Connections"
        description="Find creators on StreamHub, manage requests, and grow your professional network."
        actions={
          <Button size="sm" variant="outline" onClick={refresh} disabled={refreshing}>
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={2.2} />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
        {/* ── Left rail ─────────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <Card padded={false}>
              <div className="h-16 rounded-t-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400" />
              <div className="px-4 pb-4">
                <div className="-mt-8 mb-3">
                  <UserAvatar
                    seed={user?.id}
                    label={displayName(user)}
                    size="lg"
                    status="online"
                    className="ring-4 ring-white rounded-full"
                  />
                </div>
                <p className="text-[14px] font-semibold text-slate-900 truncate">
                  {displayName(user)}
                </p>
                <p className="text-[12px] text-slate-500 truncate">{user?.email}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                  <RailStat value={friends.length} label="Connections" />
                  <RailStat value={requests.length} label="Requests" highlight={requests.length > 0} />
                </div>
              </div>
            </Card>

            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Network summary
              </p>
              <SummaryRow Icon={Users2} label="Connections" value={friends.length} />
              <SummaryRow Icon={UserPlus} label="Pending requests" value={requests.length} />
              <SummaryRow Icon={Compass} label="People to discover" value={notConnected.length} last />
            </Card>
          </div>
        </aside>

        {/* ── Main column ───────────────────────────────────────── */}
        <div className="min-w-0">
          {/* search */}
          <div className="relative mb-5">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              strokeWidth={2}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                if (e.target.value && tab !== 'discover') setTab('discover')
              }}
              placeholder="Search creators by name or email"
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

          <PeopleTabs active={tab} onChange={setTab} counts={counts} />

          <div className="mt-5 space-y-3">
            {loading ? (
              <Skeletons />
            ) : tab === 'discover' ? (
              filtered.length === 0 ? (
                <EmptyState variant={query ? 'search' : 'discover'} />
              ) : (
                filtered.map((v) => (
                  <DiscoverCard
                    key={v.id}
                    person={v}
                    busy={busy === (v.connectionId || v.id)}
                    onConnect={() => act(v.id, () => api.sendConnectRequest(v.id), 'Connection request sent')}
                    onAccept={() => act(v.connectionId, () => api.acceptRequest(v.connectionId), 'You are now connected')}
                    onCancel={() => act(v.connectionId, () => api.removeConnection(v.connectionId), 'Request cancelled')}
                    onViewProfile={() => setDrawerPerson(v)}
                  />
                ))
              )
            ) : tab === 'requests' ? (
              requests.length === 0 ? (
                <EmptyState variant="requests" />
              ) : (
                requests.map((r) => (
                  <RequestCard
                    key={r.connectionId}
                    request={r}
                    busy={busy === r.connectionId}
                    onAccept={() => act(r.connectionId, () => api.acceptRequest(r.connectionId), 'You are now connected')}
                    onReject={() => act(r.connectionId, () => api.rejectRequest(r.connectionId), 'Request declined')}
                    onViewProfile={() =>
                      setDrawerPerson({ ...(r.from || {}), status: 'pending_received', connectionId: r.connectionId })
                    }
                  />
                ))
              )
            ) : friends.length === 0 ? (
              <EmptyState
                variant="friends"
                action={
                  <Button size="sm" onClick={() => setTab('discover')}>
                    <Compass className="w-3.5 h-3.5" strokeWidth={2.2} />
                    Browse creators
                  </Button>
                }
              />
            ) : (
              friends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  busy={busy === f.connectionId}
                  onRemove={() => act(f.connectionId, () => api.removeConnection(f.connectionId), 'Connection removed')}
                  onViewProfile={() => setDrawerPerson({ ...f, status: 'connected' })}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ProfileDrawer
        person={drawerPerson}
        busy={busy === (drawerPerson?.connectionId || drawerPerson?.id)}
        onClose={() => setDrawerPerson(null)}
        onConnect={() => {
          const id = drawerPerson.id
          setDrawerPerson(null)
          act(id, () => api.sendConnectRequest(id), 'Connection request sent')
        }}
        onAccept={() => {
          const cid = drawerPerson.connectionId
          setDrawerPerson(null)
          act(cid, () => api.acceptRequest(cid), 'You are now connected')
        }}
      />

      {/* toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5
            px-4 py-3 rounded-lg border shadow-lg text-[13px] font-medium max-w-[92vw] animate-rise-in
            ${toast.kind === 'ok'
              ? 'bg-white border-emerald-200 text-emerald-800'
              : 'bg-white border-rose-200 text-rose-800'}`}
        >
          {toast.kind === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" strokeWidth={2.4} />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" strokeWidth={2.4} />
          )}
          <span className="min-w-0 truncate">{toast.text}</span>
        </div>
      )}
    </AppLayout>
  )
}

/* ── pieces ─────────────────────────────────────────────────────── */

function RailStat({ value, label, highlight }) {
  return (
    <div className={`rounded-lg border p-2.5 text-center ${highlight ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50/60'}`}>
      <p className={`text-[17px] font-bold tabular leading-none ${highlight ? 'text-amber-700' : 'text-slate-900'}`}>
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-500 truncate">{label}</p>
    </div>
  )
}

function SummaryRow({ Icon, label, value, last }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2.5 ${last ? '' : 'border-b border-slate-100'}`}>
      <span className="inline-flex items-center gap-2.5 min-w-0 text-[13px] text-slate-600">
        <Icon className="w-4 h-4 shrink-0 text-slate-400" strokeWidth={2} />
        <span className="truncate">{label}</span>
      </span>
      <Badge tone="slate">{value}</Badge>
    </div>
  )
}

function Skeletons() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="h-3.5 w-40 max-w-full bg-slate-100 rounded" />
              <div className="h-3 w-56 max-w-full bg-slate-50 rounded" />
              <div className="h-5 w-24 bg-slate-50 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <div className="h-8 w-24 bg-slate-100 rounded-lg" />
            <div className="h-8 w-28 bg-slate-50 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}
