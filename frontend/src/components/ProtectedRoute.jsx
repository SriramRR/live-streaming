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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}
