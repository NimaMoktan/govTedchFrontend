"use client";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useState, useEffect } from "react";
import { Formik, Form, FormikState } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createNoticeboard } from "@/services/NoticeboardService";
import { getRoleDropdowns } from "@/services/RoleService";
import { Noticeboard } from "@/types/Noticeboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import SelectDropDown from "@/components/Inputs/Select";

const NoticeboardsCreate = () => {
  const [roleList, setRoleList] = useState<Options[]>([]);
  const { setIsLoading, isLoading } = useLoading();

  const router = useRouter();

  const handleSubmit = async (
    values: Noticeboard,
    resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void,
  ) => {
    setIsLoading(true);
    try {
      await createNoticeboard({ ...values })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
          resetForm();
          setTimeout(() => {
            // setIsLoading(false)
            router.push("/notice-management/noticeboard");
          }, 2000);
        })
        .catch((e) => {
          toast.error("Error while creating Notice.");
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("ERROR", error);
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
                id: null, // Add default id value
                question: "",
                asnwer: "",
                category_id: "",
                sub_categories: "",
                priority: "",
                is_active: true,
              }}
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
              onSubmit={(values, { resetForm }) => {}}
            >
              {({ errors }) => {
                console.log(errors);
                return (
                  <Form>
                    <div className="-mt-2 space-y-4 p-4 md:p-5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Question"
                            autoComplete="off"
                            type="text"
                            placeholder="Enter your question"
                            name="question"
                          />
                        </div>
                        <div className="w-full xl:w-1/2">
                          <Input
                            label="Answer"
                            autoComplete="off"
                            type="text"
                            placeholder="Enter your answer"
                            name="answer"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="mx-2 rounded-full"
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                      <Link href="/user-management/users">
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
                );
              }}
            </Formik>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default NoticeboardsCreate;
