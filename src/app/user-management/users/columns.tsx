"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil, BsArrowRepeat } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/types/User";

export const columns = (
  handleEdit: (user: User) => void,
  handleDelete: (id: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //     accessorKey: "fullName",
  //     header: ({ column }) => {
  //         return (
  //             <Button
  //                 variant="ghost"
  //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //             >
  //                 Full Name
  //                 <ArrowUpDown className="ml-2 h-4 w-4" />
  //             </Button>
  //         )
  //     },
  // },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          {row.original.roles?.map((role, index) => (
            <Badge key={index}>{role.name}</Badge>
          ))}
        </>
      );
    },
  },
  {
    accessorKey: "cid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CID Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "active",
    header: () => "Status",
    cell: ({ row }) => {
      const status = row.original.is_active;
      return (
        <p
          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
            status ? "bg-success text-success" : "bg-danger text-danger"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </p>
      );
    },
  },
  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDelete(row.original)}>
              <BsTrash
                className="fill-current"
                color="red"
                fill="red"
                size={18}
              />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <BsPencil className="fill-current" color="blue" size={20} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <BsArrowRepeat className="fill-current" color="red" size={20} />
              {row.original.is_active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
