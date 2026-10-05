import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Users,
  ArrowUpRight,
  BookPlus,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/api/client';
import type { Book, Member } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/StatusBadge';

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, membersRes] = await Promise.all([
        api.getBooks({ page: 1, limit: 100 }),
        api.getMembers(),
      ]);
      setBooks(booksRes.data.data);
      setTotalBooksCount(booksRes.data.pagination.total);
      setMembers(membersRes.data.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Compute derived circulation stats from real data
  const totalAvailableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const totalPhysicalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const totalBorrowedCopies = Math.max(0, totalPhysicalCopies - totalAvailableCopies);
  const membersCount = members.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="System overview, live inventory metrics, and circulation quick actions."
        actions={
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        }
      />

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Book Titles */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Titles
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {totalBooksCount.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Active catalogue entries
            </p>
          </CardContent>
        </Card>

        {/* Available Copies */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available Copies
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-emerald-400">
                {totalAvailableCopies.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Ready for immediate loan
            </p>
          </CardContent>
        </Card>

        {/* Currently Borrowed */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Borrowed Copies
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-sky-400">
                {totalBorrowedCopies.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              In active member circulation
            </p>
          </CardContent>
        </Card>

        {/* Total Members */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Members
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {membersCount.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Registered patrons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Quick Actions & Recent Volumes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (1 col) */}
        <Card className="border-border/70 bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Circulation Actions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Frequently accessed library workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-between h-11" variant="default">
              <Link to="/issue">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4" />
                  Issue a Book to Member
                </span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </Button>

            <Button asChild className="w-full justify-between h-11" variant="outline">
              <Link to="/books">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <BookPlus className="h-4 w-4" />
                  Manage Books & Catalogue
                </span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </Button>

            <Button asChild className="w-full justify-between h-11" variant="outline">
              <Link to="/members">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  View Registered Members
                </span>
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recently Added / Popular Titles (2 cols) */}
        <Card className="lg:col-span-2 border-border/70 bg-card/70 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Catalogue Highlights
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Overview of current collection volumes
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link to="/books">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : books.length > 0 ? (
              <div className="divide-y divide-border/50">
                {books.slice(0, 5).map((book) => (
                  <div key={book._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author} · {book.genre}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground font-mono">
                        {book.availableCopies} / {book.totalCopies} avail
                      </span>
                      <StatusBadge
                        status={
                          book.availableCopies === 0
                            ? 'out_of_stock'
                            : book.availableCopies === 1
                            ? 'low_stock'
                            : 'available'
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No catalogue data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
