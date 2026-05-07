import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoadingScreen } from './LoadingScreen'

interface RoleGuardProps {
  allowedRoles: ('student' | 'landlord' | 'provider')[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />
  }

  if (!allowedRoles.includes(user.role as any)) {
    // If user is authenticated but doesn't have the right role, redirect to their default dashboard
    const redirectPath = user.role === 'student' ? '/explorer' : 
                        user.role === 'landlord' ? '/landlord' : 
                        user.role === 'provider' ? '/provider' : '/'
    
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default RoleGuard
