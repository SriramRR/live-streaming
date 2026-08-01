import { Check, Clock, Send, Circle, Radio } from 'lucide-react'
import Badge from '../ui/Badge'

// Relationship state, mapped from the backend `status` field.
const CONNECTION_STATES = {
  connected: { label: 'Connected', Icon: Check, tone: 'emerald' },
  pending_sent: { label: 'Request sent', Icon: Send, tone: 'amber' },
  pending_received: { label: 'Awaiting your response', Icon: Clock, tone: 'orange' },
}

export function ConnectionBadge({ status }) {
  const state = CONNECTION_STATES[status]
  if (!state) return null
  return (
    <Badge tone={state.tone} icon={state.Icon}>
      {state.label}
    </Badge>
  )
}

// Presence. There is no presence/streaming system in the backend yet, so this
// renders "Offline" until real data exists.
const PRESENCE = {
  online: { label: 'Online', Icon: Circle, tone: 'emerald' },
  streaming: { label: 'Live', Icon: Radio, tone: 'orange' },
  offline: { label: 'Offline', Icon: Circle, tone: 'slate' },
}

export function StatusBadge({ status = 'offline' }) {
  const s = PRESENCE[status] || PRESENCE.offline
  return (
    <Badge tone={s.tone} icon={s.Icon}>
      {s.label}
    </Badge>
  )
}
