import { useContext } from 'react';

import { TasksContext } from '@/context/tasks';

/**
 * Hook that gets `Tasks` context and checks if it's available.
 * @returns The context of Tasks or undefined if it was used outside of `TasksProvider`.
 */
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('[useTasksContext] useTasks must be used within a TasksContext.');
  }
  return context;
};
