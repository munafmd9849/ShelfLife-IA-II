import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getApiErrorMessage, TOKEN_KEY } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const { data } = await api.login(email, password); localStorage.setItem(TOKEN_KEY, data.token); navigate('/books'); } catch (err: unknown) { setError(getApiErrorMessage(err, 'Unable to sign in.')); } finally { setLoading(false); } }
  return <div className="login-page"><form className="card login-card" onSubmit={submit}><h1>ShelfLife</h1><p>Library Management</p>{error && <div className="notice error">{error}</div>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label><button disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button><p className="demo-hint">Demo: librarian@shelflife.com / librarian123</p></form></div>;
}
