"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsTrash, BsPencil } from "react-icons/bs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

export type CalibrationGroup = {
  id: number;
  code: string;
  phone_no: number;
  time_stamp: number;
  calls: string;
  parent: string;
  remarks: string;
  complain: string;
  calibration_service_id: number;
  active: string;
};

// Temporary data array
export const temporaryData: CalibrationGroup[] = [
  {
    id: 1,
    code: "CG001",
    phone_no: 1234567890,
    time_stamp: Date.now(),
    calls: "5",
    parent: "Parent 1",
    remarks: "Initial calibration",
    complain: "None",
    calibration_service_id: 101,
    active: "Yes",
  },
  {
    id: 2,
    code: "CG002",
    phone_no: 9876543210,
    time_stamp: Date.now(),
    calls: "3",
    parent: "Parent 2",
    remarks: "Follow-up needed",
    complain: "Device not working",
    calibration_service_id: 102,
    active: "No",
  },
  {
    id: 3,
    code: "CG003",
    phone_no: 5551234567,
    time_stamp: Date.now(),
    calls: "7",
    parent: "Parent 3",
    remarks: "Completed",
    complain: "None",
    calibration_service_id: 103,
    active: "Yes",
  },
  {
    id: 4,
    code: "CG004",
    phone_no: 4445556666,
    time_stamp: Date.now(),
    calls: "2",
    parent: "Parent 4",
    remarks: "Pending review",
    complain: "Inaccurate readings",
    calibration_service_id: 104,
    active: "Yes",
  },
  {
    id: 5,
    code: "CG005",
    phone_no: 7778889999,
    time_stamp: Date.now(),
    calls: "4",
    parent: "Parent 5",
    remarks: "Rescheduled",
    complain: "None",
    calibration_service_id: 105,
    active: "No",
  },
];

export const columns = (
  handleEdit: (calibrationGroup: CalibrationGroup) => void,
  handleDelete: (id: CalibrationGroup) => void,
): ColumnDef<CalibrationGroup>[] => [
  {
    accessorKey: "id",
    header: "Sl No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "phone_no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Agent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "Action",
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            aria-label="Edit"
          >
            <BsPencil className="h-20 w-20" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
            aria-label="Delete"
            className="p-4 font-bold hover:bg-red-50"
          >
            <BsTrash className="h-24 w-24 text-red-600 hover:text-red-700" />
          </Button>
        </div>
      );
    },
  },
];
