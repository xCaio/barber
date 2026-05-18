import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Loading from '../ui/Loading';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuthStore();
  const location = useLocation();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  if (loading) return <Loading fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !profile) {
    return <Loading fullScreen message="Carregando perfil..." />;
  }

  return children;
}
