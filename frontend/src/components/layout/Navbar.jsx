import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users2, ShieldCheck, ChevronDown, LogOut, Menu, X } from 'lucide-react'

import Brand from './Brand'
import UserAvatar from '../connections/UserAvatar'
import { useAuth } from '../../context/AuthContext'
import { displayName } from '../../utils/format'

// Primary application navigation. Links are role-aware: viewers get
// Connections, admins get the Admin console.
export default function Navbar({ pendingCount = 0 }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  // Close the account dropdown on outside click / Escape.
  useEffect(() => {
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const isAdmin = user?.role === 'admin'

  const links = [
    { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    ...(isAdmin
      ? [{ to: '/admin', label: 'Admin', Icon: ShieldCheck }]
      : [{ to: '/connections', label: 'Connections', Icon: Users2, badge: pendingCount }]),
  ]

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* brand + primary links */}
          <div className="flex items-center gap-8 min-w-0">
            <Link to="/dashboard" className="shrink-0">
              <Brand />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map(({ to, label, Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition
                     ${isActive
                       ? 'text-teal-700 bg-teal-50'
                       : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
                  }
                >
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                  {label}
                  {badge > 0 && (
                    <span className="ml-0.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center
                      rounded-full bg-orange-500 text-white text-[10px] font-bold tabular">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* account menu */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <UserAvatar seed={user?.id} label={displayName(user)} size="xs" />
                <span className="hidden sm:block min-w-0 text-left">
                  <span className="block text-[13px] font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                    {displayName(user)}
                  </span>
                  <span className="block text-[11px] text-slate-500 leading-tight capitalize">
                    {user?.role}
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2.2}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-[13px] font-semibold text-slate-900 truncate">
                      {displayName(user)}
                    </p>
                    <p className="text-[12px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium
                      text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.2} />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* mobile nav toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-lg border border-slate-300 flex items-center
                justify-center text-slate-600 hover:bg-slate-50 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* mobile links */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {links.map(({ to, label, Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition
                   ${isActive ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={2.2} />
                {label}
                {badge > 0 && (
                  <span className="ml-auto min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center
                    rounded-full bg-orange-500 text-white text-[10px] font-bold tabular">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
