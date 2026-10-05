import { Navigate, Outlet } from 'react-router-dom';
export default function ProtectedRoute() { return localStorage.getItem('shelflife_token') ? <Outlet /> : <Navigate to="/login" replace />; }
