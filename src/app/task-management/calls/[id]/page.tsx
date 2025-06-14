"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { getCall, updateCall } from "@/services/CallService";
import { Call } from "@/types/Call";
import { useLoading } from "@/context/LoadingContext";

const EditCallPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { setIsLoading } = useLoading();
  const [formData, setFormData] = useState<Partial<Call>>({
    phone_number: "",
    query: "",
    status: "Pending",
    agent: "",
    category_id: 0,
    sub_categories: [],
    remarks: "",
  });

  useEffect(() => {
    const fetchCall = async () => {
      setIsLoading(true);
      try {
        const response = await getCall(Number(id));
        setFormData({
          phone_number: response.data.phone_number,
          query: response.data.query,
          status: response.data.status,
          agent: response.data.agent,
          category_id: response.data.category_id,
          sub_categories: response.data.sub_categories,
          remarks: response.data.remarks,
        });
      } catch (error) {
        Swal.fire("Error!", "Failed to fetch call data.", "error");
        router.push("/task-management/calls");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCall();
    }
  }, [id, router, setIsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateCall(Number(id), {
        ...formData,
        category_id: Number(formData.category_id),
        sub_categories: formData.sub_categories?.map(Number) || [],
      });
      await Swal.fire("Success!", "Call updated successfully.", "success");
      router.push("/task-management/calls");
    } catch (error) {
      Swal.fire("Error!", "Failed to update call.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Call" />
      <Card>
        <CardHeader>
          <CardTitle>Edit Call (ID: {id})</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="agent">Agent</Label>
                <Input
                  id="agent"
                  name="agent"
                  value={formData.agent || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                name="query"
                value={formData.query || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Input
                  id="category_id"
                  name="category_id"
                  type="number"
                  value={formData.category_id || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/task-management/calls")}
                disabled={false}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={false}>
                Update Call
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DefaultLayout>
  );
};

export default EditCallPage;
