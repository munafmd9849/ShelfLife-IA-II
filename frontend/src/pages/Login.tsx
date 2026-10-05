import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Login() { const [email, setEmail] = useState('librarian@shelflife.com'); const [password, setPassword] = useState('librarian123'); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const { data } = await api.login(email, password); localStorage.setItem('shelflife_token', data.token); navigate('/books'); } catch (err: any) { setError(err.response?.data?.message || 'Unable to sign in.'); } finally { setLoading(false); } }
  return <div className="login-page"><form className="card login-card" onSubmit={submit}><h1>ShelfLife</h1><p>Library management for campus teams.</p>{error && <div className="notice error">{error}</div>}<label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></div>; }
