"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Swal from 'sweetalert2';

// Define the types for the form values
interface FormValues {
  cid: string;
  full_name: string;
  contact_number: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  question6: string;
  question7: string;
  question8: string;
}

const validationSchema = Yup.object().shape({
  cid: Yup.string().required("Citizenship Identity Details is required."),
  full_name: Yup.string().required("Full Name is required."),
  contact_number: Yup.string().required("Contact Number is required."),
  question1: Yup.string().required("Please select an option"),
  question2: Yup.string().required("Please select an option"),
  question3: Yup.string().required("Please select an option"),
  question4: Yup.string().required("Please select an option"),
  question5: Yup.string().required("Please select an option"),
  question6: Yup.string().required("Please select an option"),
  question7: Yup.string().required("Please select an option"),
  question8: Yup.string().required("Please select an option"),
});

const CheckboxQuestion = () => {
  // Separate state for each group of checkboxes
  const [selectedQuestion1, setSelectedQuestion1] = useState<string | null>(null);
  const [selectedQuestion2, setSelectedQuestion2] = useState<string | null>(null);
  const [selectedQuestion3, setSelectedQuestion3] = useState<string | null>(null);
  const [selectedQuestion4, setSelectedQuestion4] = useState<string | null>(null);
  const [selectedQuestion5, setSelectedQuestion5] = useState<string | null>(null);
  const [selectedQuestion6, setSelectedQuestion6] = useState<string | null>(null);
  const [selectedQuestion7, setSelectedQuestion7] = useState<string | null>(null);
  const [selectedQuestion8, setSelectedQuestion8] = useState<string | null>(null);

  const handleChangeQuestion1 = (value: string, setFieldValue: any) => {
    setSelectedQuestion1(value); // Set selected value
    setFieldValue("question1", value); // Update Formik field value for question2
  };
  const handleChangeQuestion2 = (value: string, setFieldValue: any) => {
    setSelectedQuestion2(value); // Set selected value
    setFieldValue("question2", value); // Update Formik field value for question2
  };

  const handleChangeQuestion3 = (value: string, setFieldValue: any) => {
    setSelectedQuestion3(value); // Set selected value
    setFieldValue("question3", value); // Update Formik field value for question3
  };
  const handleChangeQuestion4 = (value: string, setFieldValue: any) => {
    setSelectedQuestion4(value); // Set selected value
    setFieldValue("question4", value); // Update Formik field value for question3
  };
  const handleChangeQuestion5 = (value: string, setFieldValue: any) => {
    setSelectedQuestion5(value); // Set selected value
    setFieldValue("question5", value); // Update Formik field value for question4
  };
  const handleChangeQuestion6 = (value: string, setFieldValue: any) => {
    setSelectedQuestion6(value); // Set selected value
    setFieldValue("question6", value); // Update Formik field value for question4
  };
  const handleChangeQuestion7 = (value: string, setFieldValue: any) => {
    setSelectedQuestion7(value); // Set selected value
    setFieldValue("question7", value); // Update Formik field value for question4
  };
  const handleChangeQuestion8 = (value: string, setFieldValue: any) => {
    setSelectedQuestion8(value); // Set selected value
    setFieldValue("question8", value); // Update Formik field value for question4
  };
  const handleSubmit = (values: any, { resetForm }: any) => {
          setIsSubmitting(true); // Set submitting state to true when form starts submitting
          
          Swal.fire({
              title: 'Success!',
              text: 'Your feedback has been submitted successfully!',
              icon: 'success',
              confirmButtonText: 'Ok'
          }).then(() => {
              window.location.reload();
              resetForm();
              setIsSubmitting(false); // Reset submitting state after form submission is complete
          });
      };
      
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
      <Formik
        initialValues={{
          cid: "",
          full_name: "",
          contact_number: "",
          question1: "",
          question2: "",
          question3: "",
          question4: "",
          question5: "",
          question6: "",
          question7: "",
          question8: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, isValid }) => (
          <Form>
            <h3 className="mb-5 block text-md font-normal text-black dark:text-white text-center">
              🙏Thank you for making use of the BSB, M&LSD, National Metrology Laboratory. In line with the requirements of ISO/IEC 17025 on which our quantity system is based, we would appreciate it, if you could please complete the feedback from in order for us to improve, and to enhance our service to you and your requirements.
              <hr />
            </h3>
            <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
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
              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                Full Name
                </label>
                <Field
                  name="full_name"
                  type="text"
                  placeholder="Enter Your Full Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.full_name && touched.full_name && <div className="text-red-500">{errors.full_name}</div>}
              </div>
              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                Contact Number
                </label>
                <Field
                  name="contact_number"
                  type="text"
                  placeholder="Enter Your Contact Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                {errors.contact_number && touched.contact_number && <div className="text-red-500">{errors.contact_number}</div>}
              </div>
            </div>   
            <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Was the work carried out on time? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Very Satisfied", "Satisfied", "Fair", "Dissatisfied", "Very Disappointed"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question1"
                        value={option}
                        id={`question1-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion1(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question1-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion1 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion1 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion1 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question1 && touched.question1 && (
                      <div className="text-red-500">{errors.question1}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Have we completed the work to your requirement? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Very Satisfied", "Satisfied", "Fair", "Dissatisfied", "Very Disappointed"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question2"
                        value={option}
                        id={`question2-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion2(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question2-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion2 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion2 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion2 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question2 && touched.question2 && (
                      <div className="text-red-500">{errors.question2}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Are we meeting your strandard of quality? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Very Satisfied", "Satisfied", "Fair", "Dissatisfied", "Very Disappointed"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question3"
                        value={option}
                        id={`question3-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion3(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question3-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion3 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion3 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion3 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question3 && touched.question3 && (
                      <div className="text-red-500">{errors.question3}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  How would you rate the value for money? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Very Satisfied", "Satisfied", "Fair", "Dissatisfied", "Very Disappointed"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question4"
                        value={option}
                        id={`question4-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion4(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question4-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion4 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion4 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion4 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question4 && touched.question4 && (
                      <div className="text-red-500">{errors.question4}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Is the certificate issued clear and easy to use? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Yes", "No"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question5"
                        value={option}
                        id={`question5-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion5(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question5-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion5 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion5 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion5 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question5 && touched.question5 && (
                      <div className="text-red-500">{errors.question5}</div>
                  )}
                </div>
              </div>
              {/* Show this input only if dissatisfied or extremely dissatisfied is selected */}
              {["No"].includes(selectedQuestion5 || '') && (
                  <div className="mb-4.5">
                      <label className="block text-lg font-medium text-black dark:text-white mb-2">
                          If No please provide details
                      </label>
                      <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                          <Field
                              name="sample_details"
                              type="text"
                              placeholder="Please share your experience with the reception of your sample here"
                              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                      </div>
                  </div>
              )}

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Did the services provided ass value to your business? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Yes", "No"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question6"
                        value={option}
                        id={`question6-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion6(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question6-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion6 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion6 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion6 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question6 && touched.question6 && (
                      <div className="text-red-500">{errors.question6}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Was the BSB Metrology Unit easy to contact? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Yes", "No"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question7"
                        value={option}
                        id={`question7-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion7(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question7-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion7 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion7 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion7 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question7 && touched.question7 && (
                      <div className="text-red-500">{errors.question7}</div>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                  Would you use the services of the BSB Metrology Unit in the future? 
                </label>

                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                  {["Yes", "No"].map((option, index) => (
                    <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                      <Field
                        type="radio"
                        name="question8"
                        value={option}
                        id={`question8-option-${index}`}
                        className="sr-only"
                        onChange={() => handleChangeQuestion8(option, setFieldValue)}
                      />
                      <label
                        htmlFor={`question8-option-${index}`}
                        className={`cursor-pointer flex items-center gap-2 ${selectedQuestion8 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                      >
                        <div
                          className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${
                            selectedQuestion8 === option
                              ? "border-primary bg-gray dark:bg-transparent"
                              : "border-stroke dark:border-strokedark"
                          }`}
                        >
                          <span
                            className={`opacity-0 ${selectedQuestion8 === option ? "!opacity-100" : ""}`}
                            >
                            <svg
                              width="11"
                              height="8"
                              viewBox="0 0 11 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                                fill="#3056D3"
                                stroke="#3056D3"
                                strokeWidth="0.4"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    </div>
                  ))}
                  {errors.question8 && touched.question8 && (
                      <div className="text-red-500">{errors.question8}</div>
                  )}
                </div>
              </div>

            </div>

            <button
                type="submit"
                className="w-full rounded bg-primary p-3 text-gray font-medium hover:bg-opacity-90 mt-5"
                disabled={!isValid || isSubmitting} // Disable button when form is invalid or submitting
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckboxQuestion;
