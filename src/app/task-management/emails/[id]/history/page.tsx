"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Email } from "@/types/Email";
import { getEmailById } from "@/services/EmailService";
import { getParentMastersByType } from "@/services/master/MasterService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Category {
  id: number;
  name: string;
  parent: { id: number } | null;
}

const EmailHistoryPage = () => {
  const [email, setEmail] = useState<Email | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const params = useParams();
  const emailId = params.id as string;

  useEffect(() => {
    const fetchEmailAndCategories = async () => {
      setIsLoading(true);
      try {
        // Fetch email details
        const emailResponse = await getEmailById(Number(emailId));
        setEmail(emailResponse.data);

        // Fetch categories
        const categoryResponse = await getParentMastersByType("category");
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmailAndCategories();
  }, [emailId, setIsLoading]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const getSubCategoryNames = (subCategoryIds: number[]) => {
    return (
      subCategoryIds
        .map((id) => {
          const subCategory = categories.find((cat) => cat.id === id);
          return subCategory ? subCategory.name : null;
        })
        .filter((name) => name !== null)
        .join(", ") || "N/A"
    );
  };

  const calculateTotalTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "N/A";
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end.getTime() - start.getTime();
      if (diffMs < 0) return "Invalid";
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return "Invalid";
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb parentPage="Email Management" pageName="Email History" />
      <Card className="min-h-screen w-full">
        <CardContent className="min-h-screen max-w-full overflow-x-auto">
          <div className="flex flex-col gap-2">
            <h2 className="mb-4 text-xl font-semibold">
              Email History for ID: {emailId}
            </h2>
            {email ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Time Taken</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sub-Category</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {email.created_at
                          ? format(new Date(email.created_at), "PPp")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {calculateTotalTime(email.start_time, email.end_time)}
                      </TableCell>
                      <TableCell>
                        {getCategoryName(email.category_id)}
                      </TableCell>
                      <TableCell>
                        {getSubCategoryNames(email.sub_categories)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {email.query || "N/A"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {email.remarks || "N/A"}
                      </TableCell>
                      <TableCell>{email.agent || "Unassigned"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No email data available.</p>
            )}
            <Link href="/task-management/emails">
              <Button variant="destructive" className="mt-4 rounded-full">
                Back
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default EmailHistoryPage;
