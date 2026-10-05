import React, { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  RefreshCw,
  BookOpen,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  Filter,
} from 'lucide-react';
import { api, getApiErrorMessage } from '@/api/client';
import DataTable, { type Column } from '@/components/DataTable';
import type { Book } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

const GENRES = [
  'Fiction',
  'Non-fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'History',
  'Biography',
  'Science',
  'Technology',
  'Romance',
  'Poetry',
];

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Book Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('');
  const [newGenre, setNewGenre] = useState('Technology');
  const [newTotalCopies, setNewTotalCopies] = useState(3);
  const [newAvailableCopies, setNewAvailableCopies] = useState(3);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.getBooks({
        page,
        limit: 10,
        search: search.trim() || undefined,
        genre: genre && genre !== 'ALL' ? genre : undefined,
      });
      setBooks(data.data);
      setTotalPages(Math.max(data.pagination.totalPages, 1));
      setTotalBooks(data.pagination.total);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to fetch catalogue from server.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadBooks();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [page, search, genre]);

  const handleAddBook = async (e: FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    const total = Number(newTotalCopies);
    const available = Number(newAvailableCopies);

    if (available > total) {
      setCreateError('Available copies cannot exceed total copies.');
      setCreateLoading(false);
      return;
    }

    try {
      await api.createBook({
        title: newTitle.trim(),
        author: newAuthor.trim(),
        isbn: newIsbn.trim(),
        genre: newGenre,
        totalCopies: total,
        availableCopies: available,
      });

      // Reset form & close dialog
      setNewTitle('');
      setNewAuthor('');
      setNewIsbn('');
      setNewTotalCopies(3);
      setNewAvailableCopies(3);
      setDialogOpen(false);
      await loadBooks();
    } catch (err: unknown) {
      setCreateError(
        getApiErrorMessage(
          err,
          'Could not add book. Please verify unique ISBN or server connectivity.'
        )
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Generic DataTable columns definition
  const bookColumns: Column<Book>[] = [
    {
      header: 'Book & ISBN',
      className: 'w-[40%]',
      cell: (book) => (
        <div className="space-y-1">
          <p className="font-semibold text-sm text-foreground leading-tight hover:text-primary transition-colors">
            {book.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{book.author}</span>
            <span>•</span>
            <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded">
              ISBN: {book.isbn}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Genre',
      cell: (book) => (
        <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-1 text-xs font-medium text-secondary-foreground border border-border/50">
          {book.genre}
        </span>
      ),
    },
    {
      header: 'Availability',
      cell: (book) => (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">
            <span className="font-bold text-sm text-foreground">
              {book.availableCopies}
            </span>{' '}
            <span className="text-muted-foreground">of {book.totalCopies} copies</span>
          </p>
          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                book.availableCopies === 0
                  ? 'bg-red-500 w-full'
                  : book.availableCopies === 1
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width:
                  book.totalCopies > 0
                    ? `${(book.availableCopies / book.totalCopies) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (book) => (
        <StatusBadge
          status={
            book.availableCopies === 0
              ? 'out_of_stock'
              : book.availableCopies === 1
              ? 'low_stock'
              : 'available'
          }
        />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (book) => (
        <div className="flex items-center justify-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={book.availableCopies === 0}
            className="h-8 gap-1.5 text-xs hover:border-primary/50"
          >
            <Link to={`/issue?bookId=${book._id}`}>
              <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
              <span>Issue</span>
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with Add Book Dialog */}
      <PageHeader
        title="Books Catalogue"
        description="Search availability, filter collection volumes, and manage library inventory."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadBooks()}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/* Add Book Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 shadow-xs">
                  <Plus className="h-4 w-4" />
                  <span>Add Book</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleAddBook}>
                  <DialogHeader>
                    <DialogTitle>Add New Catalogue Title</DialogTitle>
                    <DialogDescription>
                      Register a new book into the library management system.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {createError && (
                      <Alert variant="destructive" className="py-2.5">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {createError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-xs font-semibold">
                        Book Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. Clean Architecture"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        disabled={createLoading}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="author" className="text-xs font-semibold">
                        Author *
                      </Label>
                      <Input
                        id="author"
                        placeholder="e.g. Robert C. Martin"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        required
                        disabled={createLoading}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="isbn" className="text-xs font-semibold">
                          ISBN (Unique) *
                        </Label>
                        <Input
                          id="isbn"
                          placeholder="978-..."
                          value={newIsbn}
                          onChange={(e) => setNewIsbn(e.target.value)}
                          required
                          disabled={createLoading}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="genre" className="text-xs font-semibold">
                          Genre *
                        </Label>
                        <Select
                          value={newGenre}
                          onValueChange={setNewGenre}
                          disabled={createLoading}
                        >
                          <SelectTrigger id="genre">
                            <SelectValue placeholder="Genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENRES.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="totalCopies" className="text-xs font-semibold">
                          Total Copies *
                        </Label>
                        <Input
                          id="totalCopies"
                          type="number"
                          min="1"
                          value={newTotalCopies}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setNewTotalCopies(val);
                            if (newAvailableCopies > val) setNewAvailableCopies(val);
                          }}
                          required
                          disabled={createLoading}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="availableCopies" className="text-xs font-semibold">
                          Available Copies *
                        </Label>
                        <Input
                          id="availableCopies"
                          type="number"
                          min="0"
                          max={newTotalCopies}
                          value={newAvailableCopies}
                          onChange={(e) =>
                            setNewAvailableCopies(parseInt(e.target.value, 10) || 0)
                          }
                          required
                          disabled={createLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={createLoading}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLoading} className="gap-2">
                      {createLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Add to Catalogue</span>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 bg-card/60"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
            <Select
              value={genre}
              onValueChange={(val) => {
                setGenre(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] h-10 bg-card/60">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Genres</SelectItem>
                {GENRES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      {error ? (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Server Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-1">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadBooks()}
              className="h-7 text-xs bg-background/50"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : loading ? (
        <LoadingSkeleton rows={5} columns={5} />
      ) : books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Books Found"
          description={
            search || genre
              ? "No titles match your current search or genre filter. Try adjusting your parameters."
              : "Your library catalogue is empty. Add a new book title to get started."
          }
          actionLabel={search || genre ? "Clear Filters" : "Add Book"}
          onAction={() => {
            if (search || genre) {
              setSearch('');
              setGenre('');
              setPage(1);
            } else {
              setDialogOpen(true);
            }
          }}
        />
      ) : (
        <DataTable<Book>
          columns={bookColumns}
          rows={books}
          emptyMessage="No books found."
        />
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{books.length}</span> of{' '}
          <span className="font-medium text-foreground">{totalBooks}</span> total titles
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="h-8 px-3 text-xs"
          >
            Previous
          </Button>
          <span className="text-xs font-medium text-muted-foreground px-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => current + 1)}
            className="h-8 px-3 text-xs"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
