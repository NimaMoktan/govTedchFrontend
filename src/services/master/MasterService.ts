import { Master } from '@/types/master/master';
import api from '@/lib/axios';

interface ApiResponse<T> {
  data: results;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface results {
    [x: string]: any;
    results: Master[];
}

export const getMastersByType = async (type: string): Promise<ApiResponse<Master[]>> => {
  const response = await api.get(`master-management/?type=${type}`);
  return response.data;
};

export const getParentMastersByType = async (type: string): Promise<ApiResponse<any[]>> => {
  const response = await api.get(`master-management/parent/?type=${type}`);
  return response.data;
};

export const createMaster = async (data: Master) => api.post('master-management/', data);

export const getMasterById = async (id: number) => api.get(`master-management/${id}`);

export const updateMaster = async (id: number, data: Master) => api.put(`master-management/${id}/`, data);

export const deleteMaster = async (id: number) => api.delete(`master-management/${id}`);
