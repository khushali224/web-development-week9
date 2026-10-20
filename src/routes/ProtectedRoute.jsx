import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader label="Checking your session..." />;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
