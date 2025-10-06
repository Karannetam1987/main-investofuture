import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
export * from "./provider";

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}
