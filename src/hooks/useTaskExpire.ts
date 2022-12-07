import { isAfter } from 'date-fns';
import { useEffect, useRef } from 'react';

import { Task } from '@/types/task';

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
