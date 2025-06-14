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
import {
  createEmail,
  updateEmail,
  getEmailById,
} from "@/services/EmailService";
import { Email, History } from "@/types/Email";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";
import { getUsers } from "@/services/UserService";
import Select from "@/components/Inputs/Select";
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import { format } from "date-fns";

const EmailEditPage = () => {
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const [originalStatus, setOriginalStatus] = useState<any[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [agents, setAgents] = useState<Options[]>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [dzongkhag, setDzongkhag] = useState<Options[]>([]);
  const [showReAssign, setShowReAssign] = useState(false); // State to control Re-Assign visibility
  const [initialValues, setInitialValues] = useState<Email>({
    id: 0,
    email: "",
    query: "",
    status: "",
    agent: "",
    category_id: "",
    sub_categories: [],
    gender: "",
    dzongkhag: "",
    start_time: new Date().toISOString(),
    end_time: "",
    remarks: "",
    is_active: true,
    created_at: new Date().toISOString(),
    history: [],
    assigned_by: "System",
  });
  const { setIsLoading, isLoading } = useLoading();
  const router = useRouter();
  const params = useParams();
  const emailId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch category data
        const categoryRes = await getParentMastersByType("category");
        const { data: categoryData } = categoryRes;
        setOriginalCategory(categoryData);
        const categories = categoryData.filter(
          (item: any) => item.parent == null,
        );
        setCategory(
          categories.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        // Fetch status data
        const statusRes = await getParentMastersByType("status");
        const { data: statusData } = statusRes;
        setOriginalStatus(statusData);
        const statuses = statusData.filter((item: any) => item.parent == null);
        setStatus(
          statuses.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        // Fetch gender data
        const genderRes = await getParentMastersByType("gender");
        const { data: genderData } = genderRes;
        setGender(
          genderData.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        // Fetch dzongkhag data
        const dzongkhagRes = await getParentMastersByType("dzongkhag");
        const { data: dzongkhagData } = dzongkhagRes;
        setDzongkhag(
          dzongkhagData.map((param: { id: string; name: string }) => ({
            value: param.id,
            text: param.name,
          })),
        );

        // Fetch User data
        const usersRes = await getUsers();
        const usersData = usersRes.data?.results || usersRes.data || [];
        const flatUsers = usersData.flat();

        setAgents(
          flatUsers.map((user: any) => ({
            value: user.id?.toString(),
            text:
              [user.username, user.name].filter(Boolean).join(" ").trim() ||
              `User ${user.id}`,
          })),
        );
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to fetch users. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  const calculateTotalTime = (startTime: string) => {
    if (!startTime) return "0h 0m";
    const start = new Date(startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSubmit = async (values: Email) => {
    setIsLoading(true);
    try {
      const newValues = {
        ...values,
        category_id: Number(values.category_id),
        sub_categories: values.sub_categories.map(Number),
        end_time:
          values.status === "Completed"
            ? new Date().toISOString()
            : values.end_time || "",
        history: [
          ...(initialValues.history || []),
          {
            id: ((initialValues.history?.length || 0) + 1).toString(),
            date: new Date().toISOString(),
            total_time: calculateTotalTime(values.start_time),
            category:
              category.find((c) => c.value === values.category_id)?.text || "",
            sub_category:
              subCategory
                .filter((sc) => values.sub_categories.includes(sc.value))
                .map((sc) => sc.text)
                .join(", ") || "",
            query: values.query,
            remarks: values.remarks,
            agent: agents.find((a) => a.value === values.agent)?.text || "",
            gender: gender.find((g) => g.value === values.gender)?.text || "",
            dzongkhag:
              dzongkhag.find((d) => d.value === values.dzongkhag)?.text || "",
            assigned_by: values.assigned_by || "System",
          },
        ],
      };

      let response;
      if (emailId && emailId !== "create") {
        response = await updateEmail(Number(emailId), newValues);
      } else {
        response = await createEmail(newValues);
      }

      toast.success(response.data.message, {
        duration: 1500,
        position: "top-right",
      });
      setTimeout(() => {
        router.push("/task-management/emails");
      }, 1500);
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(
        error.response?.data?.message ||
          `Error while ${emailId && emailId !== "create" ? "updating" : "creating"} Email.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb
        parentPage="Email Management"
        pageName={
          emailId && emailId !== "create" ? "Edit Email" : "Create Email"
        }
      />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
                query: Yup.string()
                  .min(3, "Must be at least 3 characters")
                  .required("Query is required"),
                remarks: Yup.string()
                  .required("Remarks are required")
                  .min(3, "Must be at least 3 characters"),
                category_id: Yup.string().required("Select Category"),
                status: Yup.string().required("Select Status"),
                agent: Yup.string().required("Select Agent"),
                gender: Yup.string().required("Select Gender"),
                dzongkhag: Yup.string().required("Select Dzongkhag"),
              })}
              enableReinitialize={true}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, setFieldValue, values }) => (
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
                          name="created_at"
                          label="Date"
                          value={format(new Date(values.created_at), "PPpp")}
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
                          searchable={true}
                          label="Category"
                          name="category_id"
                          options={category}
                          onValueChange={(value: string) => {
                            setFieldValue("category_id", value);
                            setFieldValue("sub_categories", []);
                            loadSubCategory(Number(value));
                          }}
                        />
                      </div>
                      {subCategory.length > 0 && (
                        <div className="w-full xl:w-1/3">
                          <MultiSelect
                            label="Sub Category"
                            name="sub_categories"
                            options={subCategory}
                            value={values.sub_categories}
                            onChange={(newValue) => {
                              setFieldValue("sub_categories", newValue);
                            }}
                          />
                        </div>
                      )}
                      <div className="w-full xl:w-1/2">
                        <Select
                          searchable={true}
                          label="Status"
                          name="status"
                          options={status}
                          onValueChange={(value: string) => {
                            setFieldValue("status", value);
                            // Determine if the selected status is "Completed"
                            const selectedStatus = status.find(
                              (s) => s.value === value,
                            );
                            const isCompleted =
                              selectedStatus?.text.toLowerCase() ===
                              "completed";
                            // Show Re-Assign only if status is selected and not "Completed"
                            setShowReAssign(value !== "" && !isCompleted);
                            if (isCompleted) {
                              setFieldValue(
                                "end_time",
                                new Date().toISOString(),
                              );
                            } else {
                              setFieldValue("end_time", "");
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                        <Select
                          searchable={true}
                          label="Gender"
                          name="gender"
                          options={gender}
                          onValueChange={(value: string) => {
                            setFieldValue("gender", value);
                          }}
                        />
                      </div>
                      <div className="w-full xl:w-1/3">
                        <Select
                          searchable={true}
                          label="Dzongkhag"
                          name="dzongkhag"
                          options={dzongkhag}
                          onValueChange={(value: string) => {
                            setFieldValue("dzongkhag", value);
                          }}
                        />
                      </div>
                      <div className="w-full xl:w-1/3">
                        <Select
                          label="Agent"
                          name="agent"
                          options={agents}
                          onValueChange={(value: string) => {
                            const currentUser = agents.find(
                              (a) => a.value === value,
                            );
                            setFieldValue("agent", value);
                            setFieldValue(
                              "assigned_by",
                              currentUser?.text || "System",
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-5 flex flex-col gap-6 pb-5 xl:flex-row">
                      <div className="w-full xl:w-1/3">
                        <Input
                          name="start_time"
                          label="Start Time"
                          value={format(new Date(values.start_time), "PPpp")}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full xl:w-1/3">
                        <Input
                          name="end_time"
                          label="End Time"
                          value={
                            values.end_time
                              ? format(new Date(values.end_time), "PPpp")
                              : "Not completed yet"
                          }
                          disabled={true}
                        />
                      </div>
                      {showReAssign && (
                        <div className="w-full xl:w-1/3">
                          <Select
                            label="Re-Assign"
                            name="agent"
                            options={agents}
                            onValueChange={(value: string) => {
                              const currentUser = agents.find(
                                (a) => a.value === value,
                              );
                              setFieldValue("agent", value);
                              setFieldValue(
                                "assigned_by",
                                currentUser?.text || "System",
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="mt-4.5 rounded-full"
                    >
                      {isLoading
                        ? "Submitting..."
                        : emailId && emailId !== "create"
                          ? "Update"
                          : "Create"}
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

export default EmailEditPage;
