import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Route guard.
//   - not signed in            -> redirect to role select ("/")
//   - signed in, wrong role    -> redirect to /forbidden
//   - `roles` omitted          -> any authenticated user may enter
//
// NOTE: this is a UX convenience only. The backend re-checks the role on every
// request, so hiding a route here is never the actual security boundary.
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent
            border-t-teal-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}
