import { type FormEvent, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  BookOpen,
  User,
  ArrowRight,
} from 'lucide-react';
import { api, getApiErrorMessage } from '@/api/client';
import type { Book, Member } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function IssueBook() {
  const [searchParams] = useSearchParams();
  const initialBookId = searchParams.get('bookId') || '';
  const initialMemberId = searchParams.get('memberId') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookId, setBookId] = useState(initialBookId);
  const [memberId, setMemberId] = useState(initialMemberId);
  const [dueDate, setDueDate] = useState('');

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadOptions = async () => {
    setLoadingOptions(true);
    setError('');
    try {
      const [booksResponse, membersResponse] = await Promise.all([
        api.getBooks({ page: 1, limit: 100 }),
        api.getMembers(),
      ]);
      setBooks(booksResponse.data.data);
      setMembers(membersResponse.data.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not load library books and members.'));
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    void loadOptions();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bookId || !memberId) {
      setError('Please select both a registered member and an available book.');
      return;
    }

    setSubmitting(true);
    setError('');
    setFeedback('');

    try {
      await api.issueBook(bookId, memberId, dueDate || undefined);
      setFeedback('Book issued successfully. Circulation record recorded.');
      setBookId('');
      setMemberId('');
      setDueDate('');
      await loadOptions();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not issue the book.'));
    } finally {
      setSubmitting(false);
    }
  }

  // Filter books to only available copies
  const availableBooks = books.filter((b) => b.availableCopies > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Issue a Book"
        description="Assign available catalogue volumes to registered students or faculty members."
      />

      <div className="max-w-2xl mx-auto">
        <Card className="border-border/80 bg-card/70 backdrop-blur shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <ArrowUpRight className="h-4 w-4" />
              <span>Circulation Desk</span>
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
              Loan Assignment Form
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Select a member, an in-stock book, and an optional custom due date.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {feedback && (
              <Alert variant="success" className="mb-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle className="font-semibold text-sm">Issue Succeeded</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                  {feedback}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold text-sm">Operation Failed</AlertTitle>
                <AlertDescription className="text-xs mt-1 flex items-center justify-between">
                  <span>{error}</span>
                  {!submitting && books.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void loadOptions()}
                      className="h-7 text-xs bg-background/50"
                    >
                      Retry
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {loadingOptions ? (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                {/* Member Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Select Member *</span>
                  </Label>
                  <Select
                    value={memberId}
                    onValueChange={setMemberId}
                    disabled={submitting}
                  >
                    <SelectTrigger className="h-11 bg-card/60">
                      <SelectValue placeholder="Choose a registered member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member._id} value={member._id}>
                          {member.name} ({member.membershipId}) · {member.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Available Book Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Select Available Book *</span>
                  </Label>
                  <Select
                    value={bookId}
                    onValueChange={setBookId}
                    disabled={submitting}
                  >
                    <SelectTrigger className="h-11 bg-card/60">
                      <SelectValue placeholder="Choose an in-stock book..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBooks.length > 0 ? (
                        availableBooks.map((book) => (
                          <SelectItem key={book._id} value={book._id}>
                            {book.title} — {book.availableCopies} available ({book.author})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No available books in catalogue
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Only titles with <code className="text-foreground font-semibold">availableCopies &gt; 0</code> are listed.
                  </p>
                </div>

                {/* Due Date Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Due Date</span>
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      Defaults to 14 days from today
                    </span>
                  </div>
                  <Input
                    type="date"
                    value={dueDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDueDate(e.target.value)}
                    disabled={submitting}
                    className="h-11 bg-card/60 text-sm"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitting || !bookId || !memberId}
                    className="w-full h-11 text-sm font-semibold gap-2 shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Issuing Book to Member...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Issue Book</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
