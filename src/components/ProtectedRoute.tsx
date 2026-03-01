import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'creator' | 'audience';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const token = Cookies.get('access_token');
  const userStr = Cookies.get('user');
  const location = useLocation();

  if (!token || !userStr) {
    // Not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if route is restricted by role
    if (allowedRole && user.role !== allowedRole) {
      // Role not authorized, redirect to their respective dashboard
      return <Navigate to={`/dashboard/${user.role}`} replace />;
    }

    // Authorized
    return <>{children}</>;
  } catch (error) {
    // Error parsing user data, clear cookies and redirect to login
    Cookies.remove('access_token', { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove('refresh_token', { path: '/', secure: true, sameSite: 'none' });
    Cookies.remove('user', { path: '/', secure: true, sameSite: 'none' });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};
