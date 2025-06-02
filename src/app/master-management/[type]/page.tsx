"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Master } from "@/types/master/master";
import { deleteMaster, getMastersByType } from "@/services/master/MasterService";
import { useLoading } from "@/context/LoadingContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const MasterPage = ({ params }: { params: Promise<{ type: string }> }) => {
  const [masterList, setMasterList] = useState<Master[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");
  const { setIsLoading } = useLoading();
  const param = React.use(params);
  const router = useRouter();

  const handleEdit = (master: Master) => {
    localStorage.setItem("editMaster", JSON.stringify(master));
    router.push(`/master-management/${param.type}/edit/${master.id}`);
  };

  const handleDelete = async (master: Master) => {
    await deleteMaster(master.id)
      .then(() => {
        Swal.fire({
          title: "Deleted!",
          text: "Master has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setMasterList((prevMasters) =>
            prevMasters.filter((m) => m.id !== master.id)
          );
        });
      })
      .catch((error) => {
        console.error("Error deleting master:", error);
      });
  };

  useEffect(() => {
    const getMasters = async () => {
      setIsLoading(true);
      try {
        const response = await getMastersByType(
          param.type,
          page,
          pageSize,
          search,
          ordering
        );
        setMasterList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("Error fetching masters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getMasters();
  }, [param.type, page, search, ordering, setIsLoading, pageSize]);

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`${param.type.charAt(0).toUpperCase() + param.type.slice(1)} Master List`}
        parentPage="Master Management"
      />
      <div className="flex flex-col gap-2">
        <Card className="w-full">
          <CardContent className="max-w-full overflow-x-auto">
            <DataTable
              columns={columns(handleEdit, handleDelete, param.type)}
              catType={param.type}
              data={masterList}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setSearch={setSearch}
              setOrdering={setOrdering}
            />
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default MasterPage;