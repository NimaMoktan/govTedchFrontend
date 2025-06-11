"use client";
import { useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const PermissionTable = () => {
  const [permissions, setPermissions] = useState({
    userManagement: [
      {
        id: 1,
        description: "Create Gender",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 2,
        description: "Delete Gender",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 3,
        description: "View Gender",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 4,
        description: "Edit Gender",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 5,
        description: "Create Status",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 6,
        description: "Delete Status",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 7,
        description: "View Status",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 8,
        description: "Edit Status",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 9,
        description: "Create Category",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 10,
        description: "Delete Category",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 11,
        description: "View Category",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 12,
        description: "Edit Category",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 13,
        description: "Create Dzongkhag",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 14,
        description: "Delete Dzongkhag",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 15,
        description: "View Dzongkhag",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 16,
        description: "Edit Dzongkhag",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
    ],
    dataManagement: [
      {
        id: 17,
        description: "Create User",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 18,
        description: "Delete User",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 19,
        description: "View User",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 20,
        description: "Edit User",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 21,
        description: "Create Roles",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 22,
        description: "Delete Roles",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 23,
        description: "View Roles",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 24,
        description: "Edit Roles",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
    ],
    taskManagement: [
      {
        id: 25,
        description: "Create Calls",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 26,
        description: "Delete Calls",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 27,
        description: "View Calls",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 28,
        description: "Edit Calls",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 29,
        description: "Create Emails",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 30,
        description: "Delete Emails",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 31,
        description: "View Emails",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 32,
        description: "Edit Emails",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
    ],
    noticeManagement: [
      {
        id: 33,
        description: "Create Noticeboard",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 34,
        description: "Delete Noticeboard",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 35,
        description: "View Noticeboard",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 36,
        description: "Edit Noticeboard",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
    ],
    faqManagement: [
      {
        id: 37,
        description: "Create FAQ",
        admin: true,
        supervisor: false,
        agent: false,
        customer: false,
      },
      {
        id: 38,
        description: "Delete FAQ",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
      {
        id: 39,
        description: "View FAQ",
        admin: true,
        supervisor: true,
        agent: true,
        customer: true,
      },
      {
        id: 40,
        description: "Edit FAQ",
        admin: true,
        supervisor: true,
        agent: false,
        customer: false,
      },
    ],
  });

  const handleCheckboxChange = (
    category: keyof typeof permissions,
    id: number,
    role: "admin" | "supervisor" | "agent" | "customer",
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: prev[category].map((perm) =>
        perm.id === id ? { ...perm, [role]: !perm[role] } : perm,
      ),
    }));
  };

  const formatCategoryName = (str: string) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

  const groupBySubtopic = (
    items: (typeof permissions)[keyof typeof permissions],
  ) => {
    const groups: Record<string, typeof items> = {};
    items.forEach((perm) => {
      const keyword = perm.description.split(" ").pop() || "General";
      if (!groups[keyword]) groups[keyword] = [];
      groups[keyword].push(perm);
    });
    return groups;
  };

  return (
    <div className="container mx-auto rounded border border-gray-200 p-5">
      <Input
        placeholder="Search by User Permissions"
        className="mb-4 max-w-[250px]"
      />
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4 text-left text-sm font-medium uppercase text-gray-600">
                Permission
              </TableHead>
              {["Admin", "Supervisor", "Agent", "Customer"].map((role) => (
                <TableHead
                  key={role}
                  className="px-6 py-4 text-center text-sm font-medium uppercase text-gray-600"
                >
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(permissions).map(([topic, perms], idx) => {
              const grouped = groupBySubtopic(perms);
              return (
                <React.Fragment key={topic}>
                  <TableRow className={`bg-gray-200 ${idx > 0 ? "mt-10" : ""}`}>
                    <TableCell
                      colSpan={5}
                      className="border-b border-t border-gray-300 bg-gray-100 px-6 py-5 text-lg font-semibold text-gray-900"
                    >
                      {formatCategoryName(topic)}
                    </TableCell>
                  </TableRow>
                  {Object.entries(grouped).map(([subtopic, perms]) => (
                    <React.Fragment key={subtopic}>
                      <TableRow className="bg-gray-50">
                        <TableCell
                          colSpan={5}
                          className="border-b border-gray-200 px-6 py-3 text-sm font-medium text-gray-700"
                        >
                          {subtopic}
                        </TableCell>
                      </TableRow>
                      {perms.map((perm) => (
                        <TableRow key={perm.id} className="hover:bg-blue-50">
                          <TableCell className="px-6 py-4 text-sm text-gray-900">
                            {perm.description}
                          </TableCell>
                          {(
                            [
                              "admin",
                              "supervisor",
                              "agent",
                              "customer",
                            ] as const
                          ).map((role) => (
                            <TableCell
                              key={`${perm.id}-${role}`}
                              className="px-6 py-4 text-center"
                            >
                              <input
                                type="checkbox"
                                checked={perm[role]}
                                onChange={() =>
                                  handleCheckboxChange(
                                    topic as keyof typeof permissions,
                                    perm.id,
                                    role,
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionTable;
