import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'
import Brand from '../components/layout/Brand'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-12">
      <div className="mb-10">
        <Brand size="lg" />
      </div>

      <div className="text-center max-w-md">
        <span className="inline-flex w-14 h-14 rounded-full bg-slate-50 border border-slate-200
          items-center justify-center mb-5">
          <Compass className="w-6 h-6 text-slate-400" strokeWidth={2} />
        </span>

        <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">Error 404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <Link to="/dashboard" className="inline-block mt-7">
          <Button size="md">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.4} />
            Back to StreamHub
          </Button>
        </Link>
      </div>
    </div>
  )
}
