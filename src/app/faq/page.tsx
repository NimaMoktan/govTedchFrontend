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
import SelectDropDown from "@/components/Inputs/Select";
import { getRoleDropdowns } from "@/services/RoleService";

interface FAQ {
  id: number;
  code: string;
  question: string;
  answer: string;
  category: string;
  subCategory: string;
}

interface Category {
  name: string;
  subCategories: string[];
}

const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState<"hidden" | "block">("hidden");
  const [isEditing, setIsEditing] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [token, setToken] = useState<string | null>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [roleList, setRoleList] = useState<Options[]>([]);
  const router = useRouter();

  // Temporary data for demonstration
  const tempFaqs: FAQ[] = [
    {
      id: 1,
      code: "FAQ001",
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'.",
      category: "Account",
      subCategory: "Login",
    },
    {
      id: 2,
      code: "FAQ002",
      question: "Where can I find my order history?",
      answer: "Navigate to 'My Account' then 'Order History'.",
      category: "Orders",
      subCategory: "Tracking",
    },
    {
      id: 3,
      code: "FAQ003",
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, and bank transfers.",
      category: "Payments",
      subCategory: "Methods",
    },
    {
      id: 4,
      code: "FAQ004",
      question: "How to update account information?",
      answer: "Go to 'My Account' then 'Profile Settings'.",
      category: "Account",
      subCategory: "Profile",
    },
  ];

  // Sample categories and subcategories
  const sampleCategories: Category[] = [
    {
      name: "Account",
      subCategories: ["Login", "Profile", "Security", "Registration"],
    },
    {
      name: "Orders",
      subCategories: ["Tracking", "Cancellation", "Returns", "Shipping"],
    },
    {
      name: "Payments",
      subCategories: ["Methods", "Refunds", "Coupons", "Pricing"],
    },
    {
      name: "Technical",
      subCategories: [
        "Troubleshooting",
        "System Requirements",
        "Compatibility",
      ],
    },
  ];

  const toggleModal = () => {
    setShowModal((prev) => (prev === "hidden" ? "block" : "hidden"));
    setIsEditing(false);
    setEditingFaq(null);
  };

  const loadFaqs = () => {
    setIsLoading(true);
    // For demo, using temp data
    setTimeout(() => {
      setFaqs(tempFaqs);
      setCategories(sampleCategories);
      setIsLoading(false);
    }, 500);
  };

  const handleCategoryChange = (categoryName: string, setFieldValue: any) => {
    const selectedCategory = categories.find(
      (cat) => cat.name === categoryName,
    );
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories);
      setFieldValue("subCategory", ""); // Reset subcategory when category changes
    }
  };

  const handleSubmit = (values: FAQ, resetForm: () => void) => {
    setIsLoading(true);

    if (isEditing && editingFaq) {
      const updatedFaqs = faqs.map((faq) =>
        faq.id === editingFaq.id ? { ...values, id: editingFaq.id } : faq,
      );
      setFaqs(updatedFaqs);

      Swal.fire({
        icon: "success",
        title: "FAQ updated successfully",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    } else {
      const newFaq = {
        ...values,
        id: faqs.length > 0 ? Math.max(...faqs.map((f) => f.id)) + 1 : 1,
        code: `FAQ${(faqs.length + 1).toString().padStart(3, "0")}`,
      };
      setFaqs([...faqs, newFaq]);

      Swal.fire({
        icon: "success",
        title: "FAQ created successfully",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    }

    setIsLoading(false);
    toggleModal();
    resetForm();
  };

  const handleDelete = (faq: FAQ) => {
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
        const updatedFaqs = faqs.filter((f) => f.id !== faq.id);
        setFaqs(updatedFaqs);

        toast.success("FAQ deleted successfully", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setIsEditing(true);
    setShowModal("block");

    // Set subcategories based on the FAQ's category
    const selectedCategory = categories.find(
      (cat) => cat.name === faq.category,
    );
    if (selectedCategory) {
      setSubCategories(selectedCategory.subCategories);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    loadFaqs();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      getRoleDropdowns().then((response) => {
        console.log(response.data);
        const optionList = response.data.map((role: any) => ({
          value: String(role.id),
          text: role.name,
        }));
        console.log(optionList);
        setRoleList(optionList);
      });
    };
    fetchRoles();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="FAQ Management" />
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
                  id: editingFaq?.id || 0,
                  code: editingFaq?.code || "",
                  question: editingFaq?.question || "",
                  answer: editingFaq?.answer || "",
                  category: editingFaq?.category || "",
                  subCategory: editingFaq?.subCategory || "",
                }}
                validationSchema={Yup.object({
                  question: Yup.string().required("Question is required"),
                  answer: Yup.string().required("Answer is required"),
                  category: Yup.string().required("Category is required"),
                  subCategory: Yup.string().required(
                    "Sub-Category is required",
                  ),
                })}
                onSubmit={(values, { resetForm }) =>
                  handleSubmit(values, resetForm)
                }
              >
                {({ isSubmitting, values, handleChange, setFieldValue }) => (
                  <Form>
                    <div className="w-full xl:w-1/2">
                      <SelectDropDown
                        label="Select Role"
                        name="role"
                        options={roleList}
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Question"
                        name="question"
                        type="text"
                        placeholder="Enter Question"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="answer"
                        className="text-black-700 mb-1 block text-sm font-medium"
                      >
                        Answer
                      </label>
                      <textarea
                        id="answer"
                        name="answer"
                        value={values.answer}
                        onChange={handleChange}
                        placeholder="Enter full Answer"
                        className="w-full rounded-md border border-gray-200 p-2 text-black placeholder-gray-500 shadow-sm placeholder:text-sm focus:border-gray-300 focus:outline-none"
                        rows={5}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="category"
                        className="text-black-700 mb-1 block text-sm font-medium"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={values.category}
                        onChange={(e) => {
                          handleChange(e);
                          handleCategoryChange(e.target.value, setFieldValue);
                        }}
                        className="w-full rounded-md border border-gray-200 p-2 text-black placeholder-gray-500 shadow-sm placeholder:text-sm focus:border-gray-300 focus:outline-none"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="subCategory"
                        className="text-black-700 mb-1 block text-sm font-medium"
                      >
                        Sub-Category
                      </label>
                      <select
                        id="subCategory"
                        name="subCategory"
                        value={values.subCategory}
                        onChange={handleChange}
                        disabled={!values.category}
                        className="w-full rounded-md border border-gray-200 p-2 text-black placeholder-gray-500 shadow-sm placeholder:text-sm focus:border-gray-300 focus:outline-none"
                      >
                        <option value="">Select a sub-category</option>
                        {subCategories.map((subCat) => (
                          <option key={subCat} value={subCat}>
                            {subCat}
                          </option>
                        ))}
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
            data={faqs}
            handleAdd={toggleModal}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FAQPage;
