"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiUserPlus } from "react-icons/bi";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleAdd: () => void;
}

// Component to handle text truncation and read more functionality
const TruncatedText = ({
  text,
  maxWords = 10,
  isRowExpanded = false,
}: {
  text: string;
  maxWords?: number;
  isRowExpanded?: boolean;
}) => {
  const [isButtonExpanded, setIsButtonExpanded] = React.useState(false);
  const words = text.split(" ");
  const shouldTruncate = words.length > maxWords;
  const truncatedText = shouldTruncate
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;

  // Display full text if either the row is expanded or the button is clicked
  const isExpanded = isRowExpanded || isButtonExpanded;

  return (
    <div>
      {isExpanded ? text : truncatedText}
      {shouldTruncate && (
        <button
          onClick={() => setIsButtonExpanded(!isButtonExpanded)}
          className="ml-1 text-blue-500 hover:underline"
        >
          {isButtonExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export function DataTable<TData, TValue>({
  columns,
  data,
  handleAdd,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [expandedRows, setExpandedRows] = React.useState<{
    [key: string]: boolean;
  }>({});

  // Modify columns to use TruncatedText for text content
  const modifiedColumns = React.useMemo(() => {
    return columns.map((column) => {
      const columnId = (column as { id?: string }).id;
      if (columnId === "answer" || columnId === "question") {
        return {
          ...column,
          cell: ({
            row,
          }: {
            row: import("@tanstack/react-table").Row<TData>;
          }) => {
            const value = row.getValue(columnId as string);
            return (
              <TruncatedText
                text={String(value)}
                isRowExpanded={expandedRows[row.id] || false}
              />
            );
          },
        };
      }
      return column;
    });
  }, [columns, expandedRows]);

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const totalPages =
    table.getCoreRowModel()?.rows?.length &&
    table.getState()?.pagination?.pageSize
      ? Math.ceil(
          table.getCoreRowModel().rows.length /
            table.getState().pagination.pageSize,
        )
      : 0;

  // Toggle expansion state for a row
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by question"
          value={
            (table.getColumn("question")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("question")?.setFilterValue(event.target.value)
          }
          className="max-w-[250px]"
        />

        <Link href="/faq-management/create">
          <Button className="btn-sm right-10 ml-10 gap-2 rounded-full bg-red-700 px-4 py-2">
            <BiUserPlus size={20} />
            Add New
          </Button>
        </Link>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer transition-all duration-100 hover:scale-[1.01] hover:bg-gray-100 hover:shadow-md"
                  onClick={() => toggleRowExpansion(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mr-5 flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
