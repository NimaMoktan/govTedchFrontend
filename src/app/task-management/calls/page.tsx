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
    loadCallHistory(service.id);
    toggleModal("form");
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
                    subcategory: Yup.string().required(
                      "Subcategory is required",
                    ),
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

                      {/* History Section */}
                      {isEditing && (
                        <div className="md:col-span-2">
                          <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Call History
                          </h3>
                          <div className="space-y-4">
                            {callHistory.length > 0 ? (
                              callHistory.map((history) => (
                                <div key={history.id} className="relative pl-6">
                                  {/* Timeline dot */}
                                  <div className="absolute left-0 top-4 h-3 w-3 rounded-full bg-blue-500"></div>
                                  {/* Timeline line */}
                                  <div className="absolute left-[5px] top-7 h-full w-0.5 bg-gray-200"></div>

                                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-gray-900">
                                        {new Date(
                                          history.changed_at,
                                        ).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          history.changed_at,
                                        ).toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                      <p className="font-medium">
                                        Updated by: {history.changed_by}
                                      </p>
                                    </div>
                                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                                      <div>
                                        <p className="font-medium text-gray-700">
                                          Query:
                                        </p>
                                        <p className="text-gray-600">
                                          {history.query}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">
                                          Remarks:
                                        </p>
                                        <p className="text-gray-600">
                                          {history.remarks}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">
                                          Category:
                                        </p>
                                        <p className="text-gray-600">
                                          {history.category}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700">
                                          Subcategory:
                                        </p>
                                        <p className="text-gray-600">
                                          {history.subcategory}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">
                                No history available
                              </p>
                            )}
                          </div>
                        </div>
                      )}

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
                          onClick={() => toggleModal("form")}
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
          ) : (
            <div
              className={`fixed inset-0 z-9 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center bg-black bg-opacity-50 md:inset-0 ${
                showModal === "block" ? "block" : "hidden"
              }`}
            >
              <div className="max-h-full w-full max-w-5xl rounded-md bg-white p-6 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-xl font-bold">Call Details</h2>
                  <button
                    onClick={() => toggleModal("view")}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {selectedCall && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.phone_no}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timestamp
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedCall.time_stamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Query
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.query}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.category}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subcategory
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.subcategory}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.status}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Agent
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.agent}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Remarks
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedCall.remarks}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Call History</h3>
                  <div className="max-h-60 overflow-y-auto rounded border p-2">
                    {isLoading ? (
                      <p className="text-center text-sm text-gray-500">
                        Loading history...
                      </p>
                    ) : callHistory.length > 0 ? (
                      callHistory.map((history) => (
                        <div key={history.id} className="mb-3 border-b pb-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {new Date(history.changed_at).toLocaleString()}
                            </span>
                            <span className="text-gray-600">
                              Changed by: {history.changed_by}
                            </span>
                          </div>
                          <div className="mt-1">
                            {history.changes.map((change, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">
                                  {change.field}:
                                </span>{" "}
                                <span className="text-red-500 line-through">
                                  {change.old_value || "empty"}
                                </span>{" "}
                                →{" "}
                                <span className="text-green-600">
                                  {change.new_value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No history available
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => toggleModal("view")}
                    className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                  >
                    Close
                  </button>
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
