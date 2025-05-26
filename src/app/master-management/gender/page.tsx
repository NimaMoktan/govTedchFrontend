/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface GenderItem {
  id: number;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

const gender: React.FC = () => {
  const [genderList, setGenderList] = useState<GenderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
  const [isEditing, setIsEditing] = useState(false);
  const [editingGender, setEditingGender] = useState<GenderItem | null>(null);
  const [token, setToken] = useState<string | null>("");
  const router = useRouter();

  // Sample data with 5 new random entries
  const sampleData: GenderItem[] = [
    {
      id: 1,
      code: "MALE",
      name: "Male",
      description: "Male gender",
      is_active: true,
      created_at: "2023-01-15T10:30:00Z",
    },
    {
      id: 2,
      code: "FEMALE",
      name: "Female",
      description: "Female gender",
      is_active: true,
      created_at: "2023-01-16T11:45:00Z",
    },
    {
      id: 3,
      code: "OTHER",
      name: "Other",
      description: "Other gender identities",
      is_active: true,
      created_at: "2023-02-20T09:15:00Z",
    },
    {
      id: 4,
      code: "NONBIN",
      name: "Non-binary",
      description: "Non-binary gender",
      is_active: true,
      created_at: "2023-03-10T14:20:00Z",
    },
    {
      id: 5,
      code: "UNKWN",
      name: "Unknown",
      description: "Gender not specified",
      is_active: false,
      created_at: "2023-04-05T16:40:00Z",
    },
  ];

  const toggleModal = () => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setIsEditing(false);
    setEditingGender(null);
  };

  const loadGenderList = (storeToken: string) => {
    setIsLoading(true);
    // Simulating API call with sample data
    setTimeout(() => {
      setGenderList(sampleData);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (
    values: { code: string; name: string },
    resetForm: () => void,
  ) => {
    // Check for duplicate code
    const duplicateCode = genderList.some(
      (item) =>
        item.code.toLowerCase() === values.code.toLowerCase() &&
        (!isEditing || item.id !== editingGender?.id),
    );

    if (duplicateCode) {
      toast.error("Gender code already exists", { position: "top-right" });
      return;
    }

    // Check for duplicate name
    const duplicateName = genderList.some(
      (item) =>
        item.name.toLowerCase() === values.name.toLowerCase() &&
        (!isEditing || item.id !== editingGender?.id),
    );

    if (duplicateName) {
      toast.error("Gender name already exists", { position: "top-right" });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isEditing && editingGender) {
        // Update existing item
        setGenderList((prev) =>
          prev.map((item) =>
            item.id === editingGender.id
              ? {
                  ...item,
                  code: values.code,
                  name: values.name,
                }
              : item,
          ),
        );
      } else {
        // Add new item
        const newItem: GenderItem = {
          id: Math.max(...genderList.map((item) => item.id)) + 1,
          code: values.code,
          name: values.name,
          description: "", // Empty description as per requirements
          is_active: true, // Default to active
          created_at: new Date().toISOString(),
        };
        setGenderList((prev) => [...prev, newItem]);
      }

      Swal.fire({
        icon: "success",
        title: isEditing
          ? "Gender updated successfully"
          : "Gender created successfully",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      toggleModal();
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = (genderItem: GenderItem) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setGenderList((prev) =>
            prev.filter((item) => item.id !== genderItem.id),
          );
          toast.success("Gender deleted successfully", {
            position: "top-right",
            autoClose: 1000,
          });
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  const handleEdit = (genderItem: GenderItem) => {
    setEditingGender(genderItem);
    setIsEditing(true);
    setShowModal("block");
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    loadGenderList(localStorage.getItem("token") || "");
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gender Management" />
      <div className="flex flex-col gap-2">
        <ToastContainer />
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <div
            className={`fixed inset-0 z-9 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-black bg-opacity-50 md:inset-0 ${
              showModal === "block" ? "block" : "hidden"
            }`}
          >
            <div className="relative w-full max-w-5xl rounded-md bg-white p-6 shadow-lg">
              <button
                onClick={toggleModal}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <Formik
                enableReinitialize={true}
                initialValues={{
                  code: editingGender?.code || "",
                  name: editingGender?.name || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string()
                    .required("Code is required")
                    .max(10, "Code must be 10 characters or less"),
                  name: Yup.string()
                    .required("Gender name is required")
                    .max(50, "Name must be 50 characters or less"),
                })}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <Input
                        label="Code"
                        name="code"
                        type="text"
                        placeholder="Enter Code"
                        disabled={isEditing}
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Gender Name"
                        name="name"
                        type="text"
                        placeholder="Enter gender name"
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-500"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                      <Button
                        type="button"
                        onClick={toggleModal}
                        className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable
              columns={columns(handleEdit, handleDelete)}
              data={genderList}
              handleAdd={toggleModal}
              addButtonText="Add New Gender"
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default gender;
