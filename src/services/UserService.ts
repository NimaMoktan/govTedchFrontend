import api from '@/lib/axios';
import { User } from '@/types/User';

interface ApiResponse {
    data: User[];
  }
export const getUsers = async (): Promise<ApiResponse> => {
    const response = await api.get('/core/user/');
    return response.data;
  };
export const createUser = async (data: User) => {
  console.log("User data:", data);
  const modifiedPayload = {
    ...data,
    userRoles: data.userRoles.map(roleId => ({ id: parseInt(String(roleId)) })),
};
  return api.post('/core/user/', modifiedPayload)
};
export const updateUser = async (id: number, data: User) => api.put(`/core/user/${id}/update`, data);
export const deleteUser = async (id: number) => api.post(`/core/user/${id}/delete`);
