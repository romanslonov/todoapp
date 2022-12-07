import { isAfter } from 'date-fns';
import { useEffect, useRef } from 'react';

import { Task } from '@/types/task';

/**
 * Hook that checks `Task` due date and run callback when it's expire.
 * @param task - Task that should be watched.
 * @param callback - A function that should be invoked when task will be expired.
 */
export const useTaskExpire = (task: Task, callback: () => void) => {
  if (!callback) {
    throw new Error('[useTaskExpire] Please provide callback function.');
  }

  const intervalId = useRef<number>();

  const handler = () => {
    if (task.due && isAfter(new Date(), task.due)) {
      callback();

      window.clearInterval(intervalId.current);
    }
  };

  useEffect(() => {
    if (task.due === null || task.status !== 'active') {
      return;
    }

    intervalId.current = window.setInterval(handler, 1000);

    return () => window.clearInterval(intervalId.current);
  }, [task]);
};
