import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Spinner from '../common/Spinner.jsx'

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
