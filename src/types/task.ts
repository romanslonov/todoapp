export type TaskStatus = 'active' | 'expired' | 'completed';

export type TaskFile = {
  id: string;
  name: string;
  path: string;
};

export type Task = {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  created_at: Date;
  due: Date | null;
  files: TaskFile[];
};
