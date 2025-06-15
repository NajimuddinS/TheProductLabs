import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import MapContainer from './components/MapContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home'; // ✅ Import your new Home component

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-primary-500"></div>
  </div>
);

const AppRouter = () => {
  const { user, loading, isInitialized } = useAuth();

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
        path="/home" 
        element={<Home />} // ✅ This is your new non-protected route
      />
      <Route 
        path="/" 
        element={<Navigate to="/home" replace />} // ✅ Default to /home
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
