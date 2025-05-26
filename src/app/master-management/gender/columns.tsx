import { ColumnDef } from "@tanstack/react-table";
import { GenderItem } from "./page";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const columns = (
  handleEdit: (gender: GenderItem) => void,
  handleDelete: (gender: GenderItem) => void,
): ColumnDef<GenderItem>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <div className="uppercase">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "name",
    header: "Gender Name",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("is_active") ? "Active" : "Inactive"}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const gender = row.original;

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(gender)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(gender)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
