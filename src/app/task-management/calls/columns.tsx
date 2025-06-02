"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { ArrowUpDown } from "lucide-react";
import { IoMdEye } from "react-icons/io";
import { useState } from "react";

export type callGroup = {
  id: number;
  phone_no: number;
  time_stamp: number;
  query: string;
  category: string;
  subcategory: string;
  status: string;
  agent: string;
  remarks: string;
  active: string;
};

export const columns = (
  handleEdit: (callGroup: callGroup) => void,
  handleDelete: (id: callGroup) => void,
  handleView: (callGroup: callGroup) => void,
): ColumnDef<callGroup>[] => [
  {
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => {
      return <span className="font-medium">{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "phone_no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const phoneNo = row.getValue("phone_no") as number;
      return <span className="font-medium">{phoneNo}</span>;
    },
  },
  {
    accessorKey: "time_stamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("time_stamp") as number;
      return <span>{new Date(timestamp).toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "query",
    header: "Query",
    cell: ({ row }) => {
      const query = row.getValue("query") as string;
      return <span className="line-clamp-1">{query}</span>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let statusClass = "";
      switch (status) {
        case "Pending":
          statusClass = "bg-yellow-100 text-yellow-800";
          break;
        case "Assigned":
          statusClass = "bg-blue-100 text-blue-800";
          break;
        case "In Progress":
          statusClass = "bg-purple-100 text-purple-800";
          break;
        case "Completed":
          statusClass = "bg-green-100 text-green-800";
          break;
        default:
          statusClass = "bg-gray-100 text-gray-800";
      }
      return (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "agent",
    header: "Agent",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          >
            <BsPencil size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <BsTrash size={16} />
          </button>
          <button
            onClick={() => handleView(row.original)}
            className="flex items-center gap-1 rounded border border-green-300 px-3 py-1 text-sm text-green-600 transition-colors hover:bg-green-50"
          >
            <IoMdEye size={16} />
          </button>
        </div>
      );
    },
  },
];
