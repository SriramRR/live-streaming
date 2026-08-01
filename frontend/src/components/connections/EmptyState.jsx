import { Users2, UserPlus, SearchX, Compass } from 'lucide-react'

const VARIANTS = {
  friends: {
    Icon: Users2,
    title: 'No connections yet',
    text: 'Browse the Discover tab and send your first connection request.',
  },
  requests: {
    Icon: UserPlus,
    title: 'No pending requests',
    text: 'When someone asks to connect, their request will appear here.',
  },
  search: {
    Icon: SearchX,
    title: 'No matches found',
    text: 'Try a different name or email address.',
  },
  discover: {
    Icon: Compass,
    title: 'Nobody left to discover',
    text: "You're already connected with everyone on the platform.",
  },
}

export default function EmptyState({ variant = 'discover', action }) {
  const { Icon, title, text } = VARIANTS[variant] || VARIANTS.discover

  return (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center">
      <span className="inline-flex w-12 h-12 rounded-full bg-slate-50 border border-slate-200
        items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
      </span>
      <p className="text-[14px] font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-[13px] text-slate-500 max-w-sm mx-auto">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
