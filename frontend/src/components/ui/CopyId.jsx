import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// Shortened id with click-to-copy. Full value stays in the tooltip so the
// layout never has to accommodate a full UUID.
export default function CopyId({ id, label = 'ID' }) {
  const [copied, setCopied] = useState(false)
  if (!id) return null

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard blocked (non-https / permissions) — tooltip still shows the id
    }
  }

  return (
    <button
      onClick={copy}
      title={id}
      className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200
        bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition max-w-full"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">
        {label}
      </span>
      <span className="font-mono text-[11px] text-slate-600 truncate">
        {copied ? 'copied' : `${id.slice(0, 8)}…`}
      </span>
      {copied ? (
        <Check className="w-3 h-3 shrink-0 text-emerald-600" strokeWidth={3} />
      ) : (
        <Copy className="w-3 h-3 shrink-0 text-slate-400 group-hover:text-slate-600" strokeWidth={2} />
      )}
    </button>
  )
}
