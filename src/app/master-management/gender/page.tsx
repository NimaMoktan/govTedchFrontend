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
import Select from "@/components/Inputs/Select";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";

interface CalibrationGroupItem {
  id: number;
  code: string;
  gender: string;
  active: string;
  calibration_service_id: number;
}

interface Parameters {
  value: number;
  text: string;
}

const gender: React.FC = () => {
  const [itemGroup, setItemGroup] = useState<CalibrationGroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CalibrationGroupItem | null>(
    null,
  );
  const [token, setToken] = useState<string | null>("");
  const [parameter, setParameter] = useState<Parameters[]>([]);
  const router = useRouter();

  const toggleModal = () => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setIsEditing(false);
    setEditingGroup(null);
  };

  const loadItemGroup = (storeToken: string) => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/calibrationGroup/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storeToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data != null) {
          setItemGroup(data.data);
        } else {
          setItemGroup([]);
        }
        setIsLoading(false);
      })
      .catch((err) => toast.error(err.message, { position: "top-right" }));
  };

  const handleSubmit = (
    values: { code: string; gender: string; active: string },
    resetForm: () => void,
  ) => {
    setIsLoading(true);

    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationGroup/${editingGroup?.id}/update`
      : `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationGroup/`;

    const method = isEditing ? "POST" : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: isEditing
              ? "Calibration updated successfully"
              : "Calibration created successfully",
            timer: 2000,
            showConfirmButton: false,
            position: "top-end", // Adjust position if needed
            toast: true,
          });
          return res.json();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error! Please try again",
            timer: 2000,
            showConfirmButton: false,
            position: "top-end", // Adjust position if needed
            toast: true,
          }).then(() => {
            router.push("master-management/calibration");
          });
          throw new Error("Failed to save service");
        }
      })
      .then((response) => {
        toast.success(response.messsage, {
          position: "top-right",
          autoClose: 1000,
        });
        if (token) {
          loadItemGroup(token);
        } else {
          toast.error("Token is missing", { position: "top-right" });
        }
        toggleModal();
        resetForm();
      })
      .catch((err) =>
        toast.error(err.message, { position: "top-right", autoClose: 1000 }),
      );
  };

  const handleDelete = (itemGroup: CalibrationGroupItem) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationGroup/${itemGroup.id}/delete`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const { data } = response;
        if (data.statusCode == 200) {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 1000,
          });

          setTimeout(() => {
            if (token) {
              loadItemGroup(token);
            }
          }, 2000);
        } else {
          toast.error(data.message, { position: "top-right", autoClose: 1000 });
        }
      }
    });
  };

  const handleEdit = (service: CalibrationGroupItem) => {
    console.log(service);
    setEditingGroup(service);
    setIsEditing(true);
    setShowModal("block");
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/calibrationService/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data != null) {
          const list = data.data;

          const paramOptions = list?.map(
            (param: { id: number; gender: string }) => ({
              value: param.id.toString(), // Use string values for consistency
              text: param.gender,
            }),
          );

          setParameter([
            { value: "Select Parameter", text: "Select Parameter" },
            ...paramOptions,
          ]);
        } else {
          setParameter([]);
        }
        setIsLoading(false);
      })
      .catch((err) => toast.error(err.message, { position: "top-right" }));
    loadItemGroup(localStorage.getItem("token") || "");
  }, [isEditing]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Gender" />
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
              <div className="mb-6 border-b text-center ">
                <h2>Add New Gender</h2>
              </div>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  code: editingGroup?.code || "",
                  gender: editingGroup?.gender || "",
                  active: editingGroup?.active || "Y",
                  calibration_service_id: editingGroup?.id || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is required"),
                  gender: Yup.string().required("Gender is required"),
                  calibration_service_id: Yup.number().required(
                    "Gender parameter is required",
                  ),
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
                        placeholder="Enter code"
                        disabled={isEditing}
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Gender"
                        name="gender"
                        type="text"
                        placeholder="Enter Gender"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-red-700 px-4 py-2 text-white hover:bg-red-500"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        onClick={toggleModal}
                        className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <DataTable
            columns={columns(handleEdit, handleDelete)}
            data={itemGroup}
            handleAdd={toggleModal}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default gender;
