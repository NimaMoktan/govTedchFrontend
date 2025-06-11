"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputTextArea from "@/components/Inputs/InputTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createEmail } from "@/services/EmailService";
import { Noticeboard } from "@/types/Noticeboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";

const EmailCreatePage = () => {
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getParentMastersByType("category");
        const { data } = res;
        setOriginalCategory(data);
        const categories = data.filter((item) => item.parent == null);
        const paramOptions = categories?.map(
          (param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          }),
        );
        setCategory(paramOptions);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const loadSubCategory = (main_category_id: number) => {
    const sub_list = originalCategory.filter(
      (list) => list.parent !== null && list.parent.id === main_category_id,
    );
    setSubCategory(
      sub_list.map((param: { id: number; name: string }) => ({
        value: param.id,
        text: param.name,
      })),
    );
  };

  const handleSubmit = async (values: Noticeboard) => {
    setIsLoading(true);
    try {
      const newValues = {
        ...values,
        category: Number(values.category_id),
        sub_categories: values.sub_categories.map(Number),
        start_time: new Date().toISOString(),
        end_time: values.status === "Completed" ? new Date().toISOString() : "",
      };
      const response = await createEmail(newValues);
      toast.success(response.data.message, {
        duration: 1500,
        position: "top-right",
      });
      setTimeout(() => {
        router.push("/task-management/emails");
      }, 1500);
    } catch (error) {
      toast.error("Error while creating Email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Notice Management" pageName="Create Notice" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                email: "",
                query: "",
                status: "",
                agent: "",
                category_id: "",
                sub_categories: [],
                start_time: new Date().toISOString(),
                end_time: "",
                remarks: "",
                is_active: true,
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
                query: Yup.string()
                  .min(3, "Must be at least 3 characters")
                  .required("Query is required"),
                remarks: Yup.string()
                  .required("Answer is required")
                  .min(3, "Must be at least 3 characters"),
                category_id: Yup.string().required("Select Category"),
                status: Yup.string().required("Select Priority"),
              })}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, setFieldValue, setFieldTouched, validateForm }) => (
                <Form>
                  <div className="-mt-2 space-y-4 p-4 md:p-5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Input
                          name="email"
                          label="Email"
                          placeholder="Enter your Email here...."
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Input
                          name="date"
                          label="Date"
                          placeholder="Email Date will be here"
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <InputTextArea
                          name="query"
                          label="Query"
                          placeholder="Your question will be here....."
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full">
                        <InputTextArea
                          label="Remarks"
                          placeholder="Enter your Remarks here...."
                          name="remarks"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/2">
                        <Select
                          label="Status"
                          name="status"
                          options={[
                            { value: "Pending", text: "Pending" },
                            { value: "In-Progress", text: "In-Progress" },
                            { value: "On-Hold", text: "On-Hold" },
                            { value: "Completed", text: "Completed" },
                          ]}
                          onValueChange={(value: string) => {
                            setFieldValue("status", value);
                            if (value === "Completed") {
                              setFieldValue(
                                "end_time",
                                new Date().toISOString(),
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="w-full xl:w-1/2">
                        <Select
                          searchable={true}
                          label="Category"
                          name="category_id"
                          options={category}
                          onValueChange={(value: string) => {
                            setFieldValue("category_id", value);
                            loadSubCategory(Number(value));
                          }}
                        />
                      </div>
                      {subCategory.length > 0 && (
                        <div className="w-full xl:w-1/2">
                          <MultiSelect
                            label="Sub Category"
                            name="sub_categories"
                            options={subCategory}
                          />
                        </div>
                      )}
                    </div>
                    <div className="mb-5 flex flex-col gap-6 pb-5 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                        <Input
                          name="agent"
                          label="Agent"
                          placeholder="Agent 1"
                        />
                      </div>
                      <div className="w-full xl:w-1/3">
                        <Input
                          name="start_time"
                          label="Start Time"
                          value={new Date().toISOString()}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full xl:w-1/3">
                        <Input
                          name="end_time"
                          label="End Time"
                          placeholder="End time will be set on completion"
                          disabled={true}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4.5 rounded-full"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                    <Link href="/task-management/emails">
                      <Button
                        type="reset"
                        variant="destructive"
                        className="mx-2 rounded-full"
                      >
                        Back
                      </Button>
                    </Link>
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

export default EmailCreatePage;
