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

/**
 * Hook that utilizes `Firestore` documents and returns data.
 * 
 @returns A number of functions to manage `Firestore` documents.
 */
export const useFirestoreDocuments = () => {
  /**
   * The function gets documents from `Firestore`.
   *
   * @param {string} path - Path to collection.
   * @async
   * @returns A `Promise` that will resolved with array of documents.
   */
  const fetch = async (path: string): Promise<DocumentData[]> => {
    try {
      const { docs } = await getDocs(collection(db, path));

      return docs;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function creates document in `Firestore`.
   *
   * @param {string} path - Path to collection.
   * @param {object} data - Data that should be saved in document.
   * @async
   * @returns A `Promise` that will resolved with created document.
   */
  const create = async (path: string, data) => {
    try {
      const document = await addDoc(collection(db, path), data);

      return document;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function updates document in `Firestore`.
   *
   * @param {string} path - Path to collection.
   * @param {object} data - Data that should be updated in document.
   * @async
   * @returns A `Promise` that will resolved with updated document.
   */
  const update = async (path: string, id: string, data) => {
    try {
      const ref = doc(db, path, id);
      const document = await updateDoc(ref, data);

      return document;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * The function removes document in `Firestore`.
   *
   * @param {string} path - Path to collection.
   * @param {string} id - Unique identifier of document.
   * @async
   * @returns A `Promise` that will be resolved when document will be deleted.
   */
  const remove = async (path: string, id: string) => {
    try {
      const ref = doc(db, path, id);
      await deleteDoc(ref);
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
