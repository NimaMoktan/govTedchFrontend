"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";
import { ArrowUpDown } from "lucide-react";
import { Email } from "@/types/Email";
import { Badge } from "@/components/ui/badge";
import { IoMdEye } from "react-icons/io";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const columns = (
  handleEdit: (email: Email) => void,
  handleDelete: (email: Email) => void,
): ColumnDef<Email>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    cell: ({ row }) => {
      const dateString: string = row.getValue("created_at");
      const date = new Date(dateString);
      return (
        <div className="whitespace-nowrap">
          {format(date, "MMM dd, yyyy h:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email: string = row.getValue("email");
      return <span className="font-medium">{email}</span>;
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
            status === "completed"
              ? "default"
              : status === "in_progress"
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
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const email = row.original;
      const router = useRouter();

      const handleView = (email: Email) => {
        router.push(`/task-management/emails/${email.id}/history`);
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(email)}
            className="flex items-center gap-1 rounded border border-blue-300 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-500"
          >
            <BsPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(email)}
            className="flex items-center gap-1 rounded border border-red-300 bg-white px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-500"
          >
            <BsTrash className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(email)}
            className="flex items-center gap-1 rounded border border-green-300 px-3 py-1 text-sm text-green-600 transition-colors hover:bg-green-500"
          >
            <IoMdEye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
