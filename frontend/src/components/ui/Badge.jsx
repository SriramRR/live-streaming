// Unified badge. Tones stay inside the Tropical Jade Sunrise family.
const TONES = {
  jade: 'bg-teal-50 text-teal-700 border-teal-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function Badge({ children, tone = 'slate', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border
        text-[11px] font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" strokeWidth={2.5} />}
      {children}
    </span>
  )
}
