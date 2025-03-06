"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"

import { ArrowUpDown } from "lucide-react"

export type CalibrationType = {
  id: number;
  code: string;
  description: string;
  active: string
};

export const columns = (handleEdit: (calibrationType: CalibrationType) => void, handleDelete: (id: CalibrationType) => void) : ColumnDef<CalibrationType>[] => [
  {
    accessorKey: "index",
    header: "SL",
    cell: ({ row }) => {
      const sl = row.index;
      return (<p>{sl+1}</p>)
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "active",
    header: () => "Status",
    cell: ({ row }) => {
      const status = row.original.active;
      return (<p
        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${status === "Y"
          ? "bg-success text-success"
          : "bg-danger text-danger"
          }`}
      >
        {status === "Y" ? "Active" : "Inactive"}
      </p>)
    },
  }
];