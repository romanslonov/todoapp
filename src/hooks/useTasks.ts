import { isAfter, parseISO } from 'date-fns';
import { UploadResult } from 'firebase/storage';

import { TaskPayload } from '@/context/tasks/types';
import { useTasksContext } from '@/hooks/useTasksContext';
import { Task, TaskStatus } from '@/types/task';

import { useFirestoreDocuments } from './useFirestoreDocuments';
import { useStorage } from './useStorage';

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
  const { upload, getFileDownloadURL } = useStorage();

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
   * The function uploads files and creates a `Task` in the databse and dispatch to the context.
   * @param payload - Data to create a `Task`.
   */
  const create = async (payload: TaskPayload) => {
    try {
      const promises: Promise<UploadResult>[] = [];

      if (payload.files.length) {
        payload.files.forEach((file) => {
          promises.push(upload(file));
        });
      }
      const uploads = await Promise.all(promises);

      const task: Omit<Task, 'id'> = {
        ...payload,
        ...{ due: payload.due ? new Date(payload.due) : null },
        created_at: new Date(),
        status: 'active',
        files: uploads.map((file) => ({
          name: file.ref.name,
          path: file.ref.fullPath,
          id: file.metadata.md5Hash!,
        })),
      };

      const document = await createDocument('tasks', task);

      dispatch({
        type: 'CREATE_TASK',
        payload: { task: { ...task, id: document.id } },
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
   * @param {object} task - Original task that needs to update.
   * @param {object} data - Data to update.
   */
  const update = async (task: Task, data: TaskPayload) => {
    try {
      const promises: Promise<UploadResult>[] = [];

      if (data.files.length) {
        data.files.forEach((file) => {
          promises.push(upload(file));
        });
      }
      const uploads = await Promise.all(promises);

      console.log(data);

      const payload: Task = {
        ...task,
        ...data,
        status: data.due
          ? isAfter(new Date(), parseISO(data.due))
            ? 'expired'
            : 'active'
          : 'active',
        ...{ due: data.due ? new Date(data.due) : null },
        files: [
          ...(uploads.length
            ? uploads.map((file) => ({
                name: file.ref.name,
                path: file.ref.fullPath,
                id: file.metadata.md5Hash!,
              }))
            : []),
          ...(task ? task.files : []),
        ],
      };

      await updateDocument('tasks', task.id, payload);

      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          taskId: task.id,
          data: payload,
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
