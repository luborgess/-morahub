import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, initialized, loading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized || loading) {
    return null; // ou um componente de loading
  }

  return <>{children}</>;
}
