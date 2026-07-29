import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <p className="text-8xl font-black text-slate-200 select-none">404</p>
      <h1 className="text-2xl font-bold text-slate-800 mt-2">Page not found</h1>
      <p className="text-slate-500 text-sm mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
