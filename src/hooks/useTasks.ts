import { TaskPayload } from '@/context/tasks/types';
import { useTasksContext } from '@/hooks/useTasksContext';
import { Task, TaskStatus } from '@/types/task';

import { useFirestoreDocuments } from './useFirestoreDocuments';

export const useTasks = () => {
  const { tasks, dispatch } = useTasksContext();
  const {
    fetch: fetchDocuments,
    create: createDocument,
    update: updateDocument,
    remove: removeDocument,
  } = useFirestoreDocuments();

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
