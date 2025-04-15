"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BsTrash, BsPencil } from "react-icons/bs";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { Product } from "@/types/product/Product";

export const columns = (handleEdit: (product: Product) => void, handleDelete: (id: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: "id",
        header: "SL",
        cell: ({ row }) => {
            return (<p>{row.index + 1}</p>)
        },
    },
    {
        accessorKey: "ptlCode",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "sourceOfSample",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Source Of Sample
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "ratesInNu",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Rate (Nu.)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "createdDate",
        header: ({ column }) => {
            return (
                <>Submit At</>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.createdDate);
            return <>{date.toLocaleString()}</>;
        }
    },
    {
        id: "actions",
        header: ({ column }) => {
            return (
                <>Action</>
            )
        },
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
                        <DropdownMenuItem
                            onClick={() => handleDelete(row.original)}
                        >
                            <BsTrash className="fill-current" color="red" fill="red" size={18} />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <BsPencil className="fill-current" color="blue" size={20} />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <BsPencil className="fill-current" color="blue" size={20} />
                            View
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];