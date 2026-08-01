const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap ' +
  'transition-all duration-150 active:scale-[0.99] ' +
  'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100'

const SIZES = {
  xs: 'px-2.5 py-1.5 text-[12px]',
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-4 py-2.5 text-sm',
  block: 'w-full px-4 py-3 text-sm',
}

const VARIANTS = {
  // Jade primary — the single strongest action on a screen
  primary:
    'text-white bg-gradient-to-r from-teal-600 to-emerald-600 ' +
    'shadow-sm shadow-teal-900/10 hover:from-teal-700 hover:to-emerald-700 hover:shadow-md',
  // Sunrise accent — used sparingly for "respond / act now"
  accent:
    'text-white bg-gradient-to-r from-amber-500 to-orange-500 ' +
    'shadow-sm shadow-orange-900/10 hover:from-amber-600 hover:to-orange-600 hover:shadow-md',
  outline: 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400',
  subtle: 'text-slate-700 bg-slate-100 hover:bg-slate-200',
  danger: 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'sm',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {loading && (
        <span className="w-3.5 h-3.5 shrink-0 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
