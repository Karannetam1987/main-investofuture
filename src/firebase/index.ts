import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
export * from "./provider";
export { useUser } from './auth/use-user';
export { useDoc } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}
