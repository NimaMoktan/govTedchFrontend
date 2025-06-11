"use client";
import { useEffect } from "react";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PermissionTable from "./permission-management";

const PermissionPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List of Permissions" />
      <div className="flex flex-col gap-2 ">
        <PermissionTable />
      </div>
    </DefaultLayout>
  );
};

export default PermissionPage;
