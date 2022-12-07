import { createContext, Dispatch } from 'react';

import type { Task } from '@/types/task';

import type { Action } from './types';

export const TasksContext = createContext<{ tasks: Task[]; dispatch: Dispatch<Action> }>({
  tasks: [],
  dispatch: () => null,
});
