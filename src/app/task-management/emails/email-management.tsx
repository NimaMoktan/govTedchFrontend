// app/task-management/emails/email-management.tsx
"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Email } from "@/types/Email";
import { getEmails, deleteEmail } from "@/services/EmailService";

const EmailManagement = () => {
  const [emailList, setEmailList] = useState<Email[]>([]);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleCreateEmail = () => {
    router.push("/task-management/emails/create");
  };

  const handleEditEmail = (email: Email) => {
    router.push(`/task-management/emails/${email.id}`);
  };

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await getEmails();
      console.log("Fetched emails:", response.data); // Add this to debug
      setEmailList(response.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
      Swal.fire("Error!", "Failed to fetch emails. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (email: Email) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteEmail(email.id);
        await Swal.fire("Deleted!", "The email has been deleted.", "success");
        fetchEmails(); // Refresh the list after deletion
      } catch (error) {
        Swal.fire("Error!", "Failed to delete email.", "error");
      }
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="max-w-full overflow-x-auto p-4">
        <DataTable
          columns={columns(handleEditEmail, handleDelete)}
          data={emailList}
          handleAdd={handleCreateEmail}
        />
      </CardContent>
    </Card>
  );
};

export default EmailManagement;
