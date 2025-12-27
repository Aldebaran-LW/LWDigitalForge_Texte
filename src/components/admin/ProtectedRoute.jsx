
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role: requiredRole }) => {
  const { isAuthenticated, role: userRole, loading } = useAuth();
  const location = useLocation();

  // Aguardar até que o loading termine completamente antes de verificar autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to the appropriate portal if the role doesn't match
    const redirectTo = userRole === 'ADMIN' ? '/admin' : '/portal';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
