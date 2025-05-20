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
  phone_no: number;
  time_stamp: number;
  calls: string;
  parent: string;
  remarks: string;
  complain: string;
  calibration_service_id: number;
}

interface Parameters {
  value: number;
  text: string;
}

const calls: React.FC = () => {
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
    values: { code: string; calls: string; active: string },
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
        if (data.callsCode == 200) {
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
            (param: { id: number; calls: string }) => ({
              value: param.id.toString(), // Use string values for consistency
              text: param.calls,
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
      <Breadcrumb pageName="Calls" />
      <div className="flex flex-col gap-2">
        <ToastContainer />
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <div
            className={`fixed inset-0 z-9 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-black bg-opacity-50 md:inset-0 ${
              showModal === "block" ? "block" : "hidden"
            }`}
          >
            <div className="max-h-full w-full max-w-5xl rounded-md bg-white p-6 shadow-lg">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  code: editingGroup?.code || "",
                  calls: editingGroup?.calls || "",
                  active: editingGroup?.active || "Y",
                  calibration_service_id: editingGroup?.id || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is required"),
                  calls: Yup.string().required("calls is required"),
                  calibration_service_id: Yup.number().required(
                    "calls parameter is required",
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
                        label="calls"
                        name="calls"
                        type="text"
                        placeholder="Enter calls"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Select Parent
                      </label>
                      <select
                        id="parent"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      >
                        <option selected>Choose a Parent</option>
                        <option value="US">Parent 1</option>
                        <option value="CA">Parent 2</option>
                        <option value="FR">Parent 3</option>
                        <option value="DE">Parent 4</option>
                      </select>
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

export default calls;
