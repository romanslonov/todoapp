import { useReducer } from 'react';

import { TasksContext } from '.';
import { reducer } from './tasks.reducer';

export const TasksProvider = ({ children }) => {
  const [{ tasks }, dispatch] = useReducer(reducer, { tasks: [] });

  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>{children}</TasksContext.Provider>
  );
};
