
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  onSnapshot,
  query,
  collection,
  doc,
  collectionGroup,
  type Query,
  type DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T>(path: string | null | Query) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedQuery = useMemo(() => {
    if (!path) {
      return null;
    }
    if (typeof path === 'string') {
      return collection(firestore, path);
    }
    return path;
  }, [firestore, path]);


  useEffect(() => {
    if (!memoizedQuery) {
      setData([]);
      setLoading(false);
      return;
    }
    
    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setData([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery]);

  return { data, loading };
}

export function useDoc<T>(path: string | null) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedRef = useMemo(() => {
    if (!path) {
      return null;
    }
    // Path must have an even number of segments for a document.
    if (path.split("/").length % 2 !== 0) {
      console.error(
        "Invalid document path provided to useDoc. Path must have an even number of segments.",
        path
      );
      return null;
    }
    return doc(firestore, path);
  }, [firestore, path]);

  useEffect(() => {
    if (!memoizedRef) {
      setData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedRef,
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching document:', error);
        setData(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, loading };
}
