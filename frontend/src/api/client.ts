import axios from 'axios';
import type { ApiResponse, Book, BorrowRecord, LoginResponse, Member, MemberHistoryResponse, PaginatedResponse } from '../types';

export const TOKEN_KEY = 'shelflife_token';
const configuredUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const baseURL = configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl}/api`;
const client = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || fallback
    : fallback;
}

export const api = {
  login: (email: string, password: string) => client.post<LoginResponse>('/auth/login', { email, password }),
  getBooks: (params: { page: number; limit: number; search?: string; genre?: string }) =>
    client.get<PaginatedResponse<Book>>('/books', { params }),
  createBook: (book: { title: string; author: string; isbn: string; genre: string; totalCopies: number; availableCopies: number }) =>
    client.post<ApiResponse<Book>>('/books', book),
  getMembers: () => client.get<ApiResponse<Member[]>>('/members'),
  issueBook: (bookId: string, memberId: string, dueDate?: string) =>
    client.post<ApiResponse<BorrowRecord>>('/borrow', { bookId, memberId, dueDate }),
  returnBook: (borrowId: string) => client.post<ApiResponse<BorrowRecord>>(`/return/${borrowId}`),
  getMemberHistory: (id: string) => client.get<ApiResponse<MemberHistoryResponse>>(`/members/${id}/history`)
};
