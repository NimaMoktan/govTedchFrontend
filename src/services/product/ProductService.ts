import api from '@/lib/axios';
import { Product, ApplicationFormValues, Registration } from '@/types/product/Product';

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
  statusCode: number;
  timestamp: number;
}

interface ClaimApp{
  id: number;
  applicationNumber: string;
  serviceId: number;
  statusId: number;
  parameter: string;
  taskStatusId: number;
}

export const getProducts = async (): Promise<ApiResponse<Registration[]>> => {
  const response = await api.get<ApiResponse<Registration[]>>('/product/workflow/populateWorkflowDtls');
  return response.data;
};

export const getProductsByUser = async (): Promise<ApiResponse<Registration[]>> => {
  const response = await api.get<ApiResponse<Registration[]>>('/product/workflow/populateClaimedWorkflowDtls');
  return response.data;
};

export const claimApplication = async (data: ClaimApp): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/workflow/openAndClaimApplication', data);
  return response.data;
};

export const updateWorkFlow = async (data: ClaimApp): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/workflow/updateWorkflow', data);
  return response.data;
};

// upload row data
export const uploadRawData = async (data: any): Promise<ApiResponse<Product>> => {
  
  const response = await api.post<ApiResponse<Product>>('/product/workflow/uploadRawDocFile', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
  return response.data;
};

// upload test result
export const uploadResultFile = async (data: ClaimApp): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/workflow/uploadDocFile', data);
  return response.data;
};

// export const getProduct = async (id: number): Promise<ApiResponse<ApplicationFormValues>> => {
//   const response = await api.get<ApplicationFormValues>(`/product/productForm/register/${id}`);
//   return response.data;
// };

export const getProduct = async (id: number) => api.get(`/product/productForm/registeredUser/${id}`);

export const getProductByAppNumber = async (appNumber: string) => api.get(`/product/workflow/fetchByApplicationNo?applicationNumber=${appNumber}`);

export const createProduct = async (data: ApplicationFormValues): Promise<ApiResponse<Product>> => {
  const response = await api.post<ApiResponse<Product>>('/product/productForm/saveRegistrationDetails', data);
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
