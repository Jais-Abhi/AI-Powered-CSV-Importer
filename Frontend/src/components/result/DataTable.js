'use client';

import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DEFAULT_COLUMN_WIDTH = 220;
const MIN_COLUMN_WIDTH = 140;
const MAX_COLUMN_WIDTH = 560;
const EXPANDED_COLUMN_WIDTH = 420;

function getDisplayValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return String(value);
}

export function DataTable({ rows, showReasonColumn }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnSizing, setColumnSizing] = useState({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const baseHeaders = useMemo(() => Object.keys(rows[0] || {}), [rows]);

  const columns = useMemo(() => {
    const generatedColumns = [];

    if (showReasonColumn) {
      generatedColumns.push({
        id: 'reason',
        header: 'Reason',
        accessorKey: 'reason',
        size: DEFAULT_COLUMN_WIDTH,
        minSize: MIN_COLUMN_WIDTH,
        maxSize: MAX_COLUMN_WIDTH,
        cell: ({ getValue }) => {
          const value = getDisplayValue(getValue());
          return <div className="min-w-0 whitespace-normal break-words break-all">{value || '-'}</div>;
        },
      });
    }

    baseHeaders.forEach((key) => {
      if (showReasonColumn && key === 'reason') return;

      generatedColumns.push({
        id: key,
        header: key,
        accessorKey: key,
        size: DEFAULT_COLUMN_WIDTH,
        minSize: MIN_COLUMN_WIDTH,
        maxSize: MAX_COLUMN_WIDTH,
        cell: ({ getValue }) => {
          const value = getDisplayValue(getValue());
          return <div className="min-w-0 whitespace-normal break-words break-all">{value}</div>;
        },
      });
    });

    return generatedColumns;
  }, [baseHeaders, showReasonColumn]);

  const tableData = useMemo(() => rows, [rows]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      columnSizing,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: MIN_COLUMN_WIDTH,
      maxSize: MAX_COLUMN_WIDTH,
      size: DEFAULT_COLUMN_WIDTH,
    },
  });

  const hasRows = tableData.length > 0;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-background/95 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder="Search all columns"
            className="w-full rounded-lg border border-border/80 bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none ring-0 transition focus:border-foreground/40"
          />
        </div>

        <div className="relative flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowColumnMenu((value) => !value)}>
            Columns
          </Button>
          {showColumnMenu ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-border/70 bg-background p-2 shadow-lg">
              {table.getAllLeafColumns().map((column) => (
                <label key={column.id} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted/60">
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="size-4 rounded border-border text-foreground"
                  />
                  <span>{column.columnDef.header}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <Table className="w-full table-fixed border-collapse text-sm">
            <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border/70">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="relative border-b border-border/80 bg-background/95 px-3 py-3 text-left font-semibold text-foreground after:absolute after:top-0 after:right-0 after:h-full after:w-[3px] after:bg-foreground/25 dark:after:bg-foreground/45"
                      style={{ width: header.getSize() }}
                    >
                      <div
                        className="flex items-center gap-1.5"
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() ? (
                          <span className="text-muted-foreground">
                            {header.column.getIsSorted() === 'asc' ? <ArrowUp className="size-4" /> : null}
                            {header.column.getIsSorted() === 'desc' ? <ArrowDown className="size-4" /> : null}
                            {!header.column.getIsSorted() ? <ArrowUpDown className="size-4" /> : null}
                          </span>
                        ) : null}
                      </div>

                      {header.column.getCanResize() ? (
                        <div
                          role="separator"
                          aria-orientation="vertical"
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none select-none"
                        />
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-border/60 bg-background hover:bg-muted/40">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border-r border-border/60 border-b border-border/60 px-3 py-3 align-top text-foreground">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground">
                    No records to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 bg-background/95 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount || 1}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="mr-2 size-4" />
            First
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="mr-2 size-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
            <ChevronRight className="ml-2 size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
            Last
            <ChevronsRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
