"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FileInput from "@/components/Inputs/FileInput";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import { useRouter } from "next/navigation";

interface FormValues {
  cid: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  organizationId: number | string;
  equipment: string[];
  manufacturer: string[];
  model: string[];
  quantity: number[];
  amount: number[];
  total_quantity: number[];
  serialNumberOrModel: string[];
}

const validationSchema = Yup.object().shape({
  cid: Yup.string().required("CID is required"),
  fullName: Yup.string().required("Full name is required"),
  address: Yup.string().required("Address is required"),
  contactNumber: Yup.string().required("Contact number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  organizationId: Yup.string().required("Organization is required"),
  equipment: Yup.array().of(Yup.string().required("Equipment is required")),
  manufacturer: Yup.array().of(Yup.string().required("Manufacturer is required")),
  model: Yup.array().of(Yup.string().required("Model is required")),
  quantity: Yup.array().of(Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required")),
  amount: Yup.array().of(Yup.number().required("Amount is required")),
  total_quantity: Yup.array().of(Yup.number().required("Total quantity is required")),
});

const ApplicationSubmitForm = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentList, setEquipmentList] = useState([{}]);
  const [organizationOptions, setOrganizationOptions] = useState<{ value: string; label: string }[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<{ value: string; label: string }[]>([]);
  const [userDetails, setUserDetails] = useState({
    cid: "",
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
    organizationId: "",
  });
  const router = useRouter();

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
          text: item.description, // Assuming you want 'description' as the dropdown label
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

    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the token is included for authentication
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/clientList/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log("Organization Data:", data);

        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid response format: Expected 'data' to be an array.");
        }

        setOrganizationOptions(
          data.data?.map((org: any) => ({
            value: org.id.toString(),
            text: org.description,
          }))
        );
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchOrganizations();
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

  const handleEquipmentChange = async (index: number, selectedEquipmentId: any) => {
    // console.log(selectedEquipmentId.target?.value)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationItems/id/${selectedEquipmentId.target.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log("Fetched Data: ", data);
      if (data && data.status === 'OK') {
        const equipmentData = data.data;
        const manufacturer = equipmentData ? equipmentData.manufacturer : '';
        const range = equipmentData ? equipmentData.range : '';
        const rate = equipmentData ? equipmentData.charges || 0 : 0; // Ensure rate is fetched correctly
        // Set fields for this equipment
        // setFieldValue(`manufacturer[${index}]`, manufacturer);
        // setFieldValue(`model[${index}]`, range);
        // setFieldValue(`amount[${index}]`, rate);
        // setFieldValue(`equipment[${index}]`, selectedEquipmentId.target.value);
         // Set the rate (amount) for the equipment
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
    // console.log("This is the data: ", totalAmount, amount, quantity);

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
      organizationId: values.organizationId,
      deviceRegistry: values.equipment.map((_, index) => ({
        quantity: values.quantity[index],
        testItemId: Number(values.equipment[index]),
        manufacturerOrTypeOrBrand: values.manufacturer[index],
        serialNumberOrModel: values.serialNumberOrModel[index],
      })),
    };

    try {
      const storedUser = localStorage.getItem("userDetails");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      const response = await fetch(`${process.env.NEXT_PUBLIC_CAL_API_URL}/calibrationForm/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "userId": "999",
          "userName": parsedUser.userName,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      // console.log("API Response:", responseData);
      const clientCodes = responseData.data?.deviceRegistry?.map((device: any) => device.clientCode).join(", ");
      if (responseData.statusCode == 201) {
        Swal.fire({
          title: "Success",
          text: `These are your client codes: ${clientCodes}`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => router.push("/applications_list"));
      } else {
        Swal.fire({
          title: "Error",
          text: responseData.message,
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
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
          organizationId: userDetails.organizationId,
          equipment: equipmentList.map(() => ""),
          manufacturer: equipmentList.map(() => ""),
          model: equipmentList.map(() => ""),
          serialNumberOrModel: equipmentList.map(() => ""),
          quantity: equipmentList.map(() => 0),
          amount: equipmentList.map(() => 0),
          total_quantity: equipmentList.map(() => 0),
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, isValid, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label="CID Number"
                  name="cid"
                  type="text"
                  placeholder="Enter Your CID Number"
                />
              </div>

              <div className="w-full xl:w-1/2">

                <Input
                  label={`Full Name`}
                  name="fullName"
                  type="text"
                  placeholder="Enter Your Full Name" />
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label={`Address`}
                  name="address"
                  type="text"
                  placeholder="Enter Your Address" />
              </div>

              <div className="w-full xl:w-1/2">
                <Input
                  label={`Contact Number`}
                  name="contactNumber"
                  type="text"
                  placeholder="Enter Your Contact Number" />
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label={`Email`}
                  name="email"
                  type="email"
                  placeholder="Enter your email address" />
              </div>
              <div className="w-full xl:w-1/2">
                <Select
                  label={`Client List`}
                  name="organizationId"
                  options={organizationOptions}
                />
              </div>
            </div>


            {/* This is the section where I want to dulicated when the user clicks on the add more button broder: */}
            {equipmentList.map((_, index) => (
              <div key={index} className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 mt-5 text-black outline-none focus:border-primary dark:border-form-strokedark">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Select
                    label={`Equipment/Instrument`}
                      name={`equipment[${index}]`}
                      options={equipmentOptions}
                      onChange={(selectedEquipmentId : any) => handleEquipmentChange(index, selectedEquipmentId)}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <Input
                    label={`Manufacturer/Type/Brand`}
                      name={`manufacturer[${index}]`}
                      type="text"
                      placeholder="Enter Manufacturer/Type/Brand"/>
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input
                    label={`Range`}
                      name={`model[${index}]`}
                      type="text"
                      placeholder="Enter The Range" readOnly={true}                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <Input
                    label={`Model/Seriel Number`}
                      name={`serialNumberOrModel[${index}]`}
                      type="text"
                      placeholder="Enter The Model/Seriel Number"/>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Input
                      label={`Quantity Of Equipment`}
                      name={`quantity[${index}]`}
                      type="number"
                      placeholder="Enter The Quantity Of Equipment"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleQuantityChange(index, Number(e.target.value), setFieldValue, values)
                      }
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <Input name={`amount[${index}]`}
                      type="number"
                      placeholder="Enter The Rate/Amount"
                      label={"Rate/Amount"}
                      readOnly={true}/>
                  </div>
                </div>
                <div className="mb-4.5">
                  <div className="w-full xl:w-1/2">
                    <Input name={`total_quantity[${index}]`}
                      type="number"
                      placeholder="Enter The Total Amount"
                      label={"Total Amount"}
                      value={values.total_quantity && values.total_quantity[index] !== undefined ? values.total_quantity[index] : ''}  // Safe access
                      readOnly={true}/>
                  </div>
                </div>
                <div className="flex w-full items-center justify-center">

                  <button type="button" className="right-10 gap-2 bg-red-500 text-white px-4 py-2 btn-sm rounded-lg hover:bg-gray-600" onClick={() => removeEquipment(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex w-full items-center justify-center">

              <button
                type="button"
                className="mt-2 ml-5 bg-green-500 text-white px-4 py-2 rounded rounded-lg hover:bg-green-600"
                onClick={addEquipment}
              >
                Add More
              </button>
            </div>



            <div className="mb-6 mt-5">
              <h3 className="font-medium text-black dark:text-white">
                Additional Information (Optional
                )
              </h3>
              <FileInput label="Upload Specific Document" />
            </div>

            <div className="flex w-full items-center justify-center">

              <button
                type="submit"
                className="w-ful mt-2 ml-5 bg-blue-500 text-white px-4 py-2 rounded rounded-lg hover:bg-blue-600"
                disabled={!isValid || isSubmitting}
              style={{ cursor: "pointer" }}
              >
                 {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ApplicationSubmitForm;