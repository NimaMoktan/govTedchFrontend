"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SelectDropDown from "@/components/Inputs/Select";
import { getParentMastersByType, updateMaster } from "@/services/master/MasterService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MasterUpdatePage = ({ params }: { params: Promise<{ type: string }> }) => {
  const [parent, setParent] = useState<any>(null);
  const [editMaster, setEditMaster] = useState<any>(null);
  const param = React.use(params);
  const router = useRouter();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await getParentMastersByType(param.type);
        const res = response.data;
        setParent(
          res.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching parent data:", error);
      }
    };

    const masterData = localStorage.getItem("editMaster");
    if (masterData) {
      const parsedData = JSON.parse(masterData);
      console.log("editMaster:", parsedData);
      setEditMaster(parsedData);
    }

    fetchParentData();
  }, [param.type]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await updateMaster(editMaster.id, values);
      toast.success(response.data.message);
        localStorage.removeItem("editMaster");
        setTimeout(() => {
            router.push(`/master-management/${param.type}`);
        }, 1000);
    } catch (error: any) {
      console.error("Error creating master:", error);
      toast.error(error.response?.data?.message || "Failed to create master. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={`Edit ${param.type.charAt(0).toUpperCase() + param.type.slice(1)}`}
        parentPage="Master Management"
      />
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              enableReinitialize
              initialValues={{
                type: param.type,
                name: editMaster?.name || "",
                description: editMaster?.description || "",
                code: "CODE",
                is_active: editMaster?.is_active ?? "",
                parent_id: editMaster?.parent_id ?? null,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Role name is required"),
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="p-4 md:p-5 space-y-4 -mt-2">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Name"
                          type="text"
                          placeholder="Enter Name"
                          name="name"
                          onChange={(event: any) => {
                            const value = event.target ? event.target.value : event;
                            setFieldValue("name", value);
                          }}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          label="Description"
                          type="text"
                          placeholder="Enter Description"
                          name="description"
                          onChange={(event: any) => {
                            const value = event.target ? event.target.value : event;
                            setFieldValue("description", value);
                          }}
                        />
                      </div>
                      {param.type === "category" && (
                        <div className="w-full xl:w-1/2">
                          <SelectDropDown
                            label="Select Parent"
                            name="parent_id"
                            options={parent || []}
                          />
                        </div>
                      )}
                      <div className="w-full xl:w-1/2">
                        <SelectDropDown
                          label="Select Status"
                          name="is_active"
                          options={[
                            { value: true, text: "Active" },
                            { value: false, text: "Inactive" },
                          ]}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="rounded-full mx-2">
                      {isSubmitting ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default MasterUpdatePage;