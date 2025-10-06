
"use client";

import { useState, useEffect } from "react";
import {
  onSnapshot,
  query,
  collection,
  Query,
  DocumentData,
  FirestoreError,
} from "firebase/firestore";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface CollectionState<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T extends DocumentData>(
  q: Query<T> | null
) {
  const [state, setState] = useState<CollectionState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!q) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id })) as T[];
        setState({ data, loading: false, error: null });
      },
      (err) => {
        console.error("Error in useCollection:", err);
        setState({ data: null, loading: false, error: err });
        const permissionError = new FirestorePermissionError({
          path: (q as any)._query.path.segments.join('/'),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    );

    return () => unsubscribe();
  }, [q]);

  return state;
}
