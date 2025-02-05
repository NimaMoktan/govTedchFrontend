"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BsTrash, BsPencil } from "react-icons/bs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

export type CalibrationType = {
  id: number;
  code: string;
  description: string;
  active: string
};

export const columns = (handleEdit: (calibrationType: CalibrationType) => void, handleDelete: (id: CalibrationType) => void) : ColumnDef<CalibrationType>[] => [
  {
    accessorKey: "id",
    header: "Id"
  },
  {
    accessorKey: "applicationNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Application Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: () => "status",
    cell: ({ row }) => {
      const status = row.original.active;
      return (<p
        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${status === "Submission"
          ? "bg-success text-success"
          : "bg-danger text-danger"
          }`}
      >
        {status === "Submission" ? "Approved" : "Submission"}
      </p>)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDelete(row.original)}
            >

              <BsTrash className="fill-current" color="red" fill="red" size={18} />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <BsPencil className="fill-current" size={20} />
              Edit
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];