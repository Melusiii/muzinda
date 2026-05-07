import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'landlord' | 'provider')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-bright flex items-center justify-center">
        <div className="text-primary font-bold animate-pulse">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    // If user doesn't have the required role, redirect to their default dashboard
    let defaultDash = '/dashboard';
    if (user.role === 'landlord') defaultDash = '/landlord';
    else if (user.role === 'provider') {
      defaultDash = user.category === 'transport' ? '/transport-hub' : '/provider';
    }
    return <Navigate to={defaultDash} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
