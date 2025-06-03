"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Email, EmailHistory } from "@/types/Email";
import { getEmailHistory } from "@/services/EmailService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default function EmailHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [email, setEmail] = useState<Email | null>(null);
  const [history, setHistory] = useState<EmailHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emailResponse, historyResponse] = await Promise.all([
          getEmail(params.id),
          getEmailHistory(params.id),
        ]);
        setEmail(emailResponse.data);
        setHistory(historyResponse.data);
      } catch (error) {
        toast.error("Failed to load email history");
        router.push("/task-management/emails");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!email) return <div className="p-8 text-center">Email not found</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Email History" />
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Current Details</h3>
                <Link href={`/task-management/emails/${email.id}`}>
                  <Button variant="outline">Edit Email</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{email.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agent</p>
                  <p className="font-medium">{email.agent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {format(new Date(email.created_at), "MMM dd, yyyy h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">History</h3>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-gray-500">
                  No history available
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="rounded border p-4">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {format(
                            new Date(item.changed_at),
                            "MMM dd, yyyy h:mm a",
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Changed by: {item.changed_by || "System"}
                        </p>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {Object.entries(item.changes).map(([field, change]) => (
                          <div key={field}>
                            <p className="text-sm font-medium capitalize">
                              {field.replace("_", " ")}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-red-500 line-through">
                                {change.old}
                              </p>
                              <span>→</span>
                              <p className="text-sm text-green-500">
                                {change.new}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}
