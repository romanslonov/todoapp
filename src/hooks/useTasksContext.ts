import { useContext } from 'react';

import { TasksContext } from '@/context/tasks';

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('[useTasksContext] useSteps must be used within a StepsContext');
  }
  return context;
};
