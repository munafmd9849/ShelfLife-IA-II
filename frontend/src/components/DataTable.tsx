import type { ReactNode } from 'react';

export interface Column<T> { header: string; cell: (row: T) => ReactNode; }
export default function DataTable<T extends { _id: string }>({ columns, rows, emptyMessage = 'No records found.' }: { columns: Column<T>[]; rows: T[]; emptyMessage?: string }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.header}>{column.header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row) => <tr key={row._id}>{columns.map((column) => <td key={column.header}>{column.cell(row)}</td>)}</tr>) : <tr><td colSpan={columns.length} className="empty">{emptyMessage}</td></tr>}</tbody></table></div>;
}
