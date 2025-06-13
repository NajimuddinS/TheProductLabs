import { useAuth } from '../contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const { user, loading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while auth is being checked
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Only redirect after we're sure about auth status
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;