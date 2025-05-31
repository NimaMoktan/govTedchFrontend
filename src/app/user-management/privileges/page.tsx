"use client";
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./table";
import { Privilege } from "@/types/Privilege";
import { getPrivileges } from "@/services/PrivilegesService";
import { toast } from "sonner";
import { columns } from "./columns";
import Swal from "sweetalert2";
import { useLoading } from "@/context/LoadingContext";

export default function Page() {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const { setIsLoading } = useLoading();

  const loadPrivileges = async () => {
    setIsLoading(true);
    try {
      const rs = await getPrivileges().finally(() => setIsLoading(false));
      setPrivileges(rs.data);
    } catch (error) {
      toast.error("An error occurred while fetching privileges.");
    }
  };

  const handleEdit = (privilege: Privilege) => {};

  const handleDelete = (privilege: Privilege) => {
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
        if (privilege?.id !== undefined) {
          //   await deletePrivilege(privilege.id);
        } else {
          toast.error("Privilege ID is undefined. Cannot delete the role.");
        }
        Swal.fire(
          "Deleted!",
          "The Privilege has been deleted.",
          "success",
        ).then(() => {
          // router.push("/user-management/privileges");
          loadPrivileges();
        });
      }
    });
  };

  useEffect(() => {
    loadPrivileges();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Privileges" parentPage="User Management" />
      <Card className="flex flex-col gap-2">
        <CardContent>
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={privileges}
          />
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
