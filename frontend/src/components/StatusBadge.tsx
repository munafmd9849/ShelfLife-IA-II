import { Badge } from '@/components/ui/badge';
import type { BorrowStatus } from '@/types';

interface StatusBadgeProps {
  status: BorrowStatus | 'available' | 'low_stock' | 'out_of_stock';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case 'available':
      return (
        <Badge variant="success" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
          AVAILABLE
        </Badge>
      );
    case 'low_stock':
      return (
        <Badge variant="warning" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5" />
          LOW STOCK
        </Badge>
      );
    case 'out_of_stock':
      return (
        <Badge variant="destructive" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 mr-1.5" />
          OUT OF STOCK
        </Badge>
      );
    case 'returned':
      return (
        <Badge variant="success" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
          RETURNED
        </Badge>
      );
    case 'overdue':
      return (
        <Badge variant="destructive" className={`font-bold animate-pulse ${className || ''}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 mr-1.5" />
          OVERDUE
        </Badge>
      );
    case 'issued':
    default:
      return (
        <Badge variant="info" className={className}>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 mr-1.5" />
          ISSUED
        </Badge>
      );
  }
}
