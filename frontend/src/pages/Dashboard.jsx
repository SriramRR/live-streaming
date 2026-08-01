import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users2, UserPlus, ShieldCheck, Eye, ArrowRight, Mail, BadgeCheck,
  CalendarDays, Activity,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import AppLayout, { PageHeader } from '../components/layout/AppLayout'
import Card, { SectionTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import CopyId from '../components/ui/CopyId'
import UserAvatar from '../components/connections/UserAvatar'
import { displayName, relativeTime } from '../utils/format'

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isViewer = user?.role === 'viewer'

  const [stats, setStats] = useState(null)
  const [statsError, setStatsError] = useState('')
  const [connCount, setConnCount] = useState(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    api.stats()
      .then((d) => setStats(d.stats))
      .catch((err) => setStatsError(err.message))
  }, [])

  useEffect(() => {
    if (!isViewer) return
    api.friends().then((d) => setConnCount(d.connectionCount)).catch(() => {})
    api.incomingRequests()
      .then((d) => {
        setPendingCount(d.count)
        setRequests(d.requests.slice(0, 3))
      })
      .catch(() => {})
  }, [isViewer])

  return (
    <AppLayout pendingCount={pendingCount} width="max-w-6xl">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${displayName(user)}`}
        description="Here's what's happening across your StreamHub account today."
        actions={
          isViewer ? (
            <Link to="/connections">
              <Button size="md">
                Manage network
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button size="md">
                Admin console
                <ArrowRight className="w-4 h-4" strokeWidth={2.4} />
              </Button>
            </Link>
          )
        }
      />

      {/* ── Metrics row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isViewer && (
          <Metric
            label="My connections"
            value={connCount}
            Icon={Users2}
            tone="jade"
            to="/connections"
          />
        )}
        {isViewer && (
          <Metric
            label="Pending requests"
            value={pendingCount}
            Icon={UserPlus}
            tone="sunrise"
            to="/connections"
            emphasise={pendingCount > 0}
          />
        )}
        <Metric label="Total members" value={stats?.total} Icon={Activity} tone="slate" />
        {isAdmin && <Metric label="Admins" value={stats?.admins} Icon={ShieldCheck} tone="jade" />}
        <Metric label="Viewers" value={stats?.viewers} Icon={Eye} tone="slate" />
      </div>

      {statsError && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-[13px] text-rose-700">
          {statsError}
        </div>
      )}

      {/* ── Two-column body ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* profile */}
        <Card className="lg:col-span-1" padded={false}>
          <div className="h-20 rounded-t-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400" />
          <div className="px-5 pb-5">
            <div className="-mt-9 mb-4">
              <UserAvatar
                seed={user?.id}
                label={displayName(user)}
                size="lg"
                status="online"
                className="ring-4 ring-white rounded-full"
              />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-slate-900 truncate">
                  {displayName(user)}
                </p>
                <p className="text-[13px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <Badge tone={isAdmin ? 'jade' : 'emerald'} icon={isAdmin ? ShieldCheck : BadgeCheck}>
                <span className="capitalize">{user?.role}</span>
              </Badge>
            </div>

            <dl className="mt-5 pt-5 border-t border-slate-100 space-y-3">
              <Row Icon={Mail} label="Email">
                <span className="text-slate-700 truncate block">{user?.email}</span>
              </Row>
              <Row Icon={BadgeCheck} label="Account ID">
                <CopyId id={user?.id} />
              </Row>
            </dl>
          </div>
        </Card>

        {/* activity / next steps */}
        <div className="lg:col-span-2 space-y-5">
          {isViewer ? (
            <Card>
              <SectionTitle
                description={
                  pendingCount > 0
                    ? `${pendingCount} ${pendingCount === 1 ? 'person wants' : 'people want'} to connect with you.`
                    : 'You have no pending connection requests.'
                }
                action={
                  pendingCount > 0 && (
                    <Link to="/connections">
                      <Button size="sm" variant="accent">
                        Review
                      </Button>
                    </Link>
                  )
                }
              >
                Connection requests
              </SectionTitle>

              {requests.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg">
                  <UserPlus className="w-6 h-6 mx-auto mb-2 text-slate-300" strokeWidth={1.8} />
                  <p className="text-[13px] font-medium text-slate-600">Nothing waiting on you</p>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    New requests will appear here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <li key={r.connectionId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <UserAvatar seed={r.from?.id} label={displayName(r.from)} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">
                          {displayName(r.from)}
                        </p>
                        <p className="text-[12px] text-slate-500 truncate">{r.from?.email}</p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 text-[12px] text-slate-400">
                        <CalendarDays className="w-3.5 h-3.5" strokeWidth={2} />
                        {relativeTime(r.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ) : (
            <Card>
              <SectionTitle description="Manage accounts, roles and platform access.">
                Administration
              </SectionTitle>
              <div className="grid sm:grid-cols-2 gap-3">
                <QuickLink
                  to="/admin"
                  Icon={Users2}
                  title="Manage accounts"
                  text="Review every member, change roles, remove access."
                />
                <QuickLink
                  to="/admin"
                  Icon={ShieldCheck}
                  title="Role assignments"
                  text="Promote trusted members or revoke admin rights."
                />
              </div>
            </Card>
          )}

          {/* role capability summary */}
          <Card>
            <SectionTitle description="What this account can do on the platform.">
              Access level
            </SectionTitle>
            <ul className="space-y-2.5">
              {(isAdmin
                ? [
                    'Full administrative access across all accounts',
                    'Promote or demote member roles',
                    'Remove accounts from the platform',
                  ]
                : [
                    'Browse and connect with other creators',
                    'Accept or decline incoming connection requests',
                    'Read-only access — administrative areas are blocked',
                  ]
              ).map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-teal-500" />
                  <span className="text-[13px] text-slate-600">{line}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

/* ── pieces ─────────────────────────────────────────────────────── */

const METRIC_TONES = {
  jade: 'bg-teal-50 text-teal-700',
  sunrise: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-600',
}

function Metric({ label, value, Icon, tone, to, emphasise }) {
  const body = (
    <div
      className={`h-full bg-white rounded-xl border p-4 transition
        ${emphasise ? 'border-amber-300 shadow-sm' : 'border-slate-200'}
        ${to ? 'hover:border-slate-300 hover:shadow-sm' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${METRIC_TONES[tone]}`}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </span>
        {to && <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-300" strokeWidth={2.4} />}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900 tabular leading-none">
        {value ?? <span className="inline-block w-8 h-6 rounded bg-slate-100 animate-pulse align-middle" />}
      </p>
      <p className="mt-1.5 text-[12px] font-medium text-slate-500 truncate">{label}</p>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

function Row({ Icon, label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="inline-flex items-center gap-2 text-[13px] text-slate-500 shrink-0">
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        {label}
      </dt>
      <dd className="min-w-0 text-[13px] text-right">{children}</dd>
    </div>
  )
}

function QuickLink({ to, Icon, title, text }) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 p-4 rounded-lg border border-slate-200
        hover:border-teal-300 hover:bg-teal-50/40 transition"
    >
      <span className="w-8 h-8 shrink-0 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
        <Icon className="w-4 h-4" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-slate-900">{title}</span>
        <span className="block mt-0.5 text-[12px] text-slate-500 leading-relaxed">{text}</span>
      </span>
    </Link>
  )
}
