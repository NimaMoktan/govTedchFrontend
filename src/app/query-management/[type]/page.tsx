"use client";
import React, { use, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Query } from "@/types/Query";
import { deleteQuery, getQuerysByType } from "@/services/QueryService";
import { useLoading } from "@/context/LoadingContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const QueryPage = ({ params }: { params: Promise<{ type: string }> }) => {
  const [queryList, setQueryList] = useState<Query[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [ordering, setOrdering] = useState<string>("");
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const param = use(params);

  const handleEdit = (query: Query) => {
    localStorage.setItem("editQuery", JSON.stringify(query));
    router.push(`/query-management/${param.type}/edit/${query.id}`);
  };

  const handleDelete = async (query: Query) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteQuery(query.id);
        Swal.fire(
          "Deleted!",
          "Query has been deleted successfully.",
          "success",
        );
        setQueryList((prevQuerys) =>
          prevQuerys.filter((m) => m.id !== query.id),
        );
        setTotalCount((prev) => prev - 1);
      } catch (error) {
        console.error("Error deleting query:", error);
        Swal.fire(
          "Error!",
          "Failed to delete query. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleView = (query: Query) => {
    router.push(`/query-management/${param.type}/view/${query.id}`);
  };

  useEffect(() => {
    const getQuerys = async () => {
      setIsLoading(true);
      try {
        const response = await getQuerysByType(
          param.type,
          page,
          pageSize,
          search,
          ordering,
        );
        setQueryList(response.data.results);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error("Error fetching queries:", error);
        Swal.fire(
          "Error!",
          "Failed to fetch queries. Please try again.",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getQuerys();
  }, [param.type, page, pageSize, search, ordering, setIsLoading]);

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`${param.type.charAt(0).toUpperCase() + param.type.slice(1)} Query List`}
        parentPage="Query Management"
      />
      <div className="flex flex-col gap-2">
        <CardContent className="max-w-full overflow-x-auto">
          <DataTable
            columns={columns(handleEdit, handleDelete, handleView, param.type)}
            catType={param.type}
            data={queryList}
            totalCount={totalCount}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setSearch={setSearch}
            setOrdering={setOrdering}
          />
        </CardContent>
      </div>
    </DefaultLayout>
  );
};

export default QueryPage;
