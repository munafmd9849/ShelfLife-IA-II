import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { TOKEN_KEY } from './api/client';
import ProtectedRoute from './components/ProtectedRoute';
import { AppSidebar } from './components/AppSidebar';
import { AppHeader } from './components/AppHeader';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import IssueBook from './pages/IssueBook';
import Members from './pages/Members';
import MemberHistory from './pages/MemberHistory';

function Layout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile, width 64) */}
      <div className="hidden md:flex md:w-64 md:flex-col shrink-0">
        <AppSidebar onLogout={logout} />
      </div>

      {/* Main Content Area with Header and scrollable canvas */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function HomeRedirect() {
  return <Navigate to={localStorage.getItem(TOKEN_KEY) ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/issue" element={<IssueBook />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id/history" element={<MemberHistory />} />
        </Route>
      </Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
