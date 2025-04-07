import api from '@/lib/axios';
import { Role } from '@/types/Role';

interface ApiResponse {
    data: Role[];
  }
export const getRoles = async (): Promise<ApiResponse> => {
    const response = await api.get('/core/roles/');
    return response.data;
  };
export const getRole = async (id: number) => {
    const response = await api.get(`/core/roles/${id}`);
    return response.data;
};
export const createRole = async (data: Role) => api.post('/core/roles/', data);
export const updateRole = async (id: number, data: Role) => api.put(`/core/roles/${id}`, data);
export const deleteRole = async (id: number) => api.delete(`/core/roles/${id}`);
