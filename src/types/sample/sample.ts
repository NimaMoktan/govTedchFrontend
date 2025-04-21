export type SampleType = {
    id: number;
    code: string;
    description: string;
    active: 'Y' | 'N'; // assuming it could be either 'Y' or 'N'
    created_by: string;
    created_date: string | null;
    last_updated_by: string;
    last_updated_date: string | null;
    productTestTypes: any[]; // you can replace `any` with a specific type if you know the structure
  };

  export type ApiResponse = {
      timestamp: number;
      statusCode: number;
      status: string;
      message: string;
      data: SampleType;
    }