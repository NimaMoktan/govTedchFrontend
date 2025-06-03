import { Master } from "./master/master";

export type Noticeboard = {
  id?: any; // Made optional
  question: string;
  answer?: string;
  priority?: string;
  category_id?: string;
  sub_categories?: string;
  is_active?: boolean;
  category?: Master
};
