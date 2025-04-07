"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner"
import { DataTable } from "./table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent
} from '@/components/ui/card';
import { deleteRole, getRoles } from "@/services/RoleService";
import { Role } from "@/types/Role";

const RoleManager: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const router = useRouter();

    const loadRoles = async() => {
        const rs = await getRoles();
        setRoles(rs.data);
        
    };

    const handleEdit = (role: Role) => {
        router.push(`/user-management/roles/${role.id}`);
        // setSelectedRole(role);
    };

    const handleDelete = (role: Role) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (role?.id !== undefined) {
                    await deleteRole(role.id);
                } else {
                    toast.error("Role ID is undefined. Cannot delete the role.");
                }
                Swal.fire("Deleted!", "The role has been deleted.", "success").then(() => {
                    router.push("/user-management/roles");
                });
            }
        });
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <Card className="flex flex-col gap-2">
            <CardContent>
                <DataTable columns={columns(handleEdit, handleDelete)} data={roles} />
            </CardContent>
        </Card>
    );
};

export default RoleManager;