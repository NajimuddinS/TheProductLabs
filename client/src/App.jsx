import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import MapContainer from './components/MapContainer';
import ProtectedRoute from './components/ProtectedRoute';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-primary-500"></div>
  </div>
);

const AppRouter = () => {
  const { user, loading, isInitialized } = useAuth();

  // Show loading screen while initial auth check is happening
  if (!isInitialized || loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/map" replace /> : <AuthForm />} 
      />
      <Route 
        path="/map" 
        element={
          <ProtectedRoute>
            <MapContainer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/map" : "/login"} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App;