"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Swal from 'sweetalert2';

// Define the types for the form values
interface FormValues {
    feedback: '';
    question2: '',
    question3: '',
    sample_details: '',
    question4: '',
    testing_details: '',
    question5: '',
    test_details1: '',
    test_details2: ''
    }

    const validationSchema = Yup.object().shape({
    feedback: Yup.string().required("Please select an option"),
    question2: Yup.string().required("Please select an option"),
    question3: Yup.string().required("Please select an option"),
    question4: Yup.string().required("Please select an option"),
    question5: Yup.string().required("Please select an option"),
    });

    function ProductFeedback() {
    // Separate state for each group of checkboxes
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
    const [selectedQuestion2, setSelectedQuestion2] = useState<string | null>(null);
    const [selectedQuestion3, setSelectedQuestion3] = useState<string | null>(null);
    const [selectedQuestion4, setSelectedQuestion4] = useState<string | null>(null);
    const [selectedQuestion5, setSelectedQuestion5] = useState<string | null>(null);
    
    const handleChangeFeedback = (value: string, setFieldValue: any) => {
        setSelectedFeedback(value); // Set selected value
        setFieldValue("feedback", value); // Update Formik field value for feedback
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
                    feedback: "",
                    question2: "",
                    question3: "",
                    question4: "",
                    question5: ""
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, setFieldValue,touched, isValid }) => (
                    
                    <Form>
                        <h3 className="mb-5 block text-md font-normal text-black dark:text-white text-center">
                                BSB requests you to kindly spare a few minutes to provide us with your genuine feedback. Your feedback will help us understand your problems and improve our service in future.
                                <hr />
                            </h3>
                        <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
                            <h3 className="mb-5 block text-md font-bold text-black dark:text-white text-center">
                                Overall Experience
                                <hr />
                            </h3>
                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    How would you rate your overall experience with our services?
                                </label>

                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    {["Highly Satisfied", "Satisfied", "Fair", "Dissatisfied", "Extremely Disappointed"].map((option, index) => (
                                        <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                                            <Field
                                                type="radio"
                                                name="feedback"
                                                value={option}
                                                id={`feedback-option-${index}`}
                                                className="sr-only"
                                                onChange={() => handleChangeFeedback(option, setFieldValue)} />
                                            <label
                                                htmlFor={`feedback-option-${index}`}
                                                className={`cursor-pointer flex items-center gap-2 ${selectedFeedback === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                                            >
                                                <div
                                                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${selectedFeedback === option
                                                            ? "border-primary bg-gray dark:bg-transparent"
                                                            : "border-stroke dark:border-strokedark"}`}
                                                >
                                                    <span
                                                        className={`opacity-0 ${selectedFeedback === option ? "!opacity-100" : ""}`}
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
                                    {errors.feedback && touched.feedback && (
                                        <div className="text-red-500">{errors.feedback}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    Did we meet your expectation in answering your queries or solving your problem, while availing our service?
                                </label>

                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    {["Yes", "No", "Maybe", "Not Applicable"].map((option, index) => (
                                        <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                                            <Field
                                                type="radio"
                                                name="question2"
                                                value={option}
                                                id={`question2-option-${index}`}
                                                className="sr-only"
                                                onChange={() => handleChangeQuestion2(option, setFieldValue)} />
                                            <label
                                                htmlFor={`question2-option-${index}`}
                                                className={`cursor-pointer flex items-center gap-2 ${selectedQuestion2 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                                            >
                                                <div
                                                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${selectedQuestion2 === option
                                                            ? "border-primary bg-gray dark:bg-transparent"
                                                            : "border-stroke dark:border-strokedark"}`}

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
                        </div>

                        <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
                            <h3 className="mb-5 block text-md font-bold text-black dark:text-white text-center">
                                Sample Reception
                                <hr />
                            </h3>
                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    How was your experience with the reception of your sample?
                                </label>

                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    {["Highly Satisfied", "Satisfied", "Fair", "Dissatisfied", "Extremely Disappointed"].map((option, index) => (
                                        <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                                            <Field
                                                type="radio"
                                                name="question3"
                                                value={option}
                                                id={`question3-option-${index}`}
                                                className="sr-only"
                                                onChange={() => handleChangeQuestion3(option, setFieldValue)} />
                                            <label
                                                htmlFor={`question3-option-${index}`}
                                                className={`cursor-pointer flex items-center gap-2 ${selectedQuestion3 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                                            >
                                                <div
                                                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${selectedQuestion3 === option
                                                            ? "border-primary bg-gray dark:bg-transparent"
                                                            : "border-stroke dark:border-strokedark"}`}
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
                            {/* Show this input only if dissatisfied or extremely dissatisfied is selected */}
                            {["Dissatisfied", "Extremely Disappointed"].includes(selectedQuestion3 || '') && (
                                <div className="mb-4.5">
                                    <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                        If you are dissatisfied, can you please explain further?
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
                        </div>

                        <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
                            <h3 className="mb-5 block text-md font-bold text-black dark:text-white text-center">
                                Testing Facilities
                                <hr />
                            </h3>
                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    How would you rate the quantity id testing facilities of BSB including, equipment, manpower and infrastructure and duration of testing?
                                </label>

                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    {["Highly Satisfied", "Satisfied", "Fair", "Dissatisfied", "Extremely Disappointed"].map((option, index) => (
                                        <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                                            <Field
                                                type="radio"
                                                name="question4"
                                                value={option}
                                                id={`question4-option-${index}`}
                                                className="sr-only"
                                                onChange={() => handleChangeQuestion4(option, setFieldValue)} />
                                            <label
                                                htmlFor={`question4-option-${index}`}
                                                className={`cursor-pointer flex items-center gap-2 ${selectedQuestion4 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                                            >
                                                <div
                                                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${selectedQuestion4 === option
                                                            ? "border-primary bg-gray dark:bg-transparent"
                                                            : "border-stroke dark:border-strokedark"}`}
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
                            {["Dissatisfied", "Extremely Disappointed"].includes(selectedQuestion4 || '') && (
                                <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    If you are dissatisfied please elaborate further?
                                </label>
                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    <Field
                                        name="testing_details"
                                        type="text"
                                        placeholder="Please share your reason here"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                                </div>
                            </div>
                            )}
                        </div>

                        <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark mt-4">
                            <h3 className="mb-5 block text-md font-bold text-black dark:text-white text-center">
                                Test Results
                                <hr />
                            </h3>
                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    How would you rate our test reporting and results?
                                </label>

                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    {["Excellent", "Very Good", "Satisfactory", "Poor", "Very Poor"].map((option, index) => (
                                        <div key={index} className="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-auto xl:w-auto">
                                            <Field
                                                type="radio"
                                                name="question5"
                                                value={option}
                                                id={`question5-option-${index}`}
                                                className="sr-only"
                                                onChange={() => handleChangeQuestion5(option, setFieldValue)} />
                                            <label
                                                htmlFor={`question5-option-${index}`}
                                                className={`cursor-pointer flex items-center gap-2 ${selectedQuestion5 === option ? "text-primary dark:text-blue-700" : "text-black dark:text-white"}`}
                                            >
                                                <div
                                                    className={`mr-2 flex h-5 w-5 items-center justify-center rounded border ${selectedQuestion5 === option
                                                            ? "border-primary bg-gray dark:bg-transparent"
                                                            : "border-stroke dark:border-strokedark"}`}
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
                            {["Poor", "Very Poor"].includes(selectedQuestion5 || '') && (
                                <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    If poor or very poor, please elaborate to ensure improvement?
                                </label>
                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    <Field
                                        name="test_details1"
                                        type="text"
                                        placeholder="Please share your reason here"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                                </div>
                            </div>
                            )}
                            <div className="mb-4.5">
                                <label className="block text-lg font-medium text-black dark:text-white mb-2">
                                    Let us know if you have any further suggestions for improvements?
                                </label>
                                <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                    <Field
                                        name="test_details2"
                                        type="text"
                                        placeholder="Please share your reason here"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
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
}

export default ProductFeedback;
