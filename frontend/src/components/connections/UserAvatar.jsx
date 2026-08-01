// Deterministic avatar in the Tropical Jade Sunrise family.
// Same user always gets the same colour, so people stay recognisable.
const TONES = [
  'bg-teal-600',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-orange-500',
  'bg-cyan-600',
  'bg-lime-600',
]

const SIZES = {
  xs: 'w-8 h-8 text-[12px]',
  sm: 'w-10 h-10 text-[13px]',
  md: 'w-12 h-12 text-[15px]',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
}

const DOT = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
}

const DOT_TONE = {
  online: 'bg-emerald-500',
  streaming: 'bg-orange-500',
  offline: 'bg-slate-300',
}

function pickTone(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return TONES[h % TONES.length]
}

export default function UserAvatar({ seed, label, size = 'sm', status, className = '' }) {
  const initial = (label || '?').trim().charAt(0).toUpperCase() || '?'
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        className={`${SIZES[size]} ${pickTone(seed || label)} rounded-full
          flex items-center justify-center font-semibold text-white select-none`}
      >
        {initial}
      </span>
      {status && (
        <span
          className={`absolute right-0 bottom-0 ${DOT[size]} ${DOT_TONE[status] || DOT_TONE.offline}
            rounded-full ring-2 ring-white`}
        />
      )}
    </span>
  )
}
