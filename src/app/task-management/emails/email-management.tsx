"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Email, History } from "@/types/Email";
import { getEmails, deleteEmail } from "@/services/EmailService";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, User, Tag, MessageSquare } from "lucide-react";

const EmailManagement = () => {
  const [emailList, setEmailList] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  // Demo history data
  const generateDemoHistory = (email: Email): History[] => [
    {
      id: 1,
      date: "2025-06-10T10:00:00Z",
      total_time: "1h 45m",
      category: "Support",
      sub_category: "Technical, Billing",
      query: "Initial customer query about service outage",
      remarks: "Investigated issue, provided temporary workaround",
      agent: "Agent A",
    },
    {
      id: 2,
      date: "2025-06-10T14:30:00Z",
      total_time: "0h 30m",
      category: "Support",
      sub_category: "Technical",
      query: "Follow-up on service outage",
      remarks: "Confirmed issue resolved after server restart",
      agent: "Agent B",
    },
    {
      id: 3,
      date: "2025-06-11T09:15:00Z",
      total_time: "2h 0m",
      category: "Support",
      sub_category: "Billing",
      query: "Billing dispute",
      remarks: "Processed refund and updated billing details",
      agent: "Agent C",
    },

    {
      id: 4,
      date: "2025-06-11T09:15:00Z",
      total_time: "2h 0m",
      category: "Support",
      sub_category: "Billing",
      query: "Billing dispute",
      remarks: "Processed refund and updated billing details",
      agent: "Agent C",
    },
  ];

  const handleEditEmail = (email: Email) => {
    router.push(
      `/task-management/emails/${email.id}?start_time=${email.start_time}`,
    );
  };

  const handleViewEmail = (email: Email) => {
    try {
      const emailWithHistory = {
        ...email,
        history: generateDemoHistory(email),
      };
      setSelectedEmail(emailWithHistory);
      setIsHistoryDialogOpen(true);
    } catch (error) {
      console.error("Error in handleViewEmail:", error);
      Swal.fire("Error!", "Failed to load history. Please try again.", "error");
    }
  };

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await getEmails();
      console.log("Fetched emails:", response.data);
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
        fetchEmails();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete email.", "error");
      }
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto p-4">
          <DataTable
            columns={columns(handleEditEmail, handleDelete, handleViewEmail)}
            data={emailList}
            handleAdd={() => router.push("/task-management/emails/create")}
          />
        </CardContent>
      </Card>

      {selectedEmail && (
        <Dialog
          open={isHistoryDialogOpen}
          onOpenChange={(open) => {
            setIsHistoryDialogOpen(open);
            if (!open) setSelectedEmail(null);
          }}
        >
          <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Email History for {selectedEmail.email} (ID: {selectedEmail.id})
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              {selectedEmail.history && selectedEmail.history.length > 0 ? (
                <div className="relative">
                  {/* Timeline vertical line */}
                  <div className="absolute bottom-0 left-4 top-0 w-1 bg-gray-300"></div>
                  {selectedEmail.history.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`mb-8 flex items-start ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Timeline marker */}
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                        <div className="z-10 h-4 w-4 rounded-full border-4 border-white bg-blue-500"></div>
                      </div>
                      {/* History card */}
                      <div
                        className={`mx-4 flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-md ${
                          index % 2 === 0 ? "mr-auto" : "ml-auto"
                        } max-w-[calc(100%-3rem)]`}
                      >
                        <div className="mb-2 flex items-center">
                          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {entry.date
                              ? format(new Date(entry.date), "PPp")
                              : "N/A"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="mb-1 flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Total Time:</strong>{" "}
                                {entry.total_time || "N/A"}
                              </span>
                            </div>
                            <div className="mb-1 flex items-center">
                              <Tag className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Category:</strong>{" "}
                                {entry.category || "N/A"}
                              </span>
                            </div>
                            <div className="mb-1 flex items-center">
                              <Tag className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Sub-Category:</strong>{" "}
                                {entry.sub_category || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-start">
                              <MessageSquare className="mr-1 mt-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Query:</strong> {entry.query || "N/A"}
                              </span>
                            </div>
                            <div className="mb-1 flex items-start">
                              <MessageSquare className="mr-1 mt-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Remarks:</strong>{" "}
                                {entry.remarks || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Agent:</strong>{" "}
                                {entry.agent || "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No history available for this email.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EmailManagement;
