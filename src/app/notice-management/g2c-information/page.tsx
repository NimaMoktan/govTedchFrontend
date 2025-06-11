"use client";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Input } from "@/components/ui/input";

const UsersPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="G2C Information" />
      <div className="h-screen items-center rounded-md border p-6">
        <div className="mb-5 flex">
          <h2 className="text-xl underline">
            Search various application (status etc.) of G2C services.
          </h2>
        </div>

        <div className="justify flex items-center">
          <Input
            placeholder={`Insert your tracking number here`}
            className="max-w-[550px] transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UsersPage;
