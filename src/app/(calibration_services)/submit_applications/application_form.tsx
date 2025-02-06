"use client";
import { useState, useEffect } from "react";
import { Formik, Form, Field, useFormikContext} from "formik";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import FileInput from "@/components/Inputs/FileInput";
import * as Yup from "yup";
import Swal from "sweetalert2";

interface FormValues {
  cid: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  equipment: string[];
  manufacturer: string[];
  model: string[];
  quantity: number[];
  amount: number[];
  total_quantity: number[];
}

const validationSchema = Yup.object().shape({
  // Your validation schema
});

const ApplicationSubmitForm = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentList, setEquipmentList] = useState([{}]);
  const [equipmentOptions, setEquipmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [userDetails, setUserDetails] = useState({
    cid: "",
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
  });

  // Fetch equipment data from API
  const fetchEquipment = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No authentication token found!");
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationItems/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Full API Response:", data); // Debugging log
  
      // Check if response contains the expected data structure
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format: Expected 'data' to be an array.");
      }
  
      // Map the data to equipment options
      setEquipmentOptions(
        data.data.map((item: any) => ({
          value: item.id,
          label: item.description, // Assuming you want 'description' as the dropdown label
        }))
      );
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  useEffect(() => {
    // Fetch the stored user details from localStorage
    const storedUser = localStorage.getItem("userDetails");
  
    fetchEquipment();
  }, []);

  const addEquipment = () => {
    setEquipmentList((prevList) => [
      ...prevList,
      {
        equipment: "",
        manufacturer: "",
        model: "",
        quantity: 0,
        amount: 0,
        total_quantity: 0,
      },
    ]);
  };  

  const removeEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const handleEquipmentChange = async (index: number, selectedEquipmentId: string, setFieldValue: Function) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationItems/id/${selectedEquipmentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Fetched Data: ", data);
      if (data && data.status === 'OK') {
        const equipmentData = data.data;
        const manufacturer = equipmentData ? equipmentData.manufacturer : '';
        const range = equipmentData ? equipmentData.range : '';
        const rate = equipmentData ? equipmentData.charges || 0 : 0; // Ensure rate is fetched correctly
  
        // Set fields for this equipment
        setFieldValue(`manufacturer[${index}]`, manufacturer);
        setFieldValue(`model[${index}]`, range);
        setFieldValue(`amount[${index}]`, rate); // Set the rate (amount) for the equipment
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  

  const handleQuantityChange = (index: number, quantity: number, setFieldValue: Function, values: FormValues) => {
    // Ensure that the amount is correctly fetched as a number
    const amount = Number(values.amount[index]) || 0; 
    const totalAmount = amount * quantity; // Calculate total amount
    console.log("This is the data: ", totalAmount, amount, quantity);
  
    // Set the total amount and quantity values
    setFieldValue(`total_quantity[${index}]`, totalAmount); // Update total_quantity
    setFieldValue(`quantity[${index}]`, quantity); // Update quantity
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    setSubmitting(true);
  
    const payload = {
      cid: values.cid,
      clientName: values.fullName,
      clientAddress: values.address,
      contactNumber: values.contactNumber,
      emailAddress: values.email,
      deviceRegistry: values.equipment.map((_, index) => ({
        quantity: values.quantity[index],
        testItemId: Number(values.equipment[index]), // Ensure it's a number
        manufacturerOrTypeOrBrand: values.manufacturer[index],
        serialNumberOrModel: values.model[index],
      })),
    };
  
    console.log("Submitting Payload:", payload); // Debugging log
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CAL_API_URL}/calibrationForm/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      Swal.fire({
        title: "Success",
        text: "Your application has been successfully submitted.",
        icon: "success",
        confirmButtonText: "Ok",
      });
  
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while submitting the form.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setSubmitting(false);
    }
  };  

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
      <Formik
        initialValues={{
          cid: userDetails.cid,
          fullName: userDetails.fullName,
          address: userDetails.address,
          contactNumber: userDetails.contactNumber,
          email: userDetails.email,
          equipment: equipmentList.map(() => ""),
          manufacturer: equipmentList.map(() => ""),
          model: equipmentList.map(() => ""),
          quantity: equipmentList.map(() => 0),
          amount: equipmentList.map(() => 0),
          total_quantity: equipmentList.map(() => 0),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} 
      >
        {({ handleSubmit, errors, values, touched, isValid, setFieldValue }) => (
          <Form onSubmit={handleSubmit}> 
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Citizenship Identity Details
                </label>
                <Field
                  name="cid"
                  type="text"
                  placeholder="Enter Your CID"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.cid && touched.cid && <div className="text-red-500">{errors.cid}</div>}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Full Name
                </label>
                <Field
                  name="fullName"
                  type="text"
                  placeholder="Enter Your Full Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.fullName && touched.fullName && <div className="text-red-500">{errors.fullName}</div>}
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Address
                </label>
                <Field
                  name="address"
                  type="text"
                  placeholder="Enter Your Address"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.address && touched.address && <div className="text-red-500">{errors.address}</div>}
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Contact Number
                </label>
                <Field
                  name="contactNumber"
                  type="text"
                  placeholder="Enter Your Contact Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.contactNumber && touched.contactNumber && <div className="text-red-500">{errors.contactNumber}</div>}
              </div>
            </div>
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email
              </label>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
              {errors.email && touched.email && <div className="text-red-500">{errors.email}</div>}
            </div>

             {/* This is the section where I want to dulicated when the user clicks on the add more button broder: */}
              {equipmentList.map((_, index) => (
              <div key={index} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 mt-5 text-black outline-none focus:border-primary dark:border-form-strokedark">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select an equipment/instrument
                    </label>
                    <SelectGroupTwo
                      name={`equipment[${index}]`}
                      options={equipmentOptions}
                      onChange={(selectedEquipmentId) => handleEquipmentChange(index, selectedEquipmentId, setFieldValue)}
                    />
                    {errors.equipment && touched.equipment && errors.equipment && (
                      <div className="text-red-500">{errors.equipment}</div>
                    )}
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Manufacturer/Type/Brand
                    </label>
                    <Field
                      name={`manufacturer[${index}]`}
                      type="text"
                      placeholder="Enter Manufacturer/Type/Brand"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                    {errors.manufacturer && touched.manufacturer && errors.manufacturer && (
                      <div className="text-red-500">{errors.manufacturer}</div>
                    )}
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Model/Seriel Number/Range
                  </label>
                  <Field
                    name={`model[${index}]`}
                    type="text"
                    placeholder="Enter The Model/Seriel Number/Range"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                  {errors.model && touched.model && <div className="text-red-500">{errors.model}</div>}
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Quantity Of Equipment
                  </label>
                  <Field
                    name={`quantity[${index}]`}
                    type="text"
                    placeholder="Enter The Quantity Of Equipment"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleQuantityChange(index, Number(e.target.value), setFieldValue, values)
                    }
                  />
                  {errors.quantity && touched.quantity && typeof errors.quantity === 'string' && (
                    <div className="text-red-500">{errors.quantity}</div>
                  )}
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Rate/Amount
                  </label>
                  <Field
                    name={`amount[${index}]`}
                    type="number"
                    placeholder="Enter The Rate/Amount"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                  {/* Update the error rendering */}
                  {errors.amount && touched.amount && typeof errors.amount === 'string' && (
                    <div className="text-red-500">{errors.amount}</div>
                  )}
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Total Amount
                  </label>
                  <Field
                    name={`total_quantity[${index}]`}
                    type="text"
                    placeholder="Enter The Total Amount"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    value={values.total_quantity && values.total_quantity[index] !== undefined ? values.total_quantity[index] : ''}  // Safe access
                    readOnly
                  />
                  {errors.quantity && touched.quantity && typeof errors.quantity === 'string' && (
                    <div className="text-red-500">{errors.quantity}</div>
                  )}
                </div>
              </div>

                <button type="button" className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 mx-auto flex justify-center" onClick={() => removeEquipment(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="w-1/4 rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 mx-auto flex justify-center mt-4"
              onClick={addEquipment}
            >
              Add More
            </button>

            <div className="mb-6 mt-5">
              <h3 className="font-medium text-black dark:text-white">
                Additional Information (Optional)
              </h3>
              <FileInput label="Upload Specific Document" />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90"
              disabled={!isValid || isSubmitting}
              style={{ cursor: "pointer" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplicationSubmitForm;