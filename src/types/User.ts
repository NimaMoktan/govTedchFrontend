export type User = {
  id?: any; // Made optional
  name: string;
  type: string;
  username: string;
  cid?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  is_active: boolean;
  role_ids?: any[];
  role?: string;
  roles?: any[];
};
