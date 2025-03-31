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
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    }

export function DataTable<TData extends { applicationNumber: string; id: number; status: string; createdDate: string }, TValue>({
    columns,
    data,
    }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
    data,
    columns,
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

    const router = useRouter();

    const totalPages =
    table.getCoreRowModel()?.rows?.length && table.getState()?.pagination?.pageSize
        ? Math.ceil(table.getCoreRowModel().rows.length / table.getState().pagination.pageSize)
        : 0;

    return (
    <div>
        <div className="flex items-center py-4">
        <Input
            placeholder="Search By Application Number"
            value={(table.getColumn("applicationNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
            table.getColumn("applicationNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-[250px]"
        />
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                    onClick={() => {
                    router.push(`tested-application-details?applicationNumber=${row.original.applicationNumber}&id=${row.original.id}`);
                    }}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4 mr-5">
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
