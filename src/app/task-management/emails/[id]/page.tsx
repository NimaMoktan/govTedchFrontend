"use client";
import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Email } from "@/types/Email";
import { getEmail, updateEmail } from "@/services/EmailService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/Inputs/Input";
import SelectDropDown from "@/components/Inputs/Select";
import TextInput from "@/components/Inputs/Input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Options } from "@/interface/Options";
import { getParentMastersByType } from "@/services/master/MasterService";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function EmailEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Options[]>([]);
  const [subCategory, setSubCategory] = useState<Options[]>([]);
  const [gender, setGender] = useState<Options[]>([]);
  const [dzongkhag, setDzongkhag] = useState<Options[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getEmail(params.id);
        setInitialValues(response.data);
      } catch (error) {
        toast.error("Failed to load email");
        router.push("/task-management/emails");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const handleSubmit = async (values: Email) => {
    try {
      await updateEmail(values.id, values);
      toast.success("Email updated successfully");
      router.push("/task-management/emails");
    } catch (error) {
      toast.error("Failed to update email");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getParentMastersByType("category");
        const { data } = res;
        const filteredCategories = data?.filter(
          (item: { type: string }) => item.type === "category",
        );
        setCategory(filteredCategories || []);
      } catch (err) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!initialValues)
    return <div className="p-8 text-center">Email not found</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Email" />
      <Card>
        <CardContent className="pt-6">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object({
              email: Yup.string().required("Required").email("Invalid email"),
              query: Yup.string().required("Required"),
              status: Yup.string().required("Required"),
              agent: Yup.string().required("Required"),
              category_id: Yup.string().required("Required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-4">
                <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input label="Email" name="email" type="email" />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Input
                      label="Created At"
                      name="created_at"
                      type="text"
                      disabled
                      value={
                        values.created_at
                          ? format(
                              new Date(values.created_at),
                              "MMM dd, yyyy h:mm a",
                            )
                          : "N/A"
                      }
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <SelectDropDown
                      label="Status"
                      name="status"
                      options={statusOptions}
                    />
                  </div>
                </div>
                <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input label="Agent" name="agent" />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <SelectDropDown
                      label="Category"
                      name="category_id"
                      options={category}
                    />
                  </div>
                </div>
                <TextInput label="Query" name="query" rows={4} />
                <TextInput label="Remarks" name="remarks" rows={4} />
                <div className="flex justify-end gap-4 pt-4">
                  <Button type="submit">Save Changes</Button>
                  <Link href="/task-management/emails">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
}
