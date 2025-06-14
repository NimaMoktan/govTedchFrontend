"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CallManagement from "./call-management";

const EmailsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Call Management" />
      <div className="flex flex-col gap-2">
        <CallManagement />
      </div>
    </DefaultLayout>
  );
};

export default EmailsPage;
