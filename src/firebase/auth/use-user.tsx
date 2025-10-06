
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentReference } from "firebase/firestore";

import { useAuth, useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import type { UserProfile } from "@/firebase/firestore/users";

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, "users", user.uid) as DocumentReference<UserProfile>;
  }, [firestore, user]);

  const { data: profile, loading: profileLoading, error: profileError } = useDoc(userDocRef);

  return {
    user,
    profile,
    loading: loading || (user ? profileLoading : false),
    error: profileError,
  };
}
