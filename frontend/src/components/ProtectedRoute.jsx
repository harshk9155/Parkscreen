import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Wraps any page that requires the user to be logged in.
// If no token found → redirect to /login automatically.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}