import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loading from '../ui/Loading';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading, profileLoading, initialized } = useAuthStore();
  const location = useLocation();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  if (!initialized || loading) {
    return <Loading fullScreen message="Verificando sessão..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly) {
    if (profileLoading && !profile) {
      return <Loading fullScreen message="Carregando perfil..." />;
    }
    if (!isAdmin()) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
