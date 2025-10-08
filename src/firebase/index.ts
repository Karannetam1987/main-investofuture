
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { firebaseConfig } from "./config";
export * from "./provider";
export { useUser } from './auth/use-user';
export { useDoc } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp;

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    firebaseApp = apps[0];
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }
  
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}
