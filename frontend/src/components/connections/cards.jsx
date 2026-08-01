import { useState } from 'react'
import { UserPlus, Check, X, MessageSquare, Eye, UserMinus, CalendarDays } from 'lucide-react'

import UserAvatar from './UserAvatar'
import { ConnectionBadge, StatusBadge } from './badges'
import Button from '../ui/Button'
import { displayName, relativeTime } from '../../utils/format'

// Shared row layout. Every text region sits in a `min-w-0` column with
// `truncate`, so long names/emails shorten instead of overlapping controls.
function PersonRow({ person, badge, meta, actions }) {
  const name = displayName(person)
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 transition
      hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4">
        <UserAvatar seed={person?.id} label={name} size="md" status="offline" />

        <div className="min-w-0 flex-1">
          {/* identity + state badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-slate-900 truncate">{name}</p>
              <p className="text-[12.5px] text-slate-500 truncate">{person?.email}</p>
            </div>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>

          {meta && <div className="flex flex-wrap items-center gap-2 mt-3">{meta}</div>}
        </div>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          {actions}
        </div>
      )}
    </div>
  )
}

/* ── Discover ──────────────────────────────────────────────────── */

export function DiscoverCard({ person, busy, onConnect, onAccept, onCancel, onViewProfile }) {
  const { status } = person

  return (
    <PersonRow
      person={person}
      badge={<ConnectionBadge status={status} />}
      meta={<StatusBadge status="offline" />}
      actions={
        <>
          {status === 'pending_received' ? (
            <Button size="sm" variant="accent" loading={busy} onClick={onAccept}>
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
              Accept request
            </Button>
          ) : status === 'pending_sent' ? (
            <Button size="sm" variant="outline" loading={busy} onClick={onCancel}>
              <X className="w-3.5 h-3.5" strokeWidth={2.6} />
              Cancel request
            </Button>
          ) : (
            <Button size="sm" loading={busy} onClick={onConnect}>
              <UserPlus className="w-3.5 h-3.5" strokeWidth={2.4} />
              Connect
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={onViewProfile}>
            <Eye className="w-3.5 h-3.5" strokeWidth={2.2} />
            View profile
          </Button>

          <Button size="sm" variant="ghost" disabled title="Available once you are connected">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.2} />
            Message
          </Button>
        </>
      }
    />
  )
}

/* ── Incoming request ──────────────────────────────────────────── */

export function RequestCard({ request, busy, onAccept, onReject, onViewProfile }) {
  const person = request.from || {}

  return (
    <PersonRow
      person={person}
      badge={<ConnectionBadge status="pending_received" />}
      meta={
        <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
          <CalendarDays className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          Requested {relativeTime(request.created_at)}
        </span>
      }
      actions={
        <>
          <Button size="sm" variant="accent" loading={busy} onClick={onAccept}>
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
            Accept
          </Button>
          <Button size="sm" variant="outline" loading={busy} onClick={onReject}>
            <X className="w-3.5 h-3.5" strokeWidth={2.6} />
            Decline
          </Button>
          <Button size="sm" variant="ghost" onClick={onViewProfile}>
            <Eye className="w-3.5 h-3.5" strokeWidth={2.2} />
            View profile
          </Button>
        </>
      }
    />
  )
}

/* ── Friend ────────────────────────────────────────────────────── */

export function FriendCard({ friend, busy, onRemove, onViewProfile }) {
  return (
    <PersonRow
      person={friend}
      badge={<ConnectionBadge status="connected" />}
      meta={
        <>
          <StatusBadge status="offline" />
          <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            Connected {relativeTime(friend.connectedAt)}
          </span>
        </>
      }
      actions={
        <>
          <Button size="sm" variant="outline" disabled title="Messaging is not implemented yet">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.2} />
            Message
          </Button>
          <Button size="sm" variant="ghost" onClick={onViewProfile}>
            <Eye className="w-3.5 h-3.5" strokeWidth={2.2} />
            View profile
          </Button>
          <RemoveButton busy={busy} onConfirm={onRemove} />
        </>
      }
    />
  )
}

// Two-step confirm so a mis-click can't drop a connection.
function RemoveButton({ busy, onConfirm }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setConfirming(true)}
        className="ml-auto text-slate-500 hover:text-rose-700 hover:bg-rose-50">
        <UserMinus className="w-3.5 h-3.5" strokeWidth={2.2} />
        Remove
      </Button>
    )
  }

  return (
    <span className="ml-auto inline-flex items-center gap-2">
      <span className="text-[12px] text-slate-500 whitespace-nowrap">Remove connection?</span>
      <Button size="xs" variant="danger" loading={busy} onClick={onConfirm}>
        Yes
      </Button>
      <Button size="xs" variant="ghost" onClick={() => setConfirming(false)}>
        No
      </Button>
    </span>
  )
}
