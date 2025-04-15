"use client";
import {useCallback, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { BsPencil, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import Input from "@/components/Inputs/Input";

interface Product {
    id: number;
    sampleCode: string;
    code: string;
    description: string;
    quantityRequired: string | number;
    ratesInNu: string | number;
    testSiteCode: string;
    createdBy: string;
    active: string;
    }

const ProductTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('http://172.31.1.80:8081/productTestType/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseData = await response.json();
    
            // Ensure you access the 'data' field from the response if it's nested
            if (responseData && Array.isArray(responseData.data)) {
                const sortedData = responseData.data.sort((a: Product, b: Product) => a.id - b.id);
                setProducts(sortedData); // Set the sorted data
            } else {
                setProducts([]); // In case the data field is not an array, reset the state
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]); // Handle errors by resetting the state
        }
    }, [token]); // Only recreate fetchProducts if token changes
    
    useEffect(() => {
        const storeToken = localStorage.getItem("token")
        setToken(storeToken)
        fetchProducts();
    }, [fetchProducts]); // Call fetchProducts when the component mounts or token changes    

    const handleCreateProduct = () => {
        setSelectedProduct(null);
        setShowModal(true);
    };
    console.log("Selected Product:", selectedProduct);
    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log("This is the ID: ", id);
                try {
                    const response = await fetch(`http://172.31.1.80:8081/productTestType/${id}/delete`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
    
                    if (response.ok) {
                        // Show success alert
                        Swal.fire("Deleted!", "The product has been deleted.", "success");
                        
                        // Optionally, you can refresh your product list after successful deletion
                        fetchProducts(); // Assuming fetchProducts is your function to fetch and update the product list
                    } else {
                        // Handle failure if the deletion was unsuccessful
                        Swal.fire("Error!", "Failed to delete the product. Please try again.", "error");
                    }
                } catch (error) {
                    console.error("Error deleting product:", error);
                    Swal.fire("Error!", "An error occurred while deleting the product. Please try again.", "error");
                }
            }
        });
    };    

    const handleSubmit = async (values: Omit<Product, 'id'>, { resetForm }: { resetForm: () => void }) => {
        try {
            const productData = {
                sampleCode: values.sampleCode,
                code: values.code,
                description: values.description,
                quantityRequired: values.quantityRequired,
                ratesInNu: values.ratesInNu,
                testSiteCode: values.testSiteCode,
                createdBy: values.createdBy,
                active: values.active,
            };
    
            console.log("Payload:", productData);
    
            let response;
            if (selectedProduct) {
                // Update product
                response = await fetch(`http://172.31.1.80:8081/productTestType/${selectedProduct.id}/update`, {
                    method: 'POST', // Use PUT for updates if backend expects it
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            } else {
                // Create new product
                console.log("This data is being send to the API: ", JSON.stringify(productData));
                response = await fetch('http://172.31.1.80:8081/productTestType/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error("Failed to submit product");
            }
    
            const responseData = await response.json();
            console.log("API Response Data:", responseData);
    
            Swal.fire({
                icon: "success",
                title: "Success",
                text: responseData.message || "Operation successful",
            }).then(() => {
                window.location.reload(); // Refresh after success
            });
    
            closeModal();
            resetForm();
        } catch (error) {
            console.error("Error submitting product:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to submit the product. Please try again.",
            });
            closeModal();
            resetForm();
        }
    };        

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-5">
            <h1>Product List</h1>
            <button
            onClick={handleCreateProduct}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90"
            >
            Add Product
            </button>
        </div>
        {showModal && (
            <div
                className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-9999 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100"
                aria-hidden="false"
            >
                <div className="relative p-4 w-full max-w-5xl max-h-full transition-transform duration-300 ease-in-out transform scale-95">
                <Formik
                    initialValues={{
                        sampleCode: selectedProduct?.sampleCode || "",
                        code: selectedProduct?.code || "",
                        description: selectedProduct?.description || "",
                        quantityRequired: selectedProduct?.quantityRequired || "",
                        ratesInNu: selectedProduct?.ratesInNu || 0,
                        testSiteCode: selectedProduct?.testSiteCode || "",
                        createdBy: selectedProduct?.createdBy || "",
                        active: selectedProduct?.active || "Y",
                    }}
                    validationSchema={Yup.object({
                        sampleCode: Yup.string().required("Sample code is required"),
                        code: Yup.string().required("Code is required"),
                        description: Yup.string().required("Description is required"),
                        quantityRequired: Yup.string().required("Quantity is required"),
                        ratesInNu: Yup.number().required("Rates are required").positive("Must be positive"),
                        testSiteCode: Yup.string().required("Test site code is required"),
                        createdBy: Yup.string().required("Created by is required"),
                        active: Yup.string().required("Active status is required"),
                    })}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
                >
                    <Form>
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {selectedProduct ? "Edit Product" : "Add Product"}
                        </h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                            <span className="sr-only">Close</span>
                            ✖
                        </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <Input label="Sample Code" name="sampleCode" placeholder="Enter sample code" />
                            <Input label="Code" name="code" placeholder="Enter code" />
                            <Input
                                label="Description"
                                name="description"
                                type="text"
                                placeholder="Enter description"
                            />
                            <Input
                                label="Quantity Required"
                                name="quantityRequired"
                                placeholder="Enter quantity required"
                            />
                            <Input
                                label="Rates (Nu)"
                                name="ratesInNu"
                                type="number"
                                placeholder="Enter rates in Nu"
                            />
                            <Input
                                label="Test Site Code"
                                name="testSiteCode"
                                placeholder="Enter test site code"
                            />
                            <Input
                                label="Created By"
                                name="createdBy"
                                placeholder="Enter creator's name"
                            />
                            <Input label="Active Status" name="active" placeholder="Enter active status (Y/N)" />
                        </div>
                        <div className="flex justify-between items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5"
                        >
                            {selectedProduct ? "Update" : "Create"}
                        </button>
                        </div>
                    </div>
                    </Form>
                </Formik>
                </div>
            </div>
            )}

            <div className="max-w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">ID</th>
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">Sample Code</th>
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">Code</th>
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">Description</th>
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">Created By</th>
                            <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border-b border-[#eee] px-4 py-5  dark:border-strokedark">{product.id}</td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">{product.sampleCode}</td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">{product.code}</td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">{product.description}</td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">{product.createdBy}</td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <button className="hover:text-primary p-1" onClick={() => handleEditProduct(product)}>
                                            <BsPencil size={20} />
                                        </button>
                                        <button className="hover:text-danger" onClick={() => handleDelete(product.id)}>
                                            <BsTrash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ProductTable;
