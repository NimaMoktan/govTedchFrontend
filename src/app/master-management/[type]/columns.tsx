"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsEyeFill } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Master } from "@/types/master/master";
import Link from "next/link";
import Status from "@/components/Status/Status";

export const columns = (
  handleEdit: (master: Master) => void,
  handleDelete: (id: Master) => void,
  type: string
): ColumnDef<Master>[] => {
  const baseColumns: ColumnDef<Master>[] = [
    {
      accessorKey: "id",
      header: "SL",
      cell: ({ row }) => <p>{row.index + 1}</p>,
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "is_active",
      header: () => <>Status</>,
      cell: ({ row }) => (
        <Status
          code={row.original.is_active}
          label={row.original.is_active ? "Active" : "In-active"}
        />
      ),
    },
  ];

  // Conditionally add parent column if type is 'category'
  if (type === "category") {
    baseColumns.splice(3, 0, {
      accessorKey: "parent_name",
      header: () => <>Parent</>,
      cell: ({ row }) => (
        <span>{row.original?.parent?.name || "—"}</span>
      ),
    });
  }

  baseColumns.push({
    id: "actions",
    header: () => <>Action</>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDelete(row.original)}>
            <BsTrash className="fill-current" color="red" fill="red" size={18} />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            <BsPencil className="fill-current" color="blue" size={20} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/verification/application-detail?id=${row.original.id}`}>
              <span className="flex items-center gap-1">
                <BsEyeFill className="fill-current" color="blue" size={20} />
                View
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  return baseColumns;
};
