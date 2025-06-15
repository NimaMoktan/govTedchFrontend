import { Master } from "./master/master";

export interface Query {
  id: number;
  type: string;
  email: string;
  phone_number: string;
  date: string;
  query: string;
  remarks: string;
  status?: { id: number; name: string };
  category?: { id: number; name: string };
  sub_category?: { id: number; name: string }[];
  start_date: string;
  end_date?: string;
  gender?: { id: number; name: string };
  dzongkhag?: { id: number; name: string };
  assigned_by?: { id: number; name: string };
  assigned_to?: { id: number; name: string };
  parent?: { id: number; name: string };
}
