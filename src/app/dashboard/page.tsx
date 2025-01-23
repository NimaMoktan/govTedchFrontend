import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard for BSB',
}

export default function Home () {
  return (
    <>
    <DefaultLayout>
        {/* <ECommerce /> */}
        <h3>Welcome To Superadmin Dashboard</h3>
    </DefaultLayout>
    </>
  );
}
