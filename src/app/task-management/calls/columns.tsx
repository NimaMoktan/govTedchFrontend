"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { ArrowUpDown } from "lucide-react";
import { Call } from "@/types/Call";
import { Badge } from "@/components/ui/badge";
import { IoMdEye } from "react-icons/io";
import { useRouter } from "next/navigation";

export const columns = (
  handleEdit: (call: Call) => void,
  handleDelete: (call: Call) => void,
  handleView: (call: Call) => void,
): ColumnDef<Call>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Phone_Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const call: string = row.getValue("phone_number");
      return <span className="font-medium">{call}</span>;
    },
  },
  {
    accessorKey: "query",
    header: "Query",
    cell: ({ row }) => {
      const query: string = row.getValue("query");
      return <div className="max-w-[200px] truncate">{query}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge
          variant={
            status === "Completed"
              ? "default"
              : status === "In-Progress"
                ? "secondary"
                : "outline"
          }
        >
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "agent",
    header: "Agent",
    cell: ({ row }) => {
      const agent: string = row.getValue("agent");
      return <span>{agent || "Unassigned"}</span>;
    },
  },
  {
    accessorKey: "assigned_by",
    header: "Assigned By",
    cell: ({ row }) => {
      const assignedBy: string = row.getValue("assigned_by");
      return <span>{assignedBy || "System"}</span>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const call = row.original;
      const router = useRouter();

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleEdit(call);
              router.push(`/task-management/calls/${call.id}`);
            }}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-500"
          >
            <BsPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(call)}
            className="flex items-center gap-1 rounded border border-red-300 bg-white px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-500"
          >
            <BsTrash className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(call)}
            className="flex items-center gap-1 rounded border border-green-300 px-3 py-1 text-sm text-green-600 transition-colors hover:bg-green-500"
          >
            <IoMdEye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
