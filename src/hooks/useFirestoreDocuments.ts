import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/services/firebase';

export const useFirestoreDocuments = () => {
  const fetch = async (path: string): Promise<DocumentData[]> => {
    try {
      const { docs } = await getDocs(collection(db, path));

      return docs;
    } catch (error) {
      throw new Error(error);
    }
  };

  const create = async (path: string, data) => {
    try {
      const document = await addDoc(collection(db, path), data);

      return document;
    } catch (error) {
      throw new Error(error);
    }
  };

  const update = async (path: string, id: string, data) => {
    try {
      const ref = doc(db, path, id);
      const document = await updateDoc(ref, data);

      return document;
    } catch (error) {
      throw new Error(error);
    }
  };

  const remove = async (path: string, id: string) => {
    try {
      const ref = doc(db, path, id);
      const document = await deleteDoc(ref);

      return document;
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    fetch,
    create,
    update,
    remove,
  };
};
