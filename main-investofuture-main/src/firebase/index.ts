
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { useCollection, useDoc } from './firestore/hooks';
import { useUser } from './auth/use-user';
export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}

export * from './provider';
export { useCollection, useDoc, useUser };
