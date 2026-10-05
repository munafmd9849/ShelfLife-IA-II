import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T extends { _id: string }> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends { _id: string }>({
  columns,
  rows,
  emptyMessage = 'No records found.',
  className,
}: DataTableProps<T>) {
  return (
    <div className={`rounded-xl border border-border bg-card/60 backdrop-blur shadow-sm overflow-hidden ${className || ''}`}>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent border-border">
            {columns.map((column) => (
              <TableHead
                key={column.header}
                className={`font-semibold text-xs uppercase tracking-wider text-muted-foreground ${column.className || ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row._id}
                className="border-border hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell key={column.header} className={`py-3.5 ${column.className || ''}`}>
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent border-none">
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
