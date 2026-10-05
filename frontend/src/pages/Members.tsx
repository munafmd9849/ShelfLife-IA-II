import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, History, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { api, getApiErrorMessage } from '@/api/client';
import DataTable, { type Column } from '@/components/DataTable';
import type { Member } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.getMembers();
      setMembers(data.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load member records.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMembers();
  }, []);

  const memberColumns: Column<Member>[] = [
    {
      header: 'Member',
      className: 'w-[35%]',
      cell: (member) => {
        const initials = member.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'M';
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-1 ring-border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-semibold text-sm text-foreground leading-tight">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Membership ID',
      cell: (member) => (
        <span className="font-mono text-xs bg-muted/60 px-2 py-1 rounded border border-border/50 text-foreground font-medium">
          {member.membershipId}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      cell: (member) => (
        <span className="text-xs text-muted-foreground">
          {member.joinedDate ? new Date(member.joinedDate).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (member) => (
        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Link to={`/members/${member._id}/history`}>
              <History className="h-3.5 w-3.5 text-primary" />
              <span>Borrow History</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <Link to={`/issue?memberId=${member._id}`}>
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Issue</span>
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members Directory"
        description="Registered library patrons, membership statuses, and circulation history."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadMembers}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Server Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between mt-1">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadMembers}
              className="h-7 text-xs bg-background/50"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : loading ? (
        <LoadingSkeleton rows={5} columns={4} />
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Registered Members"
          description="There are currently no registered library patrons in the system."
        />
      ) : (
        <DataTable<Member>
          columns={memberColumns}
          rows={members}
          emptyMessage="No registered members found."
        />
      )}
    </div>
  );
}
