import api from "@/lib/axios";
import { User } from "@/types/User";

interface ApiResponse {
  results: User[];
}
export const getUsers = async (): Promise<ApiResponse> => {
  const response = await api.get("user-management/users/");
  return response.data;
};
export const createUser = async (data: User) => {
  const modifiedPayload = {
    ...data,
    // userRoles: data.roles.map((roleId) => ({
    //   id: parseInt(String(roleId)),
    // })),
  };
  return api.post("user-management/users/", data);
};
export const getUser = async (id: number) => api.get(`/core/user/${id}`);

export const updateUser = async (id: number, data: User) => {
  const modifiedPayload = {
    ...data,
  };
  return api.post(`/core/user/${id}/update`, modifiedPayload);
};
export const deleteUser = async (id: number) =>
  api.delete(`user-management/users/${id}/`);
