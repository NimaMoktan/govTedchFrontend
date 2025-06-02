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

interface callGroup {
  id: number;
  phone_no: number;
  time_stamp: number;
  query: string;
  category: string;
  subcategory: string;
  status: string;
  agent: string;
  remarks: string;
  active: string;
}

const Calls = () => {
  const [itemGroup, setItemGroup] = useState<callGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<callGroup | null>(null);
  const [showModal, setShowModal] = useState("hidden");
  const router = useRouter();

  // Demo data
  const demoData: callGroup[] = [
    {
      id: 1,
      phone_no: 1234567890,
      time_stamp: Date.now(),
      query: "Product not working properly",
      category: "Technical",
      subcategory: "Hardware",
      status: "Pending",
      agent: "John Doe",
      remarks: "Needs troubleshooting",
      active: "Y",
    },
    {
      id: 2,
      phone_no: 9876543210,
      time_stamp: Date.now() - 3600000,
      query: "Billing discrepancy",
      category: "Billing",
      subcategory: "Overcharge",
      status: "In Progress",
      agent: "Jane Smith",
      remarks: "Customer needs refund",
      active: "Y",
    },
    {
      id: 3,
      phone_no: 5551234567,
      time_stamp: Date.now() - 86400000,
      query: "Software installation issue",
      category: "Technical",
      subcategory: "Software",
      status: "Assigned",
      agent: "Mike Johnson",
      remarks: "Escalated to L2 support",
      active: "Y",
    },
    {
      id: 4,
      phone_no: 8885551212,
      time_stamp: Date.now() - 172800000,
      query: "Account cancellation",
      category: "Account",
      subcategory: "Cancellation",
      status: "Completed",
      agent: "Sarah Williams",
      remarks: "Retention offer made",
      active: "N",
    },
  ];

  const toggleModal = () => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setIsEditing(false);
    setEditingGroup(null);
  };

  const loadItemGroup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setItemGroup(demoData);
      setIsLoading(false);
    }, 500);
  };

  const handleSubmit = (values: callGroup, resetForm: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      if (isEditing && editingGroup) {
        setItemGroup((prev) =>
          prev.map((item) =>
            item.id === editingGroup.id ? { ...item, ...values } : item,
          ),
        );
        toast.success("Call updated successfully", { position: "top-right" });
      } else {
        const newItem = {
          id: Math.max(...demoData.map((item) => item.id)) + 1,
          phone_no: values.phone_no,
          time_stamp: Date.now(),
          query: values.query,
          category: values.category,
          subcategory: values.subcategory,
          status: values.status,
          agent: values.agent,
          remarks: values.remarks,
          active: values.active,
        };
        setItemGroup((prev) => [...prev, newItem]);
        toast.success("Call created successfully", { position: "top-right" });
      }

      setIsLoading(false);
      toggleModal();
      resetForm();
    }, 1000);
  };

  const handleDelete = (itemGroup: callGroup) => {
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
        setTimeout(() => {
          setItemGroup((prev) =>
            prev.filter((item) => item.id !== itemGroup.id),
          );
          toast.success("Call deleted successfully", {
            position: "top-right",
            autoClose: 1000,
          });
        }, 500);
      }
    });
  };

  const handleEdit = (service: callGroup) => {
    setEditingGroup(service);
    setIsEditing(true);
    setShowModal("block");
  };

  useEffect(() => {
    loadItemGroup();
  }, []);

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
                  id: editingGroup?.id || 0,
                  phone_no: editingGroup?.phone_no || 0,
                  time_stamp: editingGroup?.time_stamp || Date.now(),
                  query: editingGroup?.query || "",
                  category: editingGroup?.category || "",
                  subcategory: editingGroup?.subcategory || "",
                  status: editingGroup?.status || "Pending",
                  agent: editingGroup?.agent || "",
                  remarks: editingGroup?.remarks || "",
                  active: editingGroup?.active || "Y",
                }}
                validationSchema={Yup.object({
                  phone_no: Yup.number().required("Phone number is required"),
                  query: Yup.string().required("Query is required"),
                  category: Yup.string().required("Category is required"),
                  subcategory: Yup.string().required("Subcategory is required"),
                })}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                {({ isSubmitting }) => (
                  <Form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        label="Phone Number"
                        name="phone_no"
                        type="number"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Input
                        label="Query"
                        name="query"
                        type="text"
                        placeholder="Enter query"
                      />
                    </div>
                    <div>
                      <Input
                        label="Category"
                        name="category"
                        type="text"
                        placeholder="Enter category"
                      />
                    </div>
                    <div>
                      <Input
                        label="Subcategory"
                        name="subcategory"
                        type="text"
                        placeholder="Enter subcategory"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Status
                      </label>
                      <select
                        name="status"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <Input
                        label="Agent"
                        name="agent"
                        type="text"
                        placeholder="Enter agent name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Remarks"
                        name="remarks"
                        type="text"
                        placeholder="Enter remarks"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Active
                      </label>
                      <select
                        name="active"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </select>
                    </div>

                    <div className="flex justify-between md:col-span-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable
              columns={columns(handleEdit, handleDelete)}
              data={itemGroup}
              handleAdd={toggleModal}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Calls;
