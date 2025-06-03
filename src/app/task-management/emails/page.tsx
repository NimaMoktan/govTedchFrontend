// app/task-management/emails/page.tsx
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EmailManagement from "./email-management";

const EmailsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Email Management" />
      <div className="flex flex-col gap-2">
        <EmailManagement />
      </div>
    </DefaultLayout>
  );
};

export default EmailsPage;
