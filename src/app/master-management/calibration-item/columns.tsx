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

export type CalibrationGroup = {
    calibrationGroup: any;
    id: number;
    code: string;
    description: string;
    range: string;
    charges: number;
    test: string;
    calibration_group_id: number;
    active: string;
    subsequentRate: number;
};

export const columns = (handleEdit: (calibrationGroup: CalibrationGroup) => void, handleDelete: (id: CalibrationGroup) => void): ColumnDef<CalibrationGroup>[] => [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => {        
            return (<p>{row.index+1}</p>)
        },
    },
    {
        accessorKey: "code",
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
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "parameter",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Item Group
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const group = row.original.calibrationGroup;
            return (<p>
                {group.description}
            </p>)
        }
    },
    {
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
                        <DropdownMenuItem
                            onClick={() => handleDelete(row.original)}
                        >
                            <BsTrash className="fill-current" color="red" fill="red" size={18} />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                            <BsPencil className="fill-current" size={20} />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];