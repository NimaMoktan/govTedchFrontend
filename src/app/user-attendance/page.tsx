"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserAttendanceManagement from "./user-attendance-management";

function UserAttendance() {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Attendance" />
      <UserAttendanceManagement />
    </DefaultLayout>
  );
}

export default UserAttendance;
