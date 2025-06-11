/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import SelectDropDown from "@/components/Inputs/Select";

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

interface CallHistory {
  id: number;
  call_id: number;
  changed_at: number;
  changed_by: string;
  query: string;
  remarks: string;
  category: string;
  subcategory: string;
}

const Calls = () => {
  const [itemGroup, setItemGroup] = useState<callGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<callGroup | null>(null);
  const [showModal, setShowModal] = useState("hidden");
  const [modalType, setModalType] = useState<"form" | "view">("form");
  const [selectedCall, setSelectedCall] = useState<callGroup | null>(null);
  const [callHistory, setCallHistory] = useState<CallHistory[]>([]);
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

  // Demo call history data
  const demoCallHistory: CallHistory[] = [
    {
      id: 1,
      call_id: 1,
      changed_at: Date.now() - 3600000,
      changed_by: "Admin User",
      query: "Product not working properly",
      remarks: "Needs troubleshooting",
      category: "Technical",
      subcategory: "Hardware",
    },
    {
      id: 2,
      call_id: 1,
      changed_at: Date.now() - 7200000,
      changed_by: "System",
      query: "Initial query submitted",
      remarks: "Waiting for assignment",
      category: "Technical",
      subcategory: "Hardware",
    },

    {
      id: 3,
      call_id: 1,
      changed_at: Date.now() - 7200000,
      changed_by: "System",
      query: "Initial query submitted",
      remarks: "Waiting for assignment",
      category: "Technical",
      subcategory: "Hardware",
    },

    {
      id: 4,
      call_id: 1,
      changed_at: Date.now() - 7200000,
      changed_by: "System",
      query: "Initial query submitted",
      remarks: "Waiting for assignment",
      category: "Technical",
      subcategory: "Hardware",
    },

    {
      id: 5,
      call_id: 1,
      changed_at: Date.now() - 7200000,
      changed_by: "System",
      query: "Initial query submitted",
      remarks: "Waiting for assignment",
      category: "Technical",
      subcategory: "Hardware",
    },
  ];

  const toggleModal = (type: "form" | "view" = "form") => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setModalType(type);
    if (type === "form") {
      setIsEditing(false);
      setEditingGroup(null);
    }
  };

  const loadItemGroup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setItemGroup(demoData);
      setIsLoading(false);
    }, 500);
  };

  const loadCallHistory = (callId: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCallHistory(
        demoCallHistory.filter((history) => history.call_id === callId),
      );
      setIsLoading(false);
    }, 300);
  };

  const handleView = (call: callGroup) => {
    setSelectedCall(call);
    loadCallHistory(call.id);
    toggleModal("view");
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
    setModalType("form"); // Set modal type first
    setShowModal("block"); // Then show modal
    // toggleModal("form");
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
          {modalType === "form" ? (
            <div
              className={`fixed inset-0 z-9 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-black bg-opacity-50 md:inset-0 ${
                showModal === "block" ? "block" : "hidden"
              }`}
            >
              <div className="max-h-full w-full rounded-md bg-white p-6 shadow-lg">
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
                    subcategory: Yup.string().required(
                      "Subcategory is required",
                    ),
                  })}
                  onSubmit={(values, { resetForm }) =>
                    handleSubmit(values, resetForm)
                  }
                >
                  {({ isSubmitting }) => (
                    <Form className="-mt-2 space-y-4 p-4 md:p-5">
                      <h2 className="h2">Editing Call Management </h2>
                      <div className="rounded border border-gray-300 p-5">
                        <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Timestamp
                              </label>
                              <div className="mt-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600">
                                {editingGroup
                                  ? new Date(
                                      editingGroup.time_stamp,
                                    ).toLocaleString()
                                  : "New call (will be timestamped on save)"}
                              </div>
                            </div>
                          </div>
                          <div className="w-full xl:w-1/2 ">
                            <label className="block text-sm font-medium text-gray-700">
                              Phone No
                            </label>
                            <div className="border-gray-300 bg-gray-100 text-sm text-black">
                              <Input
                                label={`Phone number`}
                                name="phone_no"
                                type="number"
                                placeholder="Enter phone number"
                                disabled={isEditing}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <SelectDropDown
                              label="Select Agent"
                              name="agent"
                              options={[
                                { value: "John Doe", text: "John Doe" },
                                { value: "Jane Smith", text: "Jane Smith" },
                                { value: "Mike Johnson", text: "Mike Johnson" },
                                {
                                  value: "Sarah Williams",
                                  text: "Sarah Williams",
                                },
                              ]}
                            />
                          </div>
                          <div className="w-full xl:w-1/2">
                            <SelectDropDown
                              label="Select Dzongkhag"
                              name="dzongkhag"
                              options={[
                                { value: "Bumthang", text: "Bumthang" },
                                {
                                  value: "SamdrupJongkhar",
                                  text: "SamdrupJongkhar",
                                },
                                { value: "Tsirang", text: "Tsirang" },
                                {
                                  value: "Thimphu ",
                                  text: "Thimphu ",
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="mb-2 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/3">
                            <SelectDropDown
                              label="Select Category"
                              name="category" // Changed from "subcategory" to "category"
                              options={[
                                { value: "Technical", text: "Technical" },
                                { value: "Billing", text: "Billing" },
                                { value: "Account", text: "Account" },
                              ]}
                            />
                          </div>

                          <div className="w-full xl:w-1/3">
                            <SelectDropDown
                              label="Select Sub-Category"
                              name="subcategory" // Changed from "category" to "subcategory"
                              options={[
                                { value: "Hardware", text: "Hardware" },
                                { value: "Software", text: "Software" },
                                { value: "Overcharge", text: "Overcharge" },
                                { value: "Cancellation", text: "Cancellation" },
                              ]}
                            />
                          </div>

                          <div className="w-full xl:w-1/3">
                            <SelectDropDown
                              label="Select Status"
                              name="status"
                              options={[
                                { value: "Pending", text: "Pending" },
                                { value: "In Progress", text: "In-progress" },
                                { value: "on-Hold", text: "on-Hold" },
                                { value: "Completed", text: "Completed" },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                          <div className="w-full xl:w-1/2">
                            <label htmlFor="query">Query</label>
                            <Field
                              as="textarea"
                              className="focus:gray-300 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1"
                              placeholder="Enter your message..."
                              rows={4}
                              name="query"
                              id="query"
                            />
                          </div>

                          <div className="w-full xl:w-1/2">
                            <label htmlFor="remarks">Remarks</label>
                            <Field
                              as="textarea"
                              className="focus:gray-300 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1"
                              placeholder="Enter your message..."
                              rows={4}
                              name="remarks"
                              id="remarks"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between md:col-span-2">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="hover:bg-black-700 rounded bg-red-700 px-4 py-2 text-white"
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleModal("form")}
                            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          ) : (
            <div
              className={`fixed inset-0 z-9 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-black bg-opacity-50 md:inset-0 ${
                showModal === "block" ? "block" : "hidden"
              }`}
            >
              <div className="w-full max-w-5xl rounded-md bg-white shadow-lg">
                {/* Header with title and close button */}
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                    Call History Timeline
                  </h3>
                  <button
                    onClick={() => toggleModal("view")}
                    className="rounded bg-gray-500 px-3 py-1 text-xs text-white hover:bg-gray-600 sm:px-4 sm:py-1.5 sm:text-sm"
                  >
                    Close
                  </button>
                </div>

                {/* Scrollable content area */}
                <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                  {isLoading ? (
                    <p className="text-center text-xs text-gray-500 sm:text-sm">
                      Loading history...
                    </p>
                  ) : callHistory.length > 0 ? (
                    <div className="space-y-3">
                      {callHistory.map((history) => (
                        <div key={history.id} className="relative pl-4 sm:pl-6">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-3 h-2 w-2 rounded-full bg-blue-500 sm:top-4 sm:h-3 sm:w-3"></div>
                          {/* Timeline line */}
                          <div className="absolute left-[3px] top-5 h-full w-0.5 bg-gray-200 sm:left-[5px] sm:top-7"></div>

                          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                            {/* Timestamp row */}
                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:gap-0">
                              <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                {new Date(
                                  history.changed_at,
                                ).toLocaleDateString()}
                                <span className="ml-2 text-gray-500">
                                  {new Date(
                                    history.changed_at,
                                  ).toLocaleTimeString()}
                                </span>
                              </span>
                              <span className="text-xs font-medium text-gray-700 sm:text-sm">
                                Updated by: {history.changed_by}
                              </span>
                            </div>

                            {/* Category/Subcategory row */}
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
                              <div>
                                <span className="font-medium text-gray-700">
                                  Category:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {history.category}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">
                                  Subcategory:{" "}
                                </span>
                                <span className="text-gray-600">
                                  {history.subcategory}
                                </span>
                              </div>
                            </div>

                            {/* Query/Remarks section */}
                            <div className="mt-3 space-y-2 text-xs sm:text-sm">
                              <div>
                                <p className="font-medium text-gray-700">
                                  Query
                                </p>
                                <p className="line-clamp-3 text-gray-600">
                                  {history.query}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700">
                                  Remarks
                                </p>
                                <p className="line-clamp-3 text-gray-600">
                                  {history.remarks}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-gray-500 sm:text-sm">
                      No history available
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable
              columns={columns(handleEdit, handleDelete, handleView)}
              data={itemGroup}
              handleAdd={() => toggleModal("form")}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Calls;
