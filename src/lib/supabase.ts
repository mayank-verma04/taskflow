import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Task = {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  description: string | null;
  status: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  tags: string[];
};

export type TaskInsert = Omit<Task, 'id' | 'created_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>;

// --- Comment Types ---
export type Comment = {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type CommentInsert = Omit<Comment, 'id' | 'created_at'>;