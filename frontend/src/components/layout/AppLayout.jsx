import Navbar from './Navbar'

// Shell for every signed-in page: sticky navbar + centred content column.
export default function AppLayout({ children, pendingCount = 0, width = 'max-w-6xl' }) {
  return (
    <div className="min-h-screen bg-slate-50/60">
      <Navbar pendingCount={pendingCount} />
      <main className={`${width} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>{children}</main>
    </div>
  )
}

// Consistent page title block. Actions sit on the right and never wrap into
// the title text.
export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 mb-7">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  )
}
