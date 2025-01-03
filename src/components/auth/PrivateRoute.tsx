import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redireciona para a página de login, mas salva a URL atual
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
