import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Brand from '../components/layout/Brand'
import Button from '../components/ui/Button'

export default function Forbidden() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-12">
      <div className="mb-10">
        <Brand size="lg" />
      </div>

      <div className="text-center max-w-md">
        <span className="inline-flex w-14 h-14 rounded-full bg-rose-50 border border-rose-100
          items-center justify-center mb-5">
          <ShieldAlert className="w-6 h-6 text-rose-600" strokeWidth={2} />
        </span>

        <p className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">Error 403</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Access restricted</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-slate-500">
          Your account
          {user?.role && (
            <>
              {' '}
              <span className="font-semibold text-slate-700 capitalize">({user.role})</span>
            </>
          )}{' '}
          doesn&apos;t have permission to open this page. If you believe this is a
          mistake, contact an administrator.
        </p>

        <Link to="/dashboard" className="inline-block mt-7">
          <Button size="md">
            <ArrowLeft className="w-4 h-4" strokeWidth={2.4} />
            Return to dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
