"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";

export type Application = {
  createdDate: string;
  id: number;
  applicationNumber: string;
  status: string;
};

export const columns: ColumnDef<Application>[] = [
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
      );
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
      );
    },
    cell: ({ row }) => {
      const date = row.original.createdDate;
      return <p>{ moment(date).format('YYYY-MM-DD HH:SS')}</p>;
    }
  },
  {
    accessorKey: "status",
    header: () => "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <p
          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
            status === "Verified"
              ? "bg-success text-success"
              : "bg-danger text-danger"
          }`}
        >
          {status}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
        </Button>
      );
    },
  },
];
