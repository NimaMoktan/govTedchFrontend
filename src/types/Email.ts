export interface EmailHistory {
  id: string;
  email_id: string;
  changed_at: string;
  changed_by: string;
  changes: {
    [key: string]: {
      old: string;
      new: string;
    };
  };
}

export interface Email {
  data: any;
  id: string;
  email: string;
  query: string;
  status: string;
  agent: string;
  category?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}
