"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BsTrash, BsPencil } from "react-icons/bs";
import { Privilege } from "@/types/Privilege";
import { HasPermission } from "@/context/PermissionContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"

export const columns = (handleEdit: (privileges: Privilege) => void, handleDelete: (id: Privilege) => void): ColumnDef<Privilege>[] => [
    {
        accessorKey: "id",
        header: "Sl No.",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "active",
        header: () => "Status",
        cell: ({ row }) => {
        const status = row.original.active;
        return (<p
            className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${status === "Y"
            ? "bg-success text-success"
            : "bg-danger text-danger"
            }`}
        >
            {status === "Y" ? "Active" : "Inactive"}
        </p>)
        },
    },
    
    {
        id: "actions",
        header: "Actions",
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
                        {/* <HasPermission permission="can delete privilege"> */}
                        <DropdownMenuItem
                            onClick={() => handleDelete(row.original)}
                        >
                            <BsTrash className="fill-current" color="red" fill="red" size={18} />
                            Delete
                        </DropdownMenuItem>
                        {/* </HasPermission> */}
                        {/* <HasPermission permission="can edit privilege"> */}

                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <BsPencil className="fill-current" size={20} />
                            Edit
                        </DropdownMenuItem>
                        {/* </HasPermission> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];