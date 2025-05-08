"use client";
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Input from "@/components/Inputs/Input";
import Select from "@/components/Inputs/Select";
import { useRouter } from "next/navigation";

interface SelectDropDownProps {
  label: string;
  name: string;
  options: { value: string; text: string }[];
  onValueChange: (value: string) => void;
}

const ApplicationSubmitForm = () => {
  const [token, setToken] = useState<string | null>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipmentList, setEquipmentList] = useState([{}]);
  const [selectedEquipment, setSelectedEquipment] = useState<{ [key: number]: { equipmentId: string, rate: number } }>({});
  const [organizationOptions, setOrganizationOptions] = useState<any[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<any[]>([]);
  const [rangeRates, setRangeRates] = useState<{ [key: number]: Record<string, number> }>({});
  const [addedViaAddButton, setAddedViaAddButton] = useState<number[]>([]);
  const [rangeOptions, setRangeOptions] = useState<{ [key: number]: { value: string; text: string }[] }>({});
  const [userDetails, setUserDetails] = useState({
    cid: "",
    fullName: "",
    village: "",
    gewog: "",
    dzongkhag: "",
    address: "",
    contactNumber: "",
    email: "",
    organizationId: "",
  });
  const router = useRouter();

  // Fetch equipment data from API
  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/core/public/calibrationItems`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      if (!data || !Array.isArray(data.data)) throw new Error("Invalid response format");
      
      const filteredEquipment = data.data.filter((item: any) =>
        ![6, 12, 15, 18, 19].includes(item.id)
      );
      
      setEquipmentOptions(
        filteredEquipment.map((item: any) => ({
          value: String(item.id),
          text: item.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  // Fetch organizations from API
  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/core/public/clientList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      if (!data || !Array.isArray(data.data)) throw new Error("Invalid response format");
      
      setOrganizationOptions(
        data.data.map((org: any) => ({
          value: org.id,
          text: org.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  // Fetch CID details from API
  const fetchCitizenDetails = async (cid: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/calibration/api/getCitizenDtls/${cid}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      const details = data.citizenDetailsResponse?.citizenDetail[0];
      
      if (details) {
        setUserDetails((prev) => ({
          ...prev,
          cid: cid,
          fullName: `${details.firstName} ${details.lastName}`,
          village: details.villageName,
          gewog: details.gewogName,
          dzongkhag: details.dzongkhagName,
          address: `${details.villageName}, ${details.gewogName}, ${details.dzongkhagName}`,
        }));
      }
    } catch (error) {
      console.error("Error fetching CID details:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch CID details. Please check the CID and try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchEquipment();
    fetchOrganizations();
  }, []);

  // Handle CID change
  const handleCidChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: Function) => {
    const cid = e.target.value;
    setUserDetails((prev) => ({ ...prev, cid }));
    setFieldValue("cid", cid);
    
    if (cid.length === 11) {
      fetchCitizenDetails(cid).then(() => {
        setFieldValue("fullName", userDetails.fullName);
        setFieldValue("village", userDetails.village);
        setFieldValue("gewog", userDetails.gewog);
        setFieldValue("dzongkhag", userDetails.dzongkhag);
        setFieldValue("address", userDetails.address);
      });
    }
  };

  const removeEquipment = (index: number) => {
    setEquipmentList(equipmentList.filter((_, i) => i !== index));
  };

  const addEquipment = (setFieldValue: Function) => {
    const nextIndex = equipmentList.length;
    const firstEquipmentId = selectedEquipment[0]?.equipmentId;
    const shouldAutoFill = firstEquipmentId === "3";
    
    const newEquipment = {
      equipment: shouldAutoFill ? "3" : "",
      manufacturer: "",
      model: "",
      amount: shouldAutoFill ? selectedEquipment[0]?.rate || 0 : 0,
      total_quantity: 0,
    };
    
    setEquipmentList((prevList) => [...prevList, newEquipment]);
    setFieldValue(`equipment[${nextIndex}]`, newEquipment.equipment);
    setAddedViaAddButton((prev) => [...prev, nextIndex]);
    
    if (shouldAutoFill) {
      handleEquipmentChange(nextIndex, "3", setFieldValue);
    }
  };

  const handleEquipmentChange = async (
    index: number,
    selectedEquipmentId: string,
    setFieldValue: Function
  ) => {
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
      
      if (data && data.status === "OK") {
        const equipmentData = data.data;
        const rate = equipmentData?.charges || 0;
        const subsequentRate = equipmentData?.subsequentRate || 0;

        if (selectedEquipmentId === "3") {
          const rangeResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/core/calibrationWeights/testItemId/3`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          
          const rangeData = await rangeResponse.json();
          
          if (rangeData && Array.isArray(rangeData.data)) {
            const options = rangeData.data.map((item: any) => ({
              value: item.weight,
              text: item.weight,
            }));
            
            const rates: Record<string, number> = {};
            rangeData.data.forEach((item: any) => {
              rates[item.weight] = item.rate;
            });
            
            setRangeOptions((prev) => ({
              ...prev,
              [index]: options,
            }));
            
            setRangeRates((prev) => ({
              ...prev,
              [index]: rates,
            }));
            
            if (options.length > 0) {
              const defaultWeight = options[0].value;
              setFieldValue(`model[${index}]`, defaultWeight);
              setFieldValue(`amount[${index}]`, rates[defaultWeight]);
            }
          }
        } else {
          setFieldValue(`model[${index}]`, equipmentData?.range || "");
          setRangeOptions((prev) => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
          });
        }

        setFieldValue(`equipment[${index}]`, selectedEquipmentId);
        setFieldValue(`amount[${index}]`, index === 0 ? rate : subsequentRate);
        
        setSelectedEquipment((prev) => ({
          ...prev,
          [index]: { 
            equipmentId: selectedEquipmentId, 
            rate: index === 0 ? rate : subsequentRate 
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

  const handleRangeChange = (index: number, selectedWeight: string, setFieldValue: Function) => {
    const rate = rangeRates[index]?.[selectedWeight] || 0;
    setFieldValue(`amount[${index}]`, rate);
    setFieldValue(`model[${index}]`, selectedWeight);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      
      const payload = {
        cid: values.cid,
        clientName: userDetails.fullName,
        clientAddress: values.address,
        contactNumber: values.contactNumber,
        emailAddress: values.email,
        organizationId: values.organizationId,
        deviceRegistry: values.equipment.map((equipmentId: string, index: number) => {
          const baseDevice = {
            quantity: 1,
            testItemId: Number(equipmentId),
            manufacturerOrTypeOrBrand: values.manufacturer[index],
            serialNumberOrModel: values.serialNumberOrModel[index],
          };
        
          // Only add selectedWeights if equipmentId is "3"
          if (equipmentId === "3") {
            return {
              ...baseDevice,
              selectedWeights: values.model[index], // assuming model holds the selected weight(s)
            };
          }
        
          return baseDevice;
        }),
      };
      
      const storedUser = localStorage.getItem("userDetails");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_CAL_API_URL}/calibrationForm/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          userId: parsedUser.id,
          userName: parsedUser.userName,
        },
        body: JSON.stringify(payload),
      });
      console.log("This is the data being sent: ", payload);
      
      if (!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      
      const responseData = await response.json();
      const clientCodes = responseData.data?.deviceRegistry?.map((device: any) => device.clientCode).join(", ");
      
      if (responseData.statusCode === 201) {
        Swal.fire({
          title: "Success",
          text: `These are your client codes: ${clientCodes}`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => router.push("/dashboard"));
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
          village: userDetails.village,
          gewog: userDetails.gewog,
          dzongkhag: userDetails.dzongkhag,
          address: userDetails.address,
          contactNumber: userDetails.contactNumber,
          email: userDetails.email,
          organizationId: userDetails.organizationId,
          equipment: equipmentList.map((_, i) => 
            selectedEquipment[i]?.equipmentId || ""
          ),
          manufacturer: equipmentList.map(() => ""),
          model: equipmentList.map((_, i) => 
            rangeOptions[i]?.[0]?.value || ""
          ),
          serialNumberOrModel: equipmentList.map(() => ""),
          amount: equipmentList.map((_, i) => 
            selectedEquipment[i]?.rate || 0
          ),
          total_quantity: equipmentList.map(() => 0),
        }}
        validationSchema={Yup.object().shape({
          cid: Yup.string().required("CID is required"),
          address: Yup.string().required("Address is required"),
          contactNumber: Yup.string().required("Contact number is required"),
          email: Yup.string().email("Invalid email").required("Email is required"),
          organizationId: Yup.string().required("Organization is required"),
          equipment: Yup.array().of(Yup.string().required("Equipment is required")),
          manufacturer: Yup.array().of(Yup.string().required("Manufacturer is required")),
          model: Yup.array().of(Yup.string().required("Model is required")),
          amount: Yup.array().of(Yup.number().required("Amount is required")),
          total_quantity: Yup.array().of(Yup.number().required("Total quantity is required")),
        })}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, isValid, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            {/* CID Field */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label="CID Number"
                  name="cid"
                  type="text"
                  placeholder="Enter Your CID Number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleCidChange(e, setFieldValue)
                  }
                />
              </div>
            </div>

            {/* Full Name, Village, Gewog, Dzongkhag Fields */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label="Full Name"
                  name="fullName"
                  type="text"
                  value={userDetails.fullName}
                  readOnly
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Input
                  label="Village"
                  name="village"
                  type="text"
                  value={userDetails.village}
                  readOnly
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Input
                  label="Gewog"
                  name="gewog"
                  type="text"
                  value={userDetails.gewog}
                  readOnly
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Input
                  label="Dzongkhag"
                  name="dzongkhag"
                  type="text"
                  value={userDetails.dzongkhag}
                  readOnly
                />
              </div>
            </div>

            {/* Address and Contact Number Fields */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="Enter Your Present Address"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Input
                  label="Contact Number"
                  name="contactNumber"
                  type="text"
                  placeholder="Enter Your Contact Number"
                />
              </div>
            </div>

            {/* Email and Organization Fields */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <Select
                  label="Client List"
                  name="organizationId"
                  options={organizationOptions}
                  onValueChange={() => {}}
                />
              </div>
            </div>

            {/* Equipment List */}
            {equipmentList.map((_, index) => {
              const currentEquipmentId = values.equipment[index];
              const currentRangeOptions = rangeOptions[index] || [];
              
              return (
                <div 
                  key={index} 
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 mt-5 text-black outline-none focus:border-primary dark:border-form-strokedark"
                >
                  {/* Equipment/Instrument Select */}
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <Select
                        label="Equipment/Instrument"
                        name={`equipment[${index}]`}
                        options={equipmentOptions}
                        onValueChange={(value: string) =>
                          handleEquipmentChange(index, value, setFieldValue)
                        }
                      />
                    </div>
                    
                    {/* Manufacturer Input */}
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Manufacturer/Type/Brand"
                        name={`manufacturer[${index}]`}
                        type="text"
                        placeholder="Enter Manufacturer/Type/Brand"
                      />
                    </div>
                  </div>

                  {/* Conditional Range Field */}
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      {currentEquipmentId === "3" ? (
                        <Select
                          label="Range"
                          name={`model[${index}]`}
                          options={currentRangeOptions}
                          onValueChange={(value: string) =>
                            handleRangeChange(index, value, setFieldValue)
                          }
                        />
                      ) : (
                        <Input
                          label="Range"
                          name={`model[${index}]`}
                          type="text"
                          placeholder="Enter The Range"
                          readOnly
                        />
                      )}
                    </div>
                    
                    {/* Model/Serial Number Input */}
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Model/Serial Number"
                        name={`serialNumberOrModel[${index}]`}
                        type="text"
                        placeholder="Enter The Model/Serial Number"
                      />
                    </div>
                  </div>

                  {/* Amount Fields */}
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      {currentEquipmentId === "3" && addedViaAddButton.includes(index) ? null : (
                        <Input
                          label={currentEquipmentId === "3" ? "Rate" : "Rate/Amount"}
                          name={`amount[${index}]`}
                          type="number"
                          value={values.amount[index]}
                          readOnly
                        />
                      )}
                    </div>
                    
                    <div className="w-full xl:w-1/2">
                      <Input
                        label="Total Amount"
                        name={`total_quantity[${index}]`}
                        type="number"
                        placeholder="Enter The Total Amount"
                        value={values.amount[index]}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex w-full items-center justify-center">
                    <button
                      type="button"
                      className="right-10 gap-2 bg-red-500 text-white px-4 py-2 btn-sm rounded-lg hover:bg-gray-600"
                      onClick={() => removeEquipment(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add More Button */}
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={() => addEquipment(setFieldValue)}
              >
                Add Equipment
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex w-full items-center justify-center">
              <button
                type="submit"
                className="w-full mt-2 mr-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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