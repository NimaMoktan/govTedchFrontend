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
import { Noticeboard } from "@/types/Noticeboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";
import SelectDropDown from "@/components/Inputs/Select";
import MultiSelect from "@/components/FormElements/MultiSelect";
import { values } from "lodash";
import InputTextArea from "@/components/Inputs/InputTextArea";

const NoticeboardsCreate = () => {
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [originalCategory, setOriginalCategory] = useState<any[]>([]);
  const { setIsLoading, isLoading } = useLoading();

  const router = useRouter();

  const handleSubmit = async (
    values: Noticeboard) => {
    setIsLoading(true);
    try {
      await createNoticeboard({ ...values })
        .then((response) => {
          toast.success(response.data.message, {
            duration: 1500,
            position: "top-right",
          });
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

  const loadSubCategory = (main_category_id: number) => {

    console.log(main_category_id)

    const sub_list = originalCategory.filter((list) => list.parent !== null && list.parent.id === main_category_id);

    console.log(sub_list)
    setSubCategory(sub_list.map((param: { id: number; name: string }) => ({
      value: param.id,  // Use string values for consistency
      text: param.name,
    })));


  }

  useEffect(() => {

    const fetchCategories = async () => {
      await getParentMastersByType('category').then((res) => {
        const { data } = res;
        setOriginalCategory(data);
        const categories = data.filter((item) => item.parent == null);

        const paramOptions = categories?.map((param: { id: number; name: string }) => ({
          value: param.id,  // Use string values for consistency
          text: param.name,
        }));
        setCategory(paramOptions)
      })
    }

    fetchCategories();

  }, [subCategory]);

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Notice Management" pageName="Create Notice" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{
                question: "",
                answer: "",
                category_id: "",
                sub_categories: "",
                priority: "",
                is_active: true,
              }}
              validationSchema={Yup.object({
                question: Yup.string()
                  .required("Question is required")
                  .min(3, "Must be at least 3 characters"),
                answer: Yup.string()
                  .required("Answer is required")
                  .min(3, "Must be at least 3 characters"),
                category_id: Yup.string().required("Select Category"),
                // sub_categories: Yup.string().required("Select Sub-Categories"),
                priority: Yup.string().required("Select Priority"),
              })}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, values }) => {
                console.log(errors);
                return (
                  <Form>
                    <div className="-mt-2 space-y-4 p-4 md:p-5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <InputTextArea
                            name="question"
                            label="Question"
                            placeholder="Write your question here....." />

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
                            onValueChange={(value: string) => loadSubCategory(Number(value))}
                          //  onValueChange={(value: string) => setFieldValue("organizationId", value)}
                          />
                        </div>
                        {subCategory.length > 0 &&
                          <div className="w-full xl:w-1/2">
                            <SelectDropDown
                              label="Sub Category"
                              name="sub_categories"
                              options={subCategory}
                            />
                          </div>
                        }
                        <div className="w-full xl:w-1/2">
                          <SelectDropDown
                            label="Priority"
                            name="priority"
                            options={[{
                              value: "LOW",
                              text: "Low"
                            },
                            {
                              value: "MEDIUM",
                              text: "Medium"
                            },
                            {
                              value: "HIGH",
                              text: "High"
                            }]}
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
