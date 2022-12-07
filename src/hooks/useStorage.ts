import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';

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
   *
   * @param path - Path to a file on the storage.
   * @returns A `Promise` that will be resolved with a string.
   */
  const getFileDownloadURL = (path: string): Promise<string> => {
    return getDownloadURL(ref(storage, path));
  };

  return {
    upload,
    getFileDownloadURL,
  };
};
