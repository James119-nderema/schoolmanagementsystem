import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ParentProtectedRouteProps {
  children: ReactNode;
}

const ParentProtectedRoute = ({ children }: ParentProtectedRouteProps) => {
  const token = localStorage.getItem('parent_access_token');
  
  if (!token) {
    return <Navigate to="/parent-login" replace />;
  }

  return <>{children}</>;
};

export default ParentProtectedRoute;
