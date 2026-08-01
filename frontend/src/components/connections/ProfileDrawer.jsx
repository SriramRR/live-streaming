import { X, UserPlus, Check, MessageSquare, Users2, Video, CalendarDays, Link2 } from 'lucide-react'

import UserAvatar from './UserAvatar'
import { ConnectionBadge, StatusBadge } from './badges'
import Button from '../ui/Button'
import { NO_DATA, displayName, relativeTime } from '../../utils/format'

// Slide-over profile. Fields the backend does not expose yet render as a
// neutral dash rather than invented values.
export default function ProfileDrawer({ person, busy, onClose, onConnect, onAccept }) {
  if (!person) return null
  const name = displayName(person)

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-[2px] animate-fade-in"
        aria-hidden
      />

      <aside
        role="dialog"
        aria-label={`${name} profile`}
        className="fixed right-0 top-0 z-50 h-full w-full sm:w-[400px] bg-white
          border-l border-slate-200 shadow-xl overflow-y-auto animate-slide-in-right"
      >
        {/* cover */}
        <div className="relative h-24 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-white/90 hover:bg-white
              flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>

        <div className="px-5 pb-8">
          <div className="-mt-10 mb-4">
            <UserAvatar
              seed={person.id}
              label={name}
              size="xl"
              status="offline"
              className="ring-4 ring-white rounded-full"
            />
          </div>

          <h2 className="text-lg font-bold text-slate-900 truncate">{name}</h2>
          <p className="text-[13px] text-slate-500 truncate">{person.email}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <StatusBadge status="offline" />
            <ConnectionBadge status={person.status} />
          </div>

          <p className="mt-4 text-[13px] text-slate-400 italic">No bio added yet</p>

          {/* counters */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <Stat Icon={Users2} value={NO_DATA} label="Followers" />
            <Stat Icon={UserPlus} value={NO_DATA} label="Following" />
            <Stat Icon={Video} value={NO_DATA} label="Streams" />
          </div>

          {/* primary action */}
          <div className="mt-6">
            {person.status === 'connected' ? (
              <Button size="block" variant="outline" disabled title="Messaging is not implemented yet">
                <MessageSquare className="w-4 h-4" strokeWidth={2.2} />
                Message
              </Button>
            ) : person.status === 'pending_received' ? (
              <Button size="block" variant="accent" loading={busy} onClick={onAccept}>
                <Check className="w-4 h-4" strokeWidth={3} />
                Accept request
              </Button>
            ) : person.status === 'pending_sent' ? (
              <Button size="block" variant="outline" disabled>
                Request pending
              </Button>
            ) : (
              <Button size="block" loading={busy} onClick={onConnect}>
                <UserPlus className="w-4 h-4" strokeWidth={2.4} />
                Connect
              </Button>
            )}
          </div>

          {/* meta */}
          <dl className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <MetaLine Icon={CalendarDays} label="Connected since">
              {person.connectedAt ? relativeTime(person.connectedAt) : NO_DATA}
            </MetaLine>
            <MetaLine Icon={Link2} label="Social links">
              Not linked
            </MetaLine>
          </dl>

          {/* recent streams placeholder */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Recent streams
            </p>
            <div className="rounded-lg border border-dashed border-slate-200 py-7 text-center">
              <Video className="w-5 h-5 mx-auto mb-1.5 text-slate-300" strokeWidth={1.8} />
              <p className="text-[12px] text-slate-500">No streams published</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

function Stat({ Icon, value, label }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-center">
      <Icon className="w-4 h-4 mx-auto mb-1.5 text-slate-400" strokeWidth={2} />
      <p className="text-[14px] font-bold text-slate-900 tabular leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  )
}

function MetaLine({ Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="inline-flex items-center gap-2 text-[12.5px] text-slate-500 shrink-0">
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        {label}
      </dt>
      <dd className="text-[12.5px] font-medium text-slate-700 truncate">{children}</dd>
    </div>
  )
}
