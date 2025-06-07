import { Email } from "@/types/Email";
import api from "@/lib/axios";

const mockEmails: Email[] = [
  {
    id: "1",
    email: "john@example.com",
    query: "Password reset request",
    status: "pending",
    category: "Account",
    subCategories: ["Password"],
    agent: "Agent Smith",
    remarks: "User forgot password",
    is_active: true,
    created_at: "2023-05-15T10:00:00Z",
  },
  {
    id: "2",
    email: "jane@example.com",
    query: "Billing inquiry",
    status: "in_progress",
    category: "Payment",
    subCategories: ["Invoice"],
    agent: "Agent Johnson",
    remarks: "Waiting for payment confirmation",
    is_active: true,
    created_at: "2023-05-16T14:30:00Z",
  },
];

export const getEmails = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { data: mockEmails };
};

export const getEmail = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const email = mockEmails.find((e) => e.id === id);
  if (!email) throw new Error("Email not found");
  return { data: email };
};

export const createEmail = async (data: Email) => {
  return api.post("task-management/", data);
};

// export const updateEmail = async (id: string, data: Email) => {
//   await new Promise((resolve) => setTimeout(resolve, 500));
//   const index = mockEmails.findIndex((e) => e.id === id);
//   if (index === -1) throw new Error("Email not found");
//   mockEmails[index] = { ...mockEmails[index], ...data };
//   return { data: mockEmails[index] };
// };

export const deleteEmail = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockEmails.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Email not found");
  mockEmails.splice(index, 1);
};

export const updateEmail = async (id: number, data: Email) => {
  const modifiedPayload = {
    ...data,
  };
  return api.post(`/task-management/${id}/`, modifiedPayload);
};

export const getEmailHistory = async (id: string) => {
  const response = await api.get(`/emails/${id}/history`);
  return response;
};
