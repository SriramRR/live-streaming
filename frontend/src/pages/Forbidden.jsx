import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Forbidden() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <p className="text-8xl font-black text-slate-200 select-none">403</p>
      <h1 className="text-2xl font-bold text-slate-800 mt-2">Access denied</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6 max-w-sm">
        Your role{user?.role ? ` (${user.role})` : ''} does not have permission to view this page.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
