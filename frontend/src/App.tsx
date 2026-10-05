import { Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { TOKEN_KEY } from './api/client';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Books from './pages/Books';
import IssueBook from './pages/IssueBook';
import MemberHistory from './pages/MemberHistory';

function Layout() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem(TOKEN_KEY); navigate('/login'); };
  return <><header><Link className="brand" to="/books">ShelfLife <span>Library Management</span></Link><nav><Link to="/books">Books</Link><Link to="/issue">Issue Book</Link><button className="link-button" onClick={logout}>Log out</button></nav></header><main><Outlet /></main></>;
}

function HomeRedirect() { return <Navigate to={localStorage.getItem(TOKEN_KEY) ? '/books' : '/login'} replace />; }
export default function App() { return <Routes><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route path="/books" element={<Books />} /><Route path="/issue" element={<IssueBook />} /><Route path="/members/:id/history" element={<MemberHistory />} /></Route></Route><Route path="/" element={<HomeRedirect />} /><Route path="*" element={<HomeRedirect />} /></Routes>; }
