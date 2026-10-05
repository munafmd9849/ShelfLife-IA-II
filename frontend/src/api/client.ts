import axios from 'axios';
import type { ApiResponse, Book, BorrowRecord, Member } from '../types';

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
client.interceptors.request.use((config) => { const token = localStorage.getItem('shelflife_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

export const api = {
  login: (email: string, password: string) => client.post<{ token: string }>('/auth/login', { email, password }),
  getBooks: (params: { page: number; limit: number; search?: string; genre?: string }) => client.get<ApiResponse<Book[]> & { pagination: { page: number; totalPages: number; total: number } }>('/books', { params }),
  getMembers: () => client.get<ApiResponse<Member[]>>('/members'),
  issueBook: (bookId: string, memberId: string, dueDate?: string) => client.post<ApiResponse<BorrowRecord>>('/borrow', { bookId, memberId, dueDate }),
  getMemberHistory: (id: string) => client.get<ApiResponse<{ member: Member; history: BorrowRecord[] }>>(`/members/${id}/history`)
};
