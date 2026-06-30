import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import moment from 'moment';
import { ArrowUpDown, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CallDetailSheet } from './CallDetailSheet';
import { cn } from '@/lib/utils';

const INTENT_CLASS = {
  order: 'bg-green-50 text-green-700 border-green-200',
  reservation: 'bg-blue-50 text-blue-700 border-blue-200',
  inquiry: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  unknown: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function CallsDataTable({ calls, loading }) {
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'caller',
      header: 'Caller',
      accessorFn: (row) => row.call?.callId ?? '',
      cell: ({ row }) => (
        <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
          {row.original.call?.callId ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'intent',
      header: 'Intent',
      accessorFn: (row) => row.analysis?.intent ?? 'unknown',
      cell: ({ row }) => {
        const intent = row.original.analysis?.intent || 'unknown';
        return (
          <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize', INTENT_CLASS[intent] ?? INTENT_CLASS.unknown)}>
            {intent}
          </span>
        );
      },
    },
    {
      accessorKey: 'duration',
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-medium cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Duration <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.call?.durationMinutes ?? 0,
      cell: ({ row }) => {
        const d = row.original.call?.durationMinutes;
        return <span className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>{d ? `${d.toFixed(1)} min` : '—'}</span>;
      },
    },
    {
      accessorKey: 'outcome',
      header: 'Outcome',
      accessorFn: (row) => (row.analysis?.success ? 'success' : 'failed'),
      cell: ({ row }) => {
        const ok = row.original.analysis?.success;
        return (
          <Badge variant="outline" className={cn('text-[11px]', ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700')}>
            {ok ? 'Success' : 'Failed'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'cost',
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-medium cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Cost <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.cost ?? 0,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          ${(row.original.cost ?? 0).toFixed(3)}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button variant="ghost" className="px-0 font-medium cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          When <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => row.createdAt ?? '',
      cell: ({ row }) => (
        <span className="text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          {row.original.createdAt ? moment(row.original.createdAt).fromNow() : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const call = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif' }}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(call.customer?.phone ?? ''); }}>
                Copy phone number
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelected(call); }}>
                View call details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: calls,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="px-4 lg:px-6">
      {/* Toolbar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by caller…"
          value={table.getColumn('caller')?.getFilterValue() ?? ''}
          onChange={(e) => table.getColumn('caller')?.setFilterValue(e.target.value)}
          className="max-w-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ fontFamily: 'Inter, sans-serif' }}>
            {table.getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize cursor-pointer"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}>
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent border-border">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="py-3">
                      <div className="skeleton-shimmer rounded h-3 w-16" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-border cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setSelected(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      <CallDetailSheet call={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
