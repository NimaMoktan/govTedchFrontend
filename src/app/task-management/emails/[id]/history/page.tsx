"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Email, History } from "@/types/Email";
import { getEmailById } from "@/services/EmailService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const EmailHistoryPage = () => {
  const [email, setEmail] = useState<Email | null>(null);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const params = useParams();
  const emailId = params.id as string;

  useEffect(() => {
    const fetchEmail = async () => {
      setIsLoading(true);
      try {
        const emailResponse = await getEmailById(Number(emailId));
        const emailData = emailResponse.data;

        // Ensure history is properly structured
        const processedHistory =
          emailData.history?.map((item: History, index: number) => {
            // First entry should always show "System" as assigned_by
            if (index === 0) {
              return {
                ...item,
                assigned_by: "System",
              };
            }
            // Subsequent entries should show the previous agent as assigned_by
            if (emailData.history && index > 0) {
              const prevAgent = emailData.history[index - 1].agent;
              return {
                ...item,
                assigned_by: prevAgent || "System",
              };
            }
            return item;
          }) || [];

        setEmail({
          ...emailData,
          history: processedHistory,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmail();
  }, [emailId, setIsLoading]);

  if (!email) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Email Management" pageName="Email History" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Email History for ID: {emailId}
              </h2>
              <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-md border p-3">
                  <p className="text-sm text-gray-500">Current Agent</p>
                  <p className="font-medium">{email.agent || "Unassigned"}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-medium">{email.status || "N/A"}</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {email.created_at
                      ? format(new Date(email.created_at), "PPpp")
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {email.history && email.history.length > 0
                      ? format(
                          new Date(
                            email.history[email.history.length - 1].date,
                          ),
                          "PPpp",
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {email.history && email.history.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Time</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sub-Category</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Assigned By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {email.history.map((history: History, index: number) => (
                      <TableRow key={history.id || index}>
                        <TableCell>
                          {history.date
                            ? format(new Date(history.date), "PPpp")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{history.total_time || "N/A"}</TableCell>
                        <TableCell>{history.category || "N/A"}</TableCell>
                        <TableCell>{history.sub_category || "N/A"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {history.query || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {history.remarks || "N/A"}
                        </TableCell>
                        <TableCell>{history.agent || "Unassigned"}</TableCell>
                        <TableCell>
                          {history.assigned_by ||
                            (index === 0
                              ? "System"
                              : email.history[index - 1]?.agent || "System")}
                        </TableCell>
                        <TableCell>
                          {history.status ||
                            (index === email.history.length - 1
                              ? email.status
                              : "N/A")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">
                No history data available for this email.
              </p>
            )}
            <div className="mt-4 flex justify-between">
              <Link href={`/task-management/emails/${emailId}`}>
                <Button className="rounded-full">Back to Email</Button>
              </Link>
              <Link href="/task-management/emails">
                <Button variant="destructive" className="rounded-full">
                  Back to List
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default EmailHistoryPage;
