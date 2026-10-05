export type BorrowStatus = 'issued' | 'returned' | 'overdue';
export type ObjectId = string;

export interface Book { _id: ObjectId; title: string; author: string; isbn: string; genre: string; totalCopies: number; availableCopies: number; }
export interface Member { _id: ObjectId; name: string; email: string; membershipId: string; joinedDate: string; }
export type BookReference = Book | ObjectId;
export type MemberReference = Member | ObjectId;
export interface BorrowRecord { _id: ObjectId; book: BookReference; member: MemberReference; issueDate: string; dueDate: string; returnDate: string | null; status: BorrowStatus; }
export interface ApiResponse<T> { success: boolean; data: T; message?: string; }
export interface Pagination { page: number; limit: number; total: number; totalPages: number; }
export interface PaginatedResponse<T> extends ApiResponse<T[]> { pagination: Pagination; }
export interface LoginResponse { success: boolean; token: string; user: { email: string; role: string }; }
export interface MemberHistoryResponse { member: Member; history: BorrowRecord[]; }
