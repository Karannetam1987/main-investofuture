"use client";

import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseApp, getApp } from "firebase/app";
import React, { createContext, useContext, useMemo } from "react";

// The initial return value for the use(Context) hook is the default value of the context.
// In this case, the default value is an object with a null firebaseApp property.
// During the initial render, the use(Context) hook will return this default value.
// On subsequent renders, after the FirebaseProvider component has rendered and updated the context value,
// the use(Context) hook will return the new context value, which is the firebaseApp object.
const FirebaseContext = createContext<{
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
} | null>(null);

/**
 * Provides the Firebase app, Firestore, and Auth instances to its children.
 *
 * @param {object} props - The properties of the component.
 * @param {React.ReactNode} props.children - The children of the component.
 * @param {FirebaseApp} props.firebaseApp - The Firebase app instance.
 * @returns {JSX.Element} - The Firebase provider.
 */
export const FirebaseProvider = ({
  children,
  firebaseApp,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
}) => {
  const firestore = useMemo(() => getFirestore(firebaseApp), [firebaseApp]);
  const auth = useMemo(() => getAuth(firebaseApp), [firebaseApp]);

  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        firestore,
        auth,
      }}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const useFirebaseApp = () => {
  const { firebaseApp } = useFirebase() ?? {};
  if (!firebaseApp) {
    throw new Error("Make sure to wrap your component in a FirebaseProvider");
  }
  return firebaseApp;
};

export const useFirestore = () => {
  const { firestore } = useFirebase() ?? {};
  if (!firestore) {
    throw new Error("Make sure to wrap your component in a FirebaseProvider");
  }
  return firestore;
};

export const useAuth = () => {
  const { auth } = useFirebase() ?? {};
  if (!auth) {
    throw new Error("Make sure to wrap your component in a FirebaseProvider");
  }
  return auth;
};
