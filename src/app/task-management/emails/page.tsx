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
  emails: string;
  Query: string;
  query_Category: string;
  query_SubCategory: string;
  remarks: string;
}

interface Parameters {
  value: number;
  text: string;
}

const emails: React.FC = () => {
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
    values: { code: string; emails: string; active: string },
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
        if (data.emailsCode == 200) {
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
            (param: { id: number; emails: string }) => ({
              value: param.id.toString(), // Use string values for consistency
              text: param.emails,
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
      <Breadcrumb pageName="emails" />
      <div className="flex flex-col gap-2">
        <ToastContainer />
        <div className="rounded-sm border bg-white p-5 shadow-sm">
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

export default emails;
