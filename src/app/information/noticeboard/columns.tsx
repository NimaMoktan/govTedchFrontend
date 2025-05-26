import { ColumnDef } from "@tanstack/react-table";
import { Noticeboard } from "./page";

export const columns = (
  handleEdit: (noticeboard: Noticeboard) => void,
  handleDelete: (noticeboard: Noticeboard) => void,
): ColumnDef<Noticeboard>[] => [
  {
    header: "SL No",
    accessorFn: (_, index) => index + 1,
    cell: (info) => info.row.index + 1,
  },
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Question & Answer",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.question}</p>
        <p className="text-gray-500">{row.original.answer}</p>
      </div>
    ),
  },
  {
    header: "Category & Sub-category",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.category}</p>
        <p className="text-sm text-gray-500">{row.original.subCategory}</p>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            priority === "High"
              ? "bg-red-100 text-red-800"
              : priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {priority}
        </span>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </button>
        <button
          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          onClick={() => handleDelete(row.original)}
        >
          Delete
        </button>
      </div>
    ),
  },
];
