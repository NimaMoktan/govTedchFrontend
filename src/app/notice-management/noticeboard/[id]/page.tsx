"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import MultiSelect from "@/components/Inputs/MultiSelect";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getUser, updateUser } from "@/services/UserService";
import { getRoleDropdowns } from "@/services/RoleService";
import { User } from "@/types/User";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import SelectDropDown from "@/components/Inputs/Select";
import { Noticeboard } from "@/types/Noticeboard";
import { getNoticeboard } from "@/services/NoticeboardService";

interface RoleDropdown {
  value: string;
  text: string;
}

const NoticeboardEdit = ({ params }: { params: { id: string } }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [roleDropdown, setRoleDropdown] = useState<RoleDropdown[]>([]);
  const [initialValues, setInitialValues] = useState<Noticeboard>({
    id: 0,
    question: "",
    answer: "",
    category_id: "",
    sub_categories: "",
   
  });
  const [roleList, setRoleList] = useState<RoleDropdown[]>([]);
  const router = useRouter();

  const handleSubmit = async (
    values: Noticeboard,
    {
      resetForm,
    }: { resetForm: (nextState?: Partial<FormikState<Noticeboard>>) => void },
  ) => {
    setIsLoading(true);
    try {
      const response = await updateUser(values.id, values);
      toast.success(response.data.message, {
        duration: 1500,
        position: "top-right",
      });
      setTimeout(() => {
        router.push("/notice-management/noticeboard");
      }, 2000);
      resetForm();
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to update Notice");
    } finally {
      setIsLoading(false);
    }
  };


  if (params.id) {
    const noticeboardResponse = await getNoticeboard(Number(params.id));
    console.log("Fetched Noticeboard data:", noticeboardResponse.data);

    const noticeboardData = noticeboardResponse.data;
    if (!noticeboardData) throw new Error("Noticeboard data not found");

    setInitialValues({
      id: noticeboardData?.id,
      question: noticeboardData.question ?? "",
      answer: noticeboardData.answer ?? "",
      priority: noticeboardData.priority ?? "",
      category_id: noticeboardData.category_id ?? "",
      sub_categories: noticeboardData.sub_categories ?? "",
   
  
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load Noticeboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Notice Management" pageName="Edit Noticeboard" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={Yup.object({
       question: Yup.string()
                        .required("Question is required")
                        .min(3, "Must be at least 3 characters"),
                      asnwer: Yup.string()
                        .required("Answer is required")
                        .min(3, "Must be at least 3 characters"),
                      category_id: Yup.string().required("Select Category"),
                      sub_categories: Yup.string().required("Select Sub-Categories"),
                      priority: Yup.string().required("Select Priority"),
              })}
              onSubmit={handleSubmit}
            >
            <Form>
            <div className="-mt-2 space-y-4 p-4 md:p-5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <InputTextArea
                    name="question"
                    label="Question"
                    placeholder="Write your question here....."
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <InputTextArea
                    label="Answer"
                    placeholder="Enter your answer"
                    name="answer"
                  />
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <SelectDropDown
                    label="Category"
                    name="category_id"
                    options={category}
                    onValueChange={(value: string) =>
                      loadSubCategory(Number(value))
                    }
                    //  onValueChange={(value: string) => setFieldValue("organizationId", value)}
                  />
                </div>
                {subCategory.length > 0 && (
                  <div className="w-full xl:w-1/2">
                    <SelectDropDown
                      label="Sub Category"
                      name="sub_categories"
                      options={subCategory}
                    />
                  </div>
                )}
                <div className="w-full xl:w-1/2">
                  <SelectDropDown
                    label="Priority"
                    name="priority"
                    options={[
                      {
                        value: "LOW",
                        text: "Low",
                      },
                      {
                        value: "MEDIUM",
                        text: "Medium",
                      },
                      {
                        value: "HIGH",
                        text: "High",
                      },
                    ]}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="mx-2 rounded-full"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
              <Link href="/notice-management/noticeboard">
                <Button
                  type="reset"
                  variant={`destructive`}
                  className="mx-2 rounded-full"
                >
                  Back
                </Button>
              </Link>
            </div>
          </Form>
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default NoticeboardEdit;
