/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { BiPlusCircle } from "react-icons/bi";
import { BsTrash, BsPencil } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/Inputs/Input";
import Loader from "@/components/common/Loader";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface CalibrationGroup {
  id?: number;
  calibration_group_id?: number;
  code: string;
  description: string;
  active: string;
  calibration_service_id: number;
}

interface CalibrationService {
  id: number;
  code: string;
  description: string;
}

const CalibrationGroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<CalibrationGroup[]>([]);
  const [services, setServices] = useState<CalibrationService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CalibrationGroup | null>(null);
  const [token, setToken] = useState<string | null>();

  const toggleModal = () => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setIsEditing(false);
    setEditingGroup(null);
  };

  const loadGroups = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibrationGroup/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setGroups(data.data))
      .catch((err) => toast.error("Failed to load groups", { position: "top-right" }))
      .finally(() => setIsLoading(false));
  };

  const loadServices = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibrationService/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setServices(data.data))
      .catch((err) => toast.error("Failed to load services", { position: "top-right" }));
  };

  const handleSubmit = (values: CalibrationGroup, resetForm: () => void) => {
    setIsLoading(true);

    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/calibrationGroup/${editingGroup?.id}/update`
      : `${process.env.NEXT_PUBLIC_API_URL}/calibrationGroup/`;

    const method = isEditing ? "PUT" : "POST";
    console.log({
        "code": values.code,
        "description": values.description,
        "active": values.active,
        "calibration_service_id": values.calibration_service_id
            })

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  "code": values.code,
  "description": values.description,
  "active": values.active,
  "calibration_service_id": values.calibration_service_id
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success(
            isEditing ? "Group updated successfully" : "Group created successfully",
            { position: "top-right" }
          );
          loadGroups();
          toggleModal();
          resetForm();
        } else {
          throw new Error("Failed to save group");
        }
      })
      .catch((err) => toast.error(err.message, { position: "top-right" }))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (id: number) => {
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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/calibrationGroup/${id}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              toast.success("Group deleted successfully", { position: "top-right" });
              loadGroups();
            } else {
              throw new Error("Failed to delete group");
            }
          })
          .catch((err) => toast.error(err.message, { position: "top-right" }));
      }
    });
  };

  const handleEdit = (group: CalibrationGroup) => {
    setEditingGroup(group);
    setIsEditing(true);
    setShowModal("block");
  };

  useEffect(() => {
    const storeToken = localStorage.getItem("token")
    setToken(storeToken)
    if (token) {
      loadGroups();
      loadServices();
    }
  }, [token]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Calibration Group Management" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border bg-white p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h1>Calibration Groups</h1>
            <button
              onClick={toggleModal}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <BiPlusCircle size={20} />
              Add Group
            </button>
          </div>

          {/* Modal */}
          <div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
              showModal === "block" ? "block" : "hidden"
            }`}
          >
            <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
              <Formik
                initialValues={{
                  code: editingGroup?.code || "",
                  description: editingGroup?.description || "",
                  active: editingGroup?.active || "true",
                  calibration_service_id: editingGroup?.calibration_service_id || "",
                }}
                validationSchema={Yup.object({
                  code: Yup.string().required("Code is required"),
                  description: Yup.string().required("Description is required"),
                  calibration_service_id: Yup.number()
                    .typeError("Calibration Service is required")
                    .required("Calibration Service is required"),
                  active: Yup.string().required("Status is required"),
                })}
                onSubmit={(values, { resetForm }) => handleSubmit({ ...values, calibration_service_id: Number(values.calibration_service_id) }, resetForm)}
              >
                {({ setFieldValue, values, errors, touched }) => (
                  <Form>
                    <div className="mb-4">
                      <Input label="Code" name="code" type="text" placeholder="Enter code" />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Description"
                        name="description"
                        type="text"
                        placeholder="Enter description"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="calibration_service_id">Calibration Service</label>
                      <select
                        name="calibration_service_id"
                        id="calibration_service_id"
                        className="w-full px-3 py-2 border rounded"
                        onChange={(e) => setFieldValue("calibration_service_id", e.target.value)}
                        value={values.calibration_service_id}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.code} - {service.description}
                          </option>
                        ))}
                      </select>
                      {errors.calibration_service_id && touched.calibration_service_id && (
                        <div className="text-red-500 text-sm">{errors.calibration_service_id}</div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="active">Active</label>
                      <select
                        name="active"
                        id="active"
                        className="w-full px-3 py-2 border rounded"
                        onChange={(e) => setFieldValue("active", e.target.value)}
                        value={values.active}
                      >
                        <option value="Y">Active</option>
                        <option value="N">Inactive</option>
                      </select>
                      {errors.active && touched.active && (
                        <div className="text-red-500 text-sm">{errors.active}</div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={toggleModal}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Code</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Active</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <Loader />
                    </td>
                  </tr>
                ) : (
                  groups?.map((group, index) => (
                    <tr key={group.id} className="text-center">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{group.code}</td>
                      <td className="border px-4 py-2">{group.description}</td>
                    
                      <td className="border px-4 py-2">
                        {group.active === "true" ? "Active" : "Inactive"}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleEdit(group)}
                            className="text-blue-500 hover:underline"
                          >
                            <BsPencil />
                          </button>
                          <button
                            onClick={() => group.id !== undefined && handleDelete(group.id)}
                            className="text-red-500 hover:underline"
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CalibrationGroupManagement;
