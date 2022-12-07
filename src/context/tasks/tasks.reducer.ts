import type { Task } from '@/types/task';

import { Action, State } from './types';

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_TASKS': {
      return { tasks: action.payload };
    }
    case 'CREATE_TASK': {
      return {
        tasks: [action.payload.task, ...state.tasks],
      };
    }
    case 'CHANGE_STATUS_TASK': {
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? ({ ...task, status: action.payload.status } as Task)
            : task,
        ),
      };
    }
    case 'UPDATE_TASK': {
      return {
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...action.payload.data, id: action.payload.taskId }
            : task,
        ),
      };
    }
    case 'REMOVE_TASK': {
      return {
        tasks: state.tasks.filter((task) => task.id !== action.payload.taskId),
      };
    }
    default: {
      throw new Error();
    }
  }
};
