"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BsTrash, BsPencil, BsEyeFill } from "react-icons/bs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { ArrowUpDown } from "lucide-react"
import { Registration } from "@/types/product/Product";
import Link from "next/link";

export const columns = (handleEdit: (product: Registration) => void, handleDelete: (id: Registration) => void): ColumnDef<Registration>[] => [
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
        accessorKey: "cid",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Client CID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <>{row.original.cid}</>;
        }
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Client Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <>{row.original.name}</>;
        }
    },
    {
        accessorKey: "orgName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Organization
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <>{row.original.organizationDetails.description}</>;
        }
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount (Nu.)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return <>{row.original.productDetailsEntities.reduce((total, item) => total + item.amount, 0)}</>;
        }
    },
    
    {
        accessorKey: "submittedDate",
        header: ({ column }) => {
            return (
                <>Submitted Date</>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.original.submittedDate);
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
                        {/* <DropdownMenuItem
                            onClick={() => handleDelete(row.original)}
                        >
                            <BsTrash className="fill-current" color="red" fill="red" size={18} />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <BsPencil className="fill-current" color="blue" size={20} />
                            Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                            <Link href={`/product/application-detail?applicationNumber=${row.original.ptlCode}&id=${row.original.applicantId}`}>
                                <span className="flex items-center gap-1">
                                    <BsEyeFill className="fill-current" color="blue" size={20} /> View
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];