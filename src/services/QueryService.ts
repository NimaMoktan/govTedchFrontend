import api from "@/lib/axios";
import { Query } from "@/types/Query";

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface Results {
  results: Query[];
  count: number;
  next: number | null;
  previous: number | null;
}

export const getQuerysByType = async (
  type: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  ordering: string = "",
): Promise<ApiResponse<Results>> => {
  const queryParams = new URLSearchParams({
    type,
    page: page.toString(),
    page_size: pageSize.toString(),
    ...(search && { search }),
    ...(ordering && { ordering }),
  });

  const response = await api.get(`query-management/?${queryParams.toString()}`);
  return response.data;
};

// export const getParentQuerysByType = async (
//   type: string,
// ): Promise<ApiResponse<any[]>> => {
//   const response = await api.get(`query-management/parent/?type=${type}`);
//   return response.data;
// };

export const createQuery = async (data: Query) =>
  api.post("query-management/", data);

export const getQueryById = async (id: number) =>
  api.get(`query-management/${id}`);

export const updateQuery = async (id: number, data: Query) =>
  api.put(`query-management/${id}/`, data);

export const deleteQuery = async (id: number) =>
  api.delete(`query-management/${id}/`);
