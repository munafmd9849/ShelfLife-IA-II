import { Navigate, Outlet } from 'react-router-dom';
import { TOKEN_KEY } from '../api/client';

export default function ProtectedRoute() {
  return localStorage.getItem(TOKEN_KEY) ? <Outlet /> : <Navigate to="/login" replace />;
}
