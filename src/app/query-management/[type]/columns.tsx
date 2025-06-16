"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsEye } from "react-icons/bs";
import { Query } from "@/types/Query";

export const columns = (
  handleEdit: (query: Query) => void,
  handleDelete: (query: Query) => void,
  handleView: (query: Query) => void,
  type: string,
): ColumnDef<Query>[] => {
  const baseColumns: ColumnDef<Query>[] = [
    {
      accessorKey: "id",
      header: "SL",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "query",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Query
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.status?.name || "—"}</span>,
    },
  ];

  if (type === "category") {
    baseColumns.splice(3, 0, {
      accessorKey: "parent_name",
      header: () => <>Parent</>,
      cell: ({ row }) => <span>{row.original?.parent?.name || "—"}</span>,
    });
  }

  baseColumns.push({
    id: "actions",
    header: () => <>Action</>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2 p-2">
        <button
          onClick={() => handleView(row.original)}
          className="flex items-center gap-1 rounded border border-green-300 px-3 py-1 text-sm text-green-600 transition-colors hover:bg-green-50"
          aria-label="View"
        >
          <BsEye size={16} />
          View
        </button>
        <button
          onClick={() => handleEdit(row.original)}
          className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          aria-label="Edit"
        >
          <BsPencil size={16} />
          Edit
        </button>
        <button
          onClick={() => handleDelete(row.original)}
          className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
          aria-label="Delete"
        >
          <BsTrash size={16} />
          Delete
        </button>
      </div>
    ),
  });

  return baseColumns;
};
