"use client";

import React, { useMemo } from "react";
import { FirebaseProvider, initializeFirebase } from "@/firebase";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseInstances = useMemo(() => {
    return initializeFirebase();
  }, []);

  return <FirebaseProvider {...firebaseInstances}>{children}</FirebaseProvider>;
}
