import type { Task, TaskStatus } from '@/types/task';

// export type TaskPayload = Omit<Task, 'id'>;
export type TaskPayload = {
  title: string;
  content: string;
  due: string;
  files: File[];
};

export type State = { tasks: Task[] };

export type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'CREATE_TASK'; payload: { task: Task } }
  | { type: 'CHANGE_STATUS_TASK'; payload: { taskId: string; status: TaskStatus } }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; data: Task } }
  | { type: 'REMOVE_TASK'; payload: { taskId: string } };
