import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStaffAuth } from './contexts/StaffAuthContext';

interface StaffProtectedRouteProps {
  children: ReactNode;
}

const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useStaffAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  return <>{children}</>;
};

export default StaffProtectedRoute;