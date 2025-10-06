"use client";

import React, { useMemo } from "react";
import { FirebaseProvider, initializeFirebase } from "@/firebase";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseApp = useMemo(() => {
    return initializeFirebase();
  }, []);

  return <FirebaseProvider {...firebaseApp}>{children}</FirebaseProvider>;
}
