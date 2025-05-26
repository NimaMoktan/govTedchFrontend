"use client";
import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Noticeboard } from "./page";

interface DataTableProps {
  columns: any[];
  data: Noticeboard[];
  handleAdd: () => void;
}

export function DataTable({ columns, data, handleAdd }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<
    string[]
  >([]);

  // Extract unique categories and sub-categories
  useEffect(() => {
    if (data.length > 0) {
      const categories = Array.from(
        new Set(data.map((noticeboard) => noticeboard.category)),
      );
      setAvailableCategories(categories);

      if (selectedCategory) {
        const subs = Array.from(
          new Set(
            data
              .filter(
                (noticeboard) => noticeboard.category === selectedCategory,
              )
              .map((noticeboard) => noticeboard.subCategory),
          ),
        );
        setAvailableSubCategories(subs);
      } else {
        setAvailableSubCategories([]);
      }
    }
  }, [data, selectedCategory]);

  // Filter data based on search criteria
  const filteredData = React.useMemo(() => {
    let results = data;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      results = results.filter(
        (noticeboard) =>
          noticeboard.question.toLowerCase().includes(searchLower) ||
          noticeboard.answer.toLowerCase().includes(searchLower) ||
          noticeboard.code.toLowerCase().includes(searchLower),
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (noticeboard) => noticeboard.category === selectedCategory,
      );
    }

    if (selectedSubCategory) {
      results = results.filter(
        (noticeboard) => noticeboard.subCategory === selectedSubCategory,
      );
    }

    return results;
  }, [data, searchText, selectedCategory, selectedSubCategory]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
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
  return (
    <div>
      {/* Search and Filter Section */}
      <div>
        <div className="flex items-center py-4">
          <Input
            type="text"
            id="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search questions or answers..."
            className="max-w-[250px]"
          />

          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
            className="ml-6 flex h-9 w-full max-w-[250px] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
          >
            <option value="">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {selectedCategory && (
            <select
              id="subCategory"
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="ml-6 flex h-9 w-full max-w-[250px] rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm "
            >
              <option value="">All Sub-Categories</option>
              {availableSubCategories.map((subCategory) => (
                <option key={subCategory} value={subCategory}>
                  {subCategory}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleAdd}
            className="btn-sm right-10 ml-10 gap-2 rounded-lg bg-red-700 px-5 py-2 text-white"
          >
            Add New
          </button>
        </div>
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
      </div>
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
  );
}
