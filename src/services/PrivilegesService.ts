import api from '@/lib/axios';
import { Privilege } from '@/types/Privilege';

interface ApiResponse {
    data: Privilege[];
  }
export const getPrivileges = async (): Promise<ApiResponse> => {
    const response = await api.get('/permissions');
    return response.data;
  };
export const createPrivilege = async (data: Privilege) => api.post('/permissions', data);
export const updatePrivilege = async (id: number, data: Privilege) => api.put(`/permissions/${id}`, data);
export const deletePrivilege = async (id: number) => api.delete(`/permissions/${id}`);
