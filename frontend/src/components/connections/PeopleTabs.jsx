import { Compass, UserPlus, Users2 } from 'lucide-react'

const TABS = [
  { key: 'discover', label: 'Discover', Icon: Compass },
  { key: 'requests', label: 'Requests', Icon: UserPlus },
  { key: 'friends', label: 'Connections', Icon: Users2 },
]

// Underlined tab bar — quieter and more professional than pill buttons.
export default function PeopleTabs({ active, onChange, counts }) {
  return (
    <div className="border-b border-slate-200">
      <nav className="flex items-center gap-1 -mb-px overflow-x-auto">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key
          const count = counts[key] ?? 0
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`inline-flex items-center gap-2 px-4 py-3 border-b-2 text-[13px]
                font-semibold whitespace-nowrap transition
                ${isActive
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={2.2} />
              {label}
              <span
                className={`min-w-[20px] px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular
                  ${isActive
                    ? 'bg-teal-50 text-teal-700'
                    : key === 'requests' && count > 0
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-slate-100 text-slate-500'}`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
