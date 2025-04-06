import api from '@/lib/axios';
import { Privilege } from '@/types/Privilege';

interface ApiResponse {
    data: Privilege[];
  }
export const getPrivileges = async (): Promise<ApiResponse> => {
    const response = await api.get('/core/privileges/');
    return response.data;
  };
export const createPrivilege = async (data: Privilege) => api.post('/core/privileges/', data);
export const updatePrivilege = async (id: number, data: Privilege) => api.post(`/core/privileges/${id}/update`, data);
export const deletePrivilege = async (id: number) => api.post(`/core/privileges/${id}/delete`);
