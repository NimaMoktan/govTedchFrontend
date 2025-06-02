import api from "@/lib/axios";
import { User } from "@/types/User";

interface ApiResponse<T> {
  data: results;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface results {
  [x: string]: any;
  results: User[];
}

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get("user-management/users/");
  return response.data;
};
export const createUser = async (data: User) => {
  return api.post("user-management/users/", data);
};
export const getUser = async (id: number) =>
  api.get(`/user-management/users/${id}`);

export const updateUser = async (id: number, data: User) => {
  const modifiedPayload = {
    ...data,
  };
  return api.post(`/user-management/users/${id}/`, modifiedPayload);
};
export const deleteUser = async (id: number) =>
  api.delete(`user-management/users/${id}/`);
