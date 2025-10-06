
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentReference } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';

import { useAuth, useFirestore } from "@/firebase/provider";
import { useDoc } from "@/firebase/firestore/use-doc";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";
import type { UserProfile } from "@/firebase/firestore/users";

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const adminViewingUserId = searchParams.get("userId");

  useEffect(() => {
    // If an admin is viewing a user, we don't need to check auth state
    if (adminViewingUserId) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, adminViewingUserId]);

  const userIdToFetch = adminViewingUserId || user?.uid;

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !userIdToFetch) return null;
    return doc(firestore, "users", userIdToFetch) as DocumentReference<UserProfile>;
  }, [firestore, userIdToFetch]);

  const { data: profile, loading: profileLoading, error: profileError } = useDoc(userDocRef);
  
  const finalLoading = adminViewingUserId ? profileLoading : (loading || (user ? profileLoading : false));

  return {
    user: adminViewingUserId ? null : user, // If admin is viewing, the concept of a "logged in" user is null
    profile,
    loading: finalLoading,
    error: profileError,
    isAdminView: !!adminViewingUserId,
  };
}

    