"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLoading } from "@/context/LoadingContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegPlusSquare } from "react-icons/fa";
import { Options } from "@/interface/Options";
import { getG2Cs } from "@/services/G2CService";
import Select from "@/components/Inputs/Select";
const G2cPage = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [nameList, setNameList] = useState<Options[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "Searching for application:",
      applicationNumber,
      "Selected service:",
      selectedService,
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getG2Cs();

        // Check if response exists and has data
        if (!response) {
          throw new Error("No response from server");
        }

        // Handle different possible response structures
        const data = response.data?.results || response.data || response;

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        // Map the data to options
        const agencyOptions = data.map((item) => ({
          value: item.name,
          text: item.name,
        }));

        setNameList(agencyOptions);
      } catch (error) {
        console.error("Error fetching G2C data:", error);
        setError("Failed to load G2C services. Please try again later.");
        setNameList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setIsLoading]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="G2C Information" />

      <div className="container mx-auto px-4">
        <div className="h-screen rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 md:p-8">
          {/* Header Section */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Track Your G2C Application
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Search for the status and details of your G2C service
                applications.
              </p>
            </div>
            <Link href="notice-management/g2c-information/api-management/create">
              <Button className="btn-sm ml-auto gap-2 rounded-full bg-red-700 px-4 py-2 text-white">
                <FaRegPlusSquare size={20} />
                Add New URL
              </Button>
            </Link>
          </div>

          <div className="mb-5  space-y-4 ">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/3 ">
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
                <label htmlFor="g2cService" className="sr-only">
                  Select G2C Service
                </label>
                <select
                  id="g2cService"
                  name="g2cService" // Add name if using Formik
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:max-w-md"
                  aria-label="Select a G2C service"
                  disabled={nameList.length === 0}
                >
                  <option value="" disabled>
                    {nameList.length === 0
                      ? error
                        ? "Error loading services"
                        : "Loading services..."
                      : "Select a service"}
                  </option>
                  {nameList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full xl:w-1/3 ">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-4"
                  aria-label="Track Application Form"
                >
                  <div className="w-full">
                    <label htmlFor="applicationNumber" className="sr-only">
                      Application Number
                    </label>
                    <Input
                      id="applicationNumber"
                      type="text"
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                      placeholder="Enter Application Number"
                      className="w-full border-gray-300 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 sm:max-w-md"
                      aria-required="true"
                    />
                  </div>
                </form>
              </div>

              <div className="xl:w1/3 w-full">
                <Button
                  type="submit"
                  className="w-full items-center gap-2 self-start rounded-md bg-red-700 px-4 py-2 font-medium text-white opacity-100 hover:bg-red-600 sm:w-auto sm:max-w-md"
                >
                  <Search className="h-5 w-5" />
                  Track Application
                </Button>
              </div>
            </div>
          </div>
          {/* Dropdown for G2C Services */}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default G2cPage;
