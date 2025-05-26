// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { FAQ } from "./page"; // Adjust the import based on where your interface is defined

export const columns = (
  handleEdit: (faq: FAQ) => void,
  handleDelete: (faq: FAQ) => void,
): ColumnDef<FAQ>[] => [
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
