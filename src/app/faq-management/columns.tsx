"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Noticeboard } from "@/types/Noticeboard";
import { FAQ } from "@/types/FAQ";

export const columns = (
  handleEdit: (faq: FAQ) => void,
  handleDelete: (id: FAQ) => void,
): ColumnDef<FAQ>[] => [
  {
    accessorKey: "id",
    header: "SL No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },

  {
    header: "Question & Answer",
    cell: ({ row }) => (
      <div>
        <p className="text-base font-medium">{row.original.question}</p>
        <p className="text-sm text-gray-500">{row.original.answer}</p>
      </div>
    ),
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
    cell: ({ row }) => {
      const sub_categories = row.original.sub_categories;
      return (
        <>
          {sub_categories?.map((sub, index) => (
            <Badge variant={`outline`} key={index}>
              {sub.name}
            </Badge>
          ))}
        </>
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
