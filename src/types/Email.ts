export interface Email {
  id: number;
  email: string;
  query: string;
  status: string;
  agent: string;
  category_id: number;
  sub_categories: number[];
  start_time: string;
  end_time: string;
  remarks: string;
  is_active: boolean;
  created_at: string;
  history?: History[];
}

export interface History {
  id: number;
  date: string;
  total_time: string;
  category: string;
  sub_category: string;
  query: string;
  remarks: string;
  agent: string;
}

export interface Noticeboard {
  id?: number;
  email: string;
  query: string;
  status: string;
  agent: string;
  category_id: string;
  category?: number;
  sub_categories: number[];
  start_time: string;
  end_time: string;
  remarks: string;
  is_active: boolean;
}
