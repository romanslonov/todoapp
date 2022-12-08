import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  UploadResult,
} from 'firebase/storage';

import { storage } from '@/services/firebase';

/**
 * Hook that utilizes `Storage` files.
 * 
 @returns A number of functions to manage `Storage` files.
 */
export const useStorage = ({ path } = { path: '/files/' }) => {
  /**
   * The function uploads file in `Storage`.
   *
   * @param file - Data to upload.
   * In our specific case we will upload an object that retrieved from FileList.
   * @async
   * @returns A `Promise` that will be resolved with storage upload data.
   */
  const upload = (file: File): Promise<UploadResult> => {
    const storageRef = ref(storage, `${path}${file.name}`);

    const metadata = {
      contentType: file.type,
    };

    return uploadBytes(storageRef, file, metadata);
  };

  /**
   * The function gets download URL of file.
   *
   * @param {string} path - Path to a file on the storage.
   * @returns A `Promise` that will be resolved with a string.
   */
  const getFileDownloadURL = (path: string): Promise<string> => {
    return getDownloadURL(ref(storage, path));
  };

  /**
   * The function removes a file from the `Storage`.
   *
   * @param {string} path - Path to a file on the storage.
   * @returns A `Promise` that will be resolved when file will be deleted.
   */
  const remove = (path: string) => {
    const storageRef = ref(storage, path);

    return deleteObject(storageRef);
  };

  return {
    upload,
    getFileDownloadURL,
    remove,
  };
};
