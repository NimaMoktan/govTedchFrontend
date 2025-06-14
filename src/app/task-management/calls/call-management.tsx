"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { DataTable } from "./table";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Call, History } from "@/types/Call";
import { getCalls, deleteCall } from "@/services/CallService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, Clock, User, Tag, MessageSquare } from "lucide-react";

const CallManagement = () => {
  const [callList, setCallList] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  // Enhanced demo data with proper assignment tracking
  const democalls: Call[] = [
    {
      id: 1,
      phone_number: "1760981245",
      query: "Issue with payment processing",
      status: "In-Progress",
      agent: "Agent B",
      category_id: 1,
      sub_categories: [1, 2],
      start_time: "2025-06-10T09:00:00Z",
      end_time: "",
      remarks: "Investigating payment gateway issue",
      is_active: true,
      created_at: "2025-06-10T08:00:00Z",
      history: [
        {
          id: 1,
          date: "2025-06-10T09:00:00Z",
          total_time: "0h 30m",
          category: "Billing",
          sub_category: "Payment",
          query: "Issue with payment processing",
          remarks: "Initial review of payment issue",
          agent: "Agent A",
          assigned_by: "System",
          previous_agent: null,
          assignment_chain: ["System"],
        },
        {
          id: 2,
          date: "2025-06-10T10:00:00Z",
          total_time: "1h 0m",
          category: "Billing",
          sub_category: "Payment",
          query: "Issue with payment processing",
          remarks: "Reassigned to senior agent",
          agent: "Agent B",
          assigned_by: "Agent A",
          previous_agent: "Agent A",
          assignment_chain: ["System", "Agent A"],
        },
      ],
      assigned_by: "Agent A",
      assignment_chain: ["System", "Agent A"],
    },
    {
      id: 2,
      phone_number: "17856245892",
      query: "Product delivery status",
      status: "Completed",
      agent: "Agent B",
      category_id: 2,
      sub_categories: [3],
      start_time: "2025-06-09T10:00:00Z",
      end_time: "2025-06-09T12:00:00Z",
      remarks: "Product delivered successfully",
      is_active: true,
      created_at: "2025-06-09T09:00:00Z",
      history: [
        {
          id: 1,
          date: "2025-06-09T10:00:00Z",
          total_time: "2h 0m",
          category: "Delivery",
          sub_category: "Tracking",
          query: "Product delivery status",
          remarks: "Confirmed delivery with courier",
          agent: "Agent B",
          assigned_by: "System",
          previous_agent: null,
          assignment_chain: ["System"],
        },
      ],
      assigned_by: "System",
      assignment_chain: ["System"],
    },
    {
      id: 3,
      phone_number: "1758654555",
      query: "Technical support needed",
      status: "Pending",
      agent: "Agent D",
      category_id: 3,
      sub_categories: [4],
      start_time: "2025-06-11T08:00:00Z",
      end_time: "",
      remarks: "Awaiting technical team response",
      is_active: true,
      created_at: "2025-06-11T07:00:00Z",
      history: [
        {
          id: 1,
          date: "2025-06-11T08:00:00Z",
          total_time: "0h 0m",
          category: "Technical",
          sub_category: "Support",
          query: "Technical support needed",
          remarks: "Assigned to technical team",
          agent: "Agent C",
          assigned_by: "System",
          previous_agent: null,
          assignment_chain: ["System"],
        },
        {
          id: 2,
          date: "2025-06-11T09:00:00Z",
          total_time: "1h 0m",
          category: "Technical",
          sub_category: "Support",
          query: "Technical support needed",
          remarks: "Reassigned to senior technician",
          agent: "Agent D",
          assigned_by: "Agent C",
          previous_agent: "Agent C",
          assignment_chain: ["System", "Agent C"],
        },
      ],
      assigned_by: "Agent C",
      assignment_chain: ["System", "Agent C"],
    },
  ];

  const handleEditCall = (call: call) => {
    router.push(`/task-management/calls/${call.id}`);
  };

  const handleViewCall = (call: call) => {
    // Process the history to ensure proper assignment chain is displayed
    const processedCall = {
      ...call,
      history:
        call.history?.map((entry, index) => ({
          ...entry,
          assigned_by:
            index === 0 ? "System" : call.history[index - 1].agent || "System",
          previous_agent: index > 0 ? call.history[index - 1].agent : null,
          assignment_chain:
            index === 0
              ? ["System"]
              : [
                  ...(call.history[index - 1].assignment_chain || ["System"]),
                  call.history[index - 1].agent,
                ],
        })) || [],
    };
    setSelectedCall(processedCall);
    setIsHistoryDialogOpen(true);
  };

  const fetchCalls = async () => {
    setIsLoading(true);
    try {
      const response = await getCalls();
      // Process the API response to ensure proper assignment tracking
      const processedCalls = response.data.map((call: Call) => ({
        ...call,
        history:
          call.history?.map((entry, index) => ({
            ...entry,
            assigned_by:
              index === 0
                ? "System"
                : call.history[index - 1].agent || "System",
            previous_agent: index > 0 ? call.history[index - 1].agent : null,
            assignment_chain:
              index === 0
                ? ["System"]
                : [
                    ...(call.history[index - 1].assignment_chain || ["System"]),
                    call.history[index - 1].agent,
                  ],
          })) || [],
      }));
      setCallList([...demoCalls, ...processedCalls]);
    } catch (error) {
      console.error("Error fetching calls:", error);
      setCallList(democalls);
      Swal.fire("Error!", "Failed to fetch calls. Showing demo data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (call: Call) => {
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
        await deleteCall(call.id);
        await Swal.fire("Deleted!", "The call has been deleted.", "success");
        fetchCalls();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete Calls.", "error");
      }
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardContent className="max-w-full overflow-x-auto p-4">
          <DataTable
            columns={columns(handleEditCall, handleDelete, handleViewCall)}
            data={callList}
            handleAdd={() => router.push("/call-management/calls/create")}
          />
        </CardContent>
      </Card>
      {selectedCall && (
        <Dialog
          open={isHistoryDialogOpen}
          onOpenChange={(open) => {
            setIsHistoryDialogOpen(open);
            if (!open) setSelectedCall(null);
          }}
        >
          <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Call History for {selectedCall.call} (ID: {selectedCall.id})
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              {selectedCall.history && selectedCall.history.length > 0 ? (
                <div className="space-y-4">
                  {selectedCall.history.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {entry.date
                            ? format(new Date(entry.date), "PPpp")
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
                          <div className="mb-1 flex items-center">
                            <Tag className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              <strong>Status:</strong>{" "}
                              {index === selectedCall.history.length - 1
                                ? selectedCall.status
                                : "N/A"}
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
                              <strong>Remarks:</strong> {entry.remarks || "N/A"}
                            </span>
                          </div>
                          <div className="mb-1 flex items-center">
                            <User className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              <strong>Agent:</strong>{" "}
                              {entry.agent || "Unassigned"}
                            </span>
                          </div>
                          <div className="mb-1 flex items-center">
                            <User className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              <strong>Assigned By:</strong>{" "}
                              {entry.assigned_by || "System"}
                            </span>
                          </div>
                          {entry.previous_agent && (
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                <strong>Previous Agent:</strong>{" "}
                                {entry.previous_agent}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              <strong>Assignment Chain:</strong>{" "}
                              {entry.assignment_chain?.join(" → ") || "System"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  No history available for this call.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CallManagement;
