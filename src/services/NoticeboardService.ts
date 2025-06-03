import api from "@/lib/axios";
import { Noticeboard } from "@/types/Noticeboard";

interface ApiResponse<T> {
  data: results;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface results {
  [x: string]: any;
  results: Noticeboard[];
}

export const getNoticeboards = async (): Promise<
  ApiResponse<Noticeboard[]>
> => {
  const response = await api.get("notice-management/");
  return response.data;
};
export const createNoticeboard = async (data: Noticeboard) => {
  return api.post("notice-management/", data);
};
export const getNoticeboard = async (id: number) =>
  api.get(`/notice-management/${id}/`);

export const updateNoticeboard = async (id: number, data: Noticeboard) => {
  const modifiedPayload = {
    ...data,
  };
  return api.post(`/notice-management/${id}/`, modifiedPayload);
};
export const deleteNoticeboard = async (id: number) =>
  api.delete(`notice-management/${id}/`);
