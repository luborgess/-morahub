import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redireciona para a página de login, mas salva a URL atual
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
