// Neutral surface card. Elevation stays subtle — hierarchy comes from
// spacing and type, not from heavy shadows.
export default function Card({ children, className = '', padded = true, hover = false, as: Tag = 'div' }) {
  return (
    <Tag
      className={`bg-white rounded-xl border border-slate-200
        ${hover ? 'transition-shadow duration-200 hover:shadow-md hover:border-slate-300' : 'shadow-sm'}
        ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

// Section heading used inside cards and page sections.
export function SectionTitle({ children, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold text-slate-900 truncate">{children}</h2>
        {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
