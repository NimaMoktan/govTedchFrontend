"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Noticeboard } from "@/types/Noticeboard";

export const columns = (
  handleEdit: (noticeboard: Noticeboard) => void,
  handleDelete: (id: Noticeboard) => void,
): ColumnDef<Noticeboard>[] => [
  {
    accessorKey: "id",
    header: "SL No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "answer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Answer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <>{row.original.category?.name}</>;
    },
  },
  {
    accessorKey: "sub-categories",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sub-Categories
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      let priorityClass = "";
      switch (priority) {
        case "HIGH":
          priorityClass = "bg-red-100 text-red-800"; // Lighter background with darker text
          break;
        case "MEDIUM":
          priorityClass = "bg-yellow-100 text-yellow-800";
          break;
        default:
          priorityClass = "bg-green-100 text-green-800";
      }
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${priorityClass}`}
        >
          {priority}
        </span>
      );
    },
  },

  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row.original)}
            className="flex items-center gap-1 rounded border border-red-300 px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <BsTrash size={16} />
            Delete
          </button>

          <button
            onClick={() => handleEdit(row.original)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          >
            <BsPencil size={16} />
            Edit
          </button>
        </div>
      );
    },
  },
];
