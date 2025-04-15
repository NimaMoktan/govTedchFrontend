import api from '@/lib/axios';
import { Product } from '@/types/product/Product';

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
  const response = await api.get<ApiResponse<Product[]>>('/product/products/all');
  return response.data;
};

export const getProduct = async (id: number): Promise<ApiResponse<Product>> => {
  const response = await api.get<ApiResponse<Product>>(`/product/products/${id}`);
  return response.data;
};

export const createProduct = async (data: Product): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/products/registrer', data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: Product
): Promise<ApiResponse<Product>> => {
  const response = await api.put<ApiResponse<Product>>(`/product/products/update/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/product/products/delete/${id}`);
  return response.data;
};
