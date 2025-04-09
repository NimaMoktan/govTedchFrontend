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
  const modifiedPayload = {
    ...data,
    userRoles: data.userRoles.map(roleId => ({ id: parseInt(String(roleId)) })),
};
  return api.post('/core/user/', modifiedPayload)
};
export const getUser = async (id: number) => api.get(`/core/user/${id}`);
export const updateUser = async (id: number, data: User) =>{
  const modifiedPayload = {
    ...data,
    userRoles: data.userRoles.map(roleId => ({ id: parseInt(String(roleId)) })),}
  return api.post(`/core/user/${id}/update`, modifiedPayload);
} 
export const deleteUser = async (id: number) => api.post(`/core/user/${id}/delete`);
