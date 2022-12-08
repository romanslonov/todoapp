import { isAfter, parseISO } from 'date-fns';
import { UploadResult } from 'firebase/storage';
import { nanoid } from 'nanoid';

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
  const collection = 'tasks';
  const { tasks, dispatch } = useTasksContext();
  const {
    fetch: fetchDocuments,
    create: createDocument,
    update: updateDocument,
    remove: removeDocument,
  } = useFirestoreDocuments();
  const { upload: uploadFile, remove: removeFile } = useStorage();

  /**
   * The function that inject a unique id in file's name.
   *
   * NOTE: We need this a little hack to prevent file duplication the `Storage`.
   *
   * @param files - Original array passed from the user.
   * @returns An array of modified files.
   */
  const addHashToFilesNames = (files: File[]) =>
    files.map((file) => {
      const name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const extension = file.name.split('.').pop();
      return new File([file], `${name}.${nanoid()}.${extension}`);
    });

  /**
   * The function gets all `Tasks` from the databse and sets to the context.
   */
  const fetch = async () => {
    try {
      const documents = await fetchDocuments(collection);

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

      const files = addHashToFilesNames(payload.files);

      files.forEach((file) => {
        promises.push(uploadFile(file));
      });

      const uploads = await Promise.all(promises);

      const task: Omit<Task, 'id'> = {
        ...payload,
        ...{ due: payload.due ? new Date(payload.due) : null },
        created_at: new Date(),
        status: 'active',
        files: uploads.map((file) => ({
          name: file.ref.name,
          path: file.ref.fullPath,
          id: nanoid(),
        })),
      };

      const document = await createDocument(collection, task);

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
      await updateDocument(collection, taskId, { status });
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

      const files = addHashToFilesNames(data.files);

      files.forEach((file) => {
        promises.push(uploadFile(file));
      });

      const uploads = await Promise.all(promises);

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
                id: nanoid(),
              }))
            : []),
          ...(task ? task.files : []),
        ],
      };

      await updateDocument(collection, task.id, payload);

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
   *
   * @param {string} task - Original task that should be removed.
   */
  const remove = async (task: Task) => {
    try {
      const promises: Promise<void>[] = [];

      task.files.forEach((file) => promises.push(removeFile(file.path)));

      await Promise.all(promises);

      await removeDocument(collection, task.id);

      dispatch({
        type: 'REMOVE_TASK',
        payload: {
          taskId: task.id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  return { tasks, fetch, create, changeStatus, update, remove };
};
