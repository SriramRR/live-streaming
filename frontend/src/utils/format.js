// Placeholder marker for profile fields the backend does not expose yet
// (followers, mutual friends, bio, presence, joined date for discovered users).
// Shown as a neutral dash rather than an invented number so nothing on screen
// misrepresents real data.
export const NO_DATA = '—'

// "just now" / "5m ago" / "3h ago" / "2d ago" / "12 Mar 2026"
export function relativeTime(value) {
  if (!value) return NO_DATA
  const then = new Date(value)
  if (Number.isNaN(then.getTime())) return NO_DATA

  const secs = Math.floor((Date.now() - then.getTime()) / 1000)
  if (secs < 45) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  if (secs < 604800) return `${Math.floor(secs / 86400)}d ago`

  return then.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

// Display name fallback chain: full name -> email local part -> dash
export function displayName(person) {
  if (!person) return NO_DATA
  return person.full_name || person.email?.split('@')[0] || NO_DATA
}
