export type User = {
  id?: any; // Made optional
  username: string;
  //   cid: string;
  firstName: string;
  lastName: string;
  email: string;
  //   mobile: string;
  //   roles: object[];
  is_active: boolean;
  role_ids: number[];
};
