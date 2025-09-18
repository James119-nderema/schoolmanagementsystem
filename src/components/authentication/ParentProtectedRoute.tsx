import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useParentAuth } from './contexts/ParentAuthContext';

interface ParentProtectedRouteProps {
  children: ReactNode;
}

const ParentProtectedRoute: React.FC<ParentProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useParentAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/parent/login" replace />;
  }

  return <>{children}</>;
};

export default ParentProtectedRoute;
