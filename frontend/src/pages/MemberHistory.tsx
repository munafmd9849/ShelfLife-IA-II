import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, getApiErrorMessage } from '../api/client';
import DataTable, { type Column } from '../components/DataTable';
import type { Book, BorrowRecord, BorrowStatus, Member } from '../types';

const formatDate = (value?: string | null) => value ? new Date(value).toLocaleDateString() : '—';
const isBook = (book: BorrowRecord['book']): book is Book => typeof book !== 'string';
export const isOverdue = (record: BorrowRecord) => !record.returnDate && new Date(record.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);
const displayStatus = (record: BorrowRecord): BorrowStatus => isOverdue(record) ? 'overdue' : record.status;
const columns: Column<BorrowRecord>[] = [
  { header: 'Book', cell: (record) => isBook(record.book) ? <><strong>{record.book.title}</strong><small>{record.book.author}</small></> : 'Unavailable book details' },
  { header: 'Issued', cell: (record) => formatDate(record.issueDate) },
  { header: 'Due', cell: (record) => formatDate(record.dueDate) },
  { header: 'Returned', cell: (record) => formatDate(record.returnDate) },
  { header: 'Status', cell: (record) => { const status = displayStatus(record); return <span className={`status ${status}`}>{status.toUpperCase()}</span>; } }
];

export default function MemberHistory() {
  const { id } = useParams(); const [member, setMember] = useState<Member>(); const [history, setHistory] = useState<BorrowRecord[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const loadHistory = async () => { if (!id) { setError('Member ID is missing.'); setLoading(false); return; } setLoading(true); setError(''); try { const { data } = await api.getMemberHistory(id); setMember(data.data.member); setHistory(data.data.history); } catch (err: unknown) { setError(getApiErrorMessage(err, 'Could not load member history.')); } finally { setLoading(false); } };
  useEffect(() => { void loadHistory(); }, [id]);
  if (loading) return <p className="loading">Loading member history...</p>;
  if (error) return <div className="notice error">{error}<button className="retry" onClick={() => void loadHistory()}>Retry</button></div>;
  if (!member) return null;
  return <><Link to="/books">← Back to Books</Link><section className="page-title"><div><h1>{member.name}</h1><p>{member.membershipId} · {member.email}</p></div></section><DataTable<BorrowRecord> columns={columns} rows={history} emptyMessage="No borrowing history for this member." /></>;
}
