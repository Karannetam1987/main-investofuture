
'use client';

import { FirebaseProvider, type FirebaseProviderProps } from './provider';
import { initializeFirebase } from './';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebase: FirebaseProviderProps | undefined;

function getFirebase() {
  if (firebase) {
    return firebase;
  }
  const app = initializeFirebase();
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  firebase = {
    firebaseApp: app,
    auth,
    firestore,
  };
  return firebase;
}
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebase = getFirebase();
  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
