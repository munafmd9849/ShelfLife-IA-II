import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Mail,
  IdCard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { api, getApiErrorMessage } from '@/api/client';
import DataTable, { type Column } from '@/components/DataTable';
import type { Book, BorrowRecord, Member } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

const isBook = (book: BorrowRecord['book']): book is Book => typeof book !== 'string';

export const isOverdue = (record: BorrowRecord) =>
  !record.returnDate && new Date(record.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

export default function MemberHistory() {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member>();
  const [history, setHistory] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  // Return Book Dialog State
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
  const [returning, setReturning] = useState(false);

  const loadHistory = async () => {
    if (!id) {
      setError('Member ID is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.getMemberHistory(id);
      setMember(data.data.member);
      setHistory(data.data.history);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not load member borrowing history.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [id]);

  const initiateReturn = (record: BorrowRecord) => {
    setSelectedRecord(record);
    setReturnDialogOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedRecord) return;
    setReturning(true);
    setFeedback('');
    try {
      await api.returnBook(selectedRecord._id);
      setFeedback('Book marked as returned successfully. Inventory has been restored.');
      setReturnDialogOpen(false);
      setSelectedRecord(null);
      await loadHistory();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to return book.'));
    } finally {
      setReturning(false);
    }
  };

  // Reusable Generic DataTable Columns
  const columns: Column<BorrowRecord>[] = [
    {
      header: 'Book Details',
      className: 'w-[35%]',
      cell: (record) =>
        isBook(record.book) ? (
          <div className="space-y-0.5">
            <p className="font-semibold text-sm text-foreground leading-tight">
              {record.book.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {record.book.author} · <span className="font-mono text-[11px]">{record.book.isbn}</span>
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Book details unavailable
          </span>
        ),
    },
    {
      header: 'Issued Date',
      cell: (record) => (
        <span className="text-xs font-medium text-foreground">
          {formatDate(record.issueDate)}
        </span>
      ),
    },
    {
      header: 'Due Date',
      cell: (record) => {
        const overdue = isOverdue(record);
        return (
          <span
            className={`text-xs font-medium ${
              overdue ? 'text-red-400 font-semibold' : 'text-foreground'
            }`}
          >
            {formatDate(record.dueDate)}
          </span>
        );
      },
    },
    {
      header: 'Returned Date',
      cell: (record) => (
        <span className="text-xs text-muted-foreground font-mono">
          {formatDate(record.returnDate)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (record) => {
        const status = isOverdue(record) ? 'overdue' : record.status;
        return <StatusBadge status={status} />;
      },
    },
    {
      header: 'Action',
      className: 'text-right',
      cell: (record) =>
        record.status !== 'returned' && !record.returnDate ? (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => initiateReturn(record)}
              className="h-8 gap-1.5 text-xs hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
              <span>Return</span>
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic block text-right pr-4">
            Completed
          </span>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <LoadingSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (error && !member) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Member Profile</AlertTitle>
        <AlertDescription className="flex items-center justify-between mt-2">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => void loadHistory()}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!member) return null;

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'M';

  const selectedBookTitle =
    selectedRecord && isBook(selectedRecord.book)
      ? selectedRecord.book.title
      : 'this book';

  return (
    <div className="space-y-6">
      {/* Back button link */}
      <div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/members">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Members Directory</span>
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Member Borrowing History"
        description="Historical loan records, return status, and active overdue visual warnings."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        }
      />

      {feedback && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Success</AlertTitle>
          <AlertDescription className="text-xs">{feedback}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Action Failed</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {/* Member Details Info Card */}
      <Card className="border-border/80 bg-card/70 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/20 text-primary text-base font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {member.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span>{member.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <IdCard className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span>ID: {member.membershipId}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span>Member since {formatDate(member.joinedDate)}</span>
                  </span>
                </div>
              </div>
            </div>

            <Button asChild size="sm" className="gap-2">
              <Link to={`/issue?memberId=${member._id}`}>
                <span>Issue New Book</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Borrow History Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>Circulation History Records ({history.length})</span>
        </h3>

        {history.length === 0 ? (
          <EmptyState
            title="No Borrowing History"
            description="This member has not yet borrowed any books from the library."
          />
        ) : (
          <DataTable<BorrowRecord>
            columns={columns}
            rows={history}
            emptyMessage="No loan records found for this member."
          />
        )}
      </div>

      {/* Return Book Confirmation Dialog */}
      <ConfirmDialog
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        title="Confirm Book Return"
        description={`Are you sure you want to mark "${selectedBookTitle}" as returned? This will increment the library inventory and close the member's circulation record.`}
        confirmLabel="Confirm Return"
        cancelLabel="Cancel"
        variant="success"
        loading={returning}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
}
