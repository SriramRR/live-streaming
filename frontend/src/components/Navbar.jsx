import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-lg font-semibold text-indigo-600 tracking-tight">
        MyApp
      </Link>
    </nav>
  )
}
