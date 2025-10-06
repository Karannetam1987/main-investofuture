"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

/**
 * A client-side component that listens for Firestore permission errors
 * and displays a toast notification with the error details. This component
 * is intended for use in development environments to help debug security rules.
 *
 * @returns {null} This component does not render any UI.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on(
      "permission-error",
      (error: FirestorePermissionError) => {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "Firestore Security Rules Error: ",
            error.generateErrorJson()
          );
          toast({
            variant: "destructive",
            title: "Firestore Permission Error",
            description: (
              <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(error.generateErrorJson(), null, 2)}
                </code>
              </pre>
            ),
          });
        }
      }
    );

    return () => unsubscribe();
  }, [toast]);

  return null;
}
