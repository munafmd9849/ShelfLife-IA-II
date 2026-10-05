import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../api/client';
import DataTable, { type Column } from '../components/DataTable';
import type { Book, Member } from '../types';

const GENRES = ['Fiction', 'Non-fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'History', 'Biography', 'Science', 'Technology', 'Romance', 'Poetry'];
const bookColumns: Column<Book>[] = [
  { header: 'Title', cell: (book) => <strong>{book.title}</strong> },
  { header: 'Author', cell: (book) => book.author },
  { header: 'ISBN', cell: (book) => book.isbn },
  { header: 'Genre', cell: (book) => book.genre },
  { header: 'Available', cell: (book) => <span className={book.availableCopies === 0 ? 'unavailable' : ''}>{book.availableCopies}</span> },
  { header: 'Total', cell: (book) => book.totalCopies }
];
const memberColumns: Column<Member>[] = [
  { header: 'Member', cell: (member) => <><strong>{member.name}</strong><small>{member.email}</small></> },
  { header: 'Membership ID', cell: (member) => member.membershipId },
  { header: 'History', cell: (member) => <Link to={`/members/${member._id}/history`}>View history</Link> }
];

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]); const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState(''); const [genre, setGenre] = useState(''); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const loadBooks = async () => { setLoading(true); setError(''); try { const { data } = await api.getBooks({ page, limit: 10, search: search.trim() || undefined, genre: genre || undefined }); setBooks(data.data); setTotalPages(Math.max(data.pagination.totalPages, 1)); } catch (err: unknown) { setError(getApiErrorMessage(err, 'Could not load books.')); } finally { setLoading(false); } };
  useEffect(() => { const timer = window.setTimeout(() => { void loadBooks(); }, 250); return () => window.clearTimeout(timer); }, [page, search, genre]);
  useEffect(() => { api.getMembers().then(({ data }) => setMembers(data.data)).catch(() => setMembers([])); }, []);
  const changeSearch = (value: string) => { setSearch(value); setPage(1); };
  const changeGenre = (value: string) => { setGenre(value); setPage(1); };
  return <>
    <section className="page-title"><div><h1>Library catalogue</h1><p>Search availability and manage circulation.</p></div><Link className="button" to="/issue">Issue a Book</Link></section>
    <section className="toolbar"><input aria-label="Search books by title" placeholder="Search books by title..." value={search} onChange={(event) => changeSearch(event.target.value)} /><select aria-label="Filter by genre" value={genre} onChange={(event) => changeGenre(event.target.value)}><option value="">All Genres</option>{GENRES.map((item) => <option key={item} value={item}>{item}</option>)}</select></section>
    {error ? <div className="notice error">{error}<button className="retry" onClick={() => void loadBooks()}>Retry</button></div> : loading ? <p className="loading">Loading books...</p> : <DataTable<Book> columns={bookColumns} rows={books} emptyMessage="No books found." />}
    <div className="pagination"><button disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)}>Next</button></div>
    <section className="members"><h2>Members</h2><p className="section-copy">Select a member to view their borrowing history.</p><DataTable<Member> columns={memberColumns} rows={members} emptyMessage="No registered members." /></section>
  </>;
}
