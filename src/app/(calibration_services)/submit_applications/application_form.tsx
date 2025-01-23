"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import FileInput from "@/components/Inputs/FileInput";
import * as Yup from "yup"; // Import Yup for validation
import Swal from "sweetalert2"; // Import SweetAlert2

// Define the types for the form values
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
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  cid: Yup.string().required("Citizenship Identity Details is required."),
  fullName: Yup.string().required("Full Name is required."),
  address: Yup.string().required("Address is required."),
  contactNumber: Yup.number()
  .typeError("Contact Number must be a number") // Ensures the value is a number
  .positive("Contact Number must be positive.")
  .required("Contact Number is required."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required."),
  equipment: Yup.array().of(
      Yup.string().required("Equipment selection is required.")
    ),
  manufacturer: Yup.array().of(
    Yup.string().required("Manufacturer/Type/Brand is required.")
  ),
  model: Yup.array()
  .of(Yup.string().required("Model/Serial Number/Range is required."))
  .min(1, "At least one model is required."),
  quantity: Yup.array().of(
    Yup.number().positive("Quantity must be positive").required("Quantity is required.")
  ),
  amount: Yup.array().of(
    Yup.number().positive("Amount must be positive").required("Amount is required.")
  ),
  // Add conditional validation for equipment
  equipmentValidation: Yup.array().test(
    "equipment-validation",
    "If equipment[2] is selected, equipment[1] must be selected.",
    function(value) {
      const { equipment } = this.parent; // Access the current form values

      // Check if equipment[2] is selected, but equipment[1] is not selected
      if (equipment[2] && !equipment[1]) {
        return false; // Show error if equipment[1] is not selected
      }
      return true;
    }
  ),
});
const ApplicationSubmitForm = () => {
  const [equipmentList, setEquipmentList] = useState([{}]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submitting state

  const addEquipment = () => {
    setEquipmentList([...equipmentList, {}]);
  };

  const removeEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
      <Formik
        initialValues={{
          cid: "",
          fullName: "",
          address: "",
          contactNumber: "",
          email: "",
          equipment: equipmentList.map(() => ""),
          manufacturer: equipmentList.map(() => ""),
          model: equipmentList.map(() => ""),
          quantity: equipmentList.map(() => 0),
          amount: equipmentList.map(() => 0),
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log('submitting data')
          setIsSubmitting(true); // Change button text to "Submitting..."
        
          // Simulate form submission process (you can replace this with your actual API call)
          setTimeout(() => {
            Swal.fire({
              title: "Success",
              text: "Your application has been successfully submitted.",
              icon: "success",
              confirmButtonText: "Ok",
            }).then(() => {
              // You can reset the form or take any other actions after success.
              // For example, you can reset the form:
              // resetForm();
              // Or navigate to another page, etc.
        
              setIsSubmitting(false); // Reset the button state
            });
          }, 2000); // Simulate a delay for submission
        }}        
      >

        {({ handleSubmit, errors, touched, isValid }) => (
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
              <div key={index} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Select an equipment/instrument
                    </label>
                    <SelectGroupTwo name={`equipment[${index}]`} />
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
                    type="number"
                    placeholder="Enter The Quantity Of Equipment"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                  {errors.quantity && touched.quantity && typeof errors.quantity === 'string' && (
                    <div className="text-red-500">{errors.quantity}</div>
                  )}
                </div>
              </div>
              <div className="mb-6">
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
            {/* add more section sends */}
            
            <div className="mb-6 mt-5">
              <h3 className="font-medium text-black dark:text-white">
                Additional Information (Optional)
              </h3>
                <FileInput label="Upload Specific Document" />
            </div>

            <button
                type="submit"
                className="w-full rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90"
                disabled={!isValid || isSubmitting} // Disable if form is invalid or submitting
                style={{cursor: "pointer"}}
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
