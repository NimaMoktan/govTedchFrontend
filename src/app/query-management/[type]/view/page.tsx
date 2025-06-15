"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getQueryById } from "@/services/QueryService";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Query } from "@/types/Query";
import { toast } from "react-toastify";

const QueryViewPage = ({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) => {
  const { type, id } = React.use(params); // Unwrap params with React.use()
  const [queryData, setQueryData] = React.useState<Query | null>(null);
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getQueryById(Number(id));
        setQueryData(response.data);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch query details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setIsLoading]);

  if (!queryData) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`View ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        parentPage="Query Management"
      />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <div className="-mt-2 space-y-4 p-4 md:p-5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <p className="rounded border p-2">{queryData.email || "—"}</p>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-sm font-medium">
                    Phone Number
                  </label>
                  <p className="rounded border p-2">
                    {queryData.phone_number || "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-sm font-medium">Date</label>
                  <p className="rounded border p-2">
                    {queryData.date
                      ? new Date(queryData.date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    Query
                  </label>
                  <p className="rounded border p-2">{queryData.query || "—"}</p>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    Remarks
                  </label>
                  <p className="rounded border p-2">
                    {queryData.remarks || "—"}
                  </p>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>
                  <p className="rounded border p-2">
                    {queryData.category?.name || "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Sub Category
                  </label>
                  <p className="rounded border p-2">
                    {queryData.sub_category?.map((sc) => sc.name).join(", ") ||
                      "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>
                  <p className="rounded border p-2">
                    {queryData.status?.name || "—"}
                  </p>
                </div>
              </div>
              <div className="mb-5 flex flex-col gap-6 pb-5 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Assigned By
                  </label>
                  <p className="rounded border p-2">
                    {queryData.assigned_by?.name || "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Gender
                  </label>
                  <p className="rounded border p-2">
                    {queryData.gender?.name || "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Dzongkhag
                  </label>
                  <p className="rounded border p-2">
                    {queryData.dzongkhag?.name || "—"}
                  </p>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Start Time
                  </label>
                  <p className="rounded border p-2">
                    {queryData.start_date
                      ? new Date(queryData.start_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    End Time
                  </label>
                  <p className="rounded border p-2">
                    {queryData.end_date
                      ? new Date(queryData.end_date).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="w-full xl:w-1/3">
                  <label className="mb-2 block text-sm font-medium">
                    Assigned To
                  </label>
                  <p className="rounded border p-2">
                    {queryData.assigned_to?.name || "—"}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="mt-4.5 rounded-full"
                  onClick={() => router.push(`/query-management/${type}`)}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default QueryViewPage;
