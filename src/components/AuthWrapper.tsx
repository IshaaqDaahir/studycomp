'use client';

import { useAuth } from '@/context/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthWrapper({ 
  children, 
  fallback = null, 
  requireAuth = true 
}: AuthWrapperProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (requireAuth) {
    return isAuthenticated ? <>{children}</> : <>{fallback}</>;
  } else {
    return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
  }
}