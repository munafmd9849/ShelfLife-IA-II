import { Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Books from './pages/Books';
import IssueBook from './pages/IssueBook';
import MemberHistory from './pages/MemberHistory';

function Layout() { const navigate = useNavigate(); const logout = () => { localStorage.removeItem('shelflife_token'); navigate('/login'); }; return <><header><Link className="brand" to="/books">ShelfLife</Link><nav><Link to="/books">Books</Link><Link to="/issue">Issue book</Link><button className="link-button" onClick={logout}>Log out</button></nav></header><main><Outlet /></main></>; }
export default function App() { return <Routes><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route path="/books" element={<Books />} /><Route path="/issue" element={<IssueBook />} /><Route path="/members/:id/history" element={<MemberHistory />} /></Route></Route><Route path="*" element={<Navigate to="/books" replace />} /></Routes>; }
