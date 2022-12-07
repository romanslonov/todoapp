import { getDownloadURL, ref, uploadBytes, UploadResult } from 'firebase/storage';

import { storage } from '@/services/firebase';

export const useStorage = ({ path } = { path: '/files/' }) => {
  const upload = (file: File): Promise<UploadResult> => {
    const storageRef = ref(storage, `${path}${file.name}`);

    const metadata = {
      contentType: file.type,
    };

    return uploadBytes(storageRef, file, metadata);
  };

  const getFileDownloadURL = (path: string): Promise<string> => {
    return getDownloadURL(ref(storage, path));
  };

  return {
    upload,
    getFileDownloadURL,
  };
};
