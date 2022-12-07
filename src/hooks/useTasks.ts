import { TaskPayload } from '@/context/tasks/types';
import { useTasksContext } from '@/hooks/useTasksContext';
import { Task, TaskStatus } from '@/types/task';

import { useFirestoreDocuments } from './useFirestoreDocuments';

/**
 * Hook that uses `useFirestoreDocuments` hook to manage Tasks and updates a context.
 * @returns A number of fuctions to manage `Tasks`.
 */
export const useTasks = () => {
  const { tasks, dispatch } = useTasksContext();
  const {
    fetch: fetchDocuments,
    create: createDocument,
    update: updateDocument,
    remove: removeDocument,
  } = useFirestoreDocuments();

  /**
   * The function gets all `Tasks` from the databse and sets to the context.
   */
  const fetch = async () => {
    try {
      const documents = await fetchDocuments('tasks');

      const tasks = documents.map((document) => {
        const data = document.data();
        return {
          ...data,
          id: document.id,
          due: data.due ? data.due.toDate() : null,
          created_at: data.created_at.toDate(),
        } as Task;
      });

      dispatch({
        type: 'SET_TASKS',
        payload: tasks,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function creates a `Task` in the databse and sets to the context.
   * @param payload - Data to create a `Task`.
   */
  const create = async (payload: TaskPayload) => {
    try {
      const document = await createDocument('tasks', payload);

      dispatch({
        type: 'CREATE_TASK',
        payload: { task: { ...payload, id: document.id } },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function changes the status of a `Task` and updates it in the context.
   * @param {string} taskId - Unique udentifier of a task.
   * @param {string} status - One of the available statuses like `active`, `expired`, `completed`.
   */
  const changeStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await updateDocument('tasks', taskId, { status });
      dispatch({
        type: 'CHANGE_STATUS_TASK',
        payload: {
          taskId,
          status,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function updates a `Task` data in the database and the context.
   * @param {string} taskId - Unique udentifier of a task.
   * @param {string} data - Data to update.
   */
  const update = async (taskId: string, data: TaskPayload) => {
    try {
      await updateDocument('tasks', taskId, data);
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          taskId,
          data,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function removes a `Task` from the database and the context.
   * @param {string} taskId - Unique udentifier of a task.
   */
  const remove = async (taskId: string) => {
    try {
      await removeDocument('tasks', taskId);
      dispatch({
        type: 'REMOVE_TASK',
        payload: {
          taskId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  return { tasks, fetch, create, changeStatus, update, remove };
};
