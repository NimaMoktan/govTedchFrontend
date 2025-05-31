export type User = {
  id?: any; // Made optional
  username: string;
  cid?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no?: string;
  is_active: boolean;
  role_ids: number[];
  roles?: any[];
};
