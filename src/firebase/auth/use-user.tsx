
"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, DocumentReference, getDocFromServer } from "firebase/firestore";
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<any>(null);

  
  const searchParams = useSearchParams();
  const adminViewingUserId = searchParams.get("userId");

  const fetchProfile = useCallback(async (userId: string) => {
    if (!firestore) return;
    setProfileLoading(true);
    try {
        const userDocRef = doc(firestore, "users", userId);
        const docSnap = await getDocFromServer(userDocRef);
        if (docSnap.exists()) {
            setProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
            setProfile(null);
        }
        setProfileError(null);
    } catch (err) {
        setProfileError(err);
        console.error("Error fetching user profile:", err);
    } finally {
        setProfileLoading(false);
    }
  }, [firestore]);


  useEffect(() => {
    if (adminViewingUserId) {
      setLoading(false);
      fetchProfile(adminViewingUserId);
    } else {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if(currentUser) {
                fetchProfile(currentUser.uid);
            } else {
                setProfile(null);
                setProfileLoading(false);
            }
        });
        return () => unsubscribe();
    }
  }, [auth, adminViewingUserId, fetchProfile]);

  const refreshProfile = useCallback(() => {
    const userIdToFetch = adminViewingUserId || user?.uid;
    if(userIdToFetch) {
        fetchProfile(userIdToFetch);
    }
  }, [adminViewingUserId, user, fetchProfile]);
  
  const finalLoading = adminViewingUserId ? profileLoading : (loading || (user ? profileLoading : false));

  return {
    user: adminViewingUserId ? null : user,
    profile,
    loading: finalLoading,
    error: profileError,
    isAdminView: !!adminViewingUserId,
    refreshProfile,
  };
}
