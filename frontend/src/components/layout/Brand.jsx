import { Radio } from 'lucide-react'

// StreamHub wordmark. `size` controls the lockup scale.
export default function Brand({ size = 'sm', tagline = false }) {
  const box = size === 'lg' ? 'w-11 h-11 rounded-xl' : 'w-8 h-8 rounded-lg'
  const icon = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  const text = size === 'lg' ? 'text-lg' : 'text-[15px]'

  return (
    <span className="inline-flex items-center gap-2.5 min-w-0">
      <span
        className={`${box} shrink-0 bg-gradient-to-br from-teal-600 to-emerald-600
          flex items-center justify-center shadow-sm`}
      >
        <Radio className={`${icon} text-white`} strokeWidth={2.4} />
      </span>
      <span className="min-w-0">
        <span className={`block ${text} font-bold tracking-tight text-slate-900 leading-none`}>
          Stream<span className="text-teal-600">Hub</span>
        </span>
        {tagline && (
          <span className="block mt-1 text-[11px] text-slate-500 leading-none">
            Where creators connect
          </span>
        )}
      </span>
    </span>
  )
}
