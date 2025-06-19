"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
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
import Input from "@/components/Inputs/Input";
import { useRouter } from "next/navigation";
import { BiUserPlus } from "react-icons/bi";
import { debounce } from "lodash";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "@/components/Inputs/DatePicker";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  catType: string;
  totalCount: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setOrdering: (ordering: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  catType,
  totalCount,
  page,
  pageSize,
  setPage,
  setSearch,
  setOrdering,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      setSorting(updater);
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const sortField = newSorting[0]?.id;
      const sortOrder = newSorting[0]?.desc ? `-${sortField}` : sortField;
      setOrdering(sortOrder || "");
    },
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize },
    },
    pageCount: Math.ceil(totalCount / pageSize),
  });

  const debouncedSetSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearch(event.target.value);
  };

  return (
    <>
      <div className="div">
        <Button
          onClick={() => router.push(`/query-management/${catType}/create`)}
          className="ml-auto gap-2 rounded-full bg-red-700 px-4 py-2 hover:bg-red-800"
        >
          <BiUserPlus size={20} />
          Add New
        </Button>
      </div>
      <div className="flex flex-col gap-2 ">
        <div className="w-full xl:w-1/2">
          <Input
            name="phone_number"
            label="Phone Number"
            placeholder="Enter your phone number here...."
            // disabled={type.toUpperCase() === "EMAIL"}
          />
        </div>
        <div className="w-full xl:w-1/2">
          <DatePicker
            name="date"
            label="Date"
            mode="single"
            dateFormat="d F Y"
          />
        </div>
        <Card className="w-full p-6">
          <div className="flex items-center gap-4 py-4">
            <Input
              placeholder="Search by Phone Number or Email"
              onChange={handleSearch}
              className="max-w-[250px]"
              name="phone_number"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="p-2 text-center text-sm"
                        >
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
            <div className="flex items-center justify-end space-x-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {Math.ceil(totalCount / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(totalCount / pageSize)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
