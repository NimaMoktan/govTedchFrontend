// app/settings/page.tsx
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PersonalDashboard from "./PersonalDashboard";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description: "This is the settings page for your profile information",
};

export default function SettingsPage() {
  return (
    <DefaultLayout>
      <PersonalDashboard />
    </DefaultLayout>
  );
}
