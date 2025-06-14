"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const G2cPage = () => {
  const [applicationNumber, setApplicationNumber] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for application:", applicationNumber);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="G2C Information " />

      <div className="container mx-auto  px-4 ">
        <div className="h-screen rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 md:p-8">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Track Your G2C Application
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Search for the status and details of your G2C service
              applications.
            </p>
          </div>

          {/* Search Form */}
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
            <Button
              type="submit"
              className="w-full items-center gap-2 self-start rounded-md bg-red-700 px-4 py-2 font-medium text-white opacity-100 hover:bg-red-600 sm:w-auto sm:max-w-md"
            >
              <Search className="h-5 w-5" />
              Track Application
            </Button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default G2cPage;
