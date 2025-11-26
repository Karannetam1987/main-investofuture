
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type FirebaseApp } from 'firebase/app';
import { type Auth } from 'firebase/auth';
import { type Firestore } from 'firebase/firestore';

export interface FirebaseProviderProps {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  children?: React.ReactNode;
}

const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  ...props
}: FirebaseProviderProps) {
  const [app, setApp] = useState(props.firebaseApp);

  useEffect(() => {
    setApp(props.firebaseApp);
  }, [props.firebaseApp]);

  const value = useMemo(() => {
    return { ...props, firebaseApp: app };
  }, [props, app]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error(
      'useFirebaseApp must be used within a FirebaseProvider.'
    );
  }
  return context.firebaseApp;
}

export function useAuth() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}

export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}

export function useFirebase() {
  return {
    app: useFirebaseApp(),
    auth: useAuth(),
    firestore: useFirestore(),
  };
}

export function useMemoFirebase<T>(
  factory: () => T,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
