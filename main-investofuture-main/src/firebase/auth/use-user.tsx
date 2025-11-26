
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as AuthUser } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/app/dashboard/profile/page';

type UserState = {
  auth: AuthUser | null;
  profile: UserProfile | null;
}

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userState, setUserState] = useState<UserState>({ auth: null, profile: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUserState(prev => ({...prev, auth: authUser}));
        
        const q = query(collection(firestore, "users"), where("userId", "==", authUser.uid));
        
        const unsubscribeProfile = onSnapshot(q, 
          (querySnapshot) => {
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              setUserState(prev => ({...prev, profile: userDoc.data() as UserProfile}));
            } else {
               setUserState(prev => ({...prev, profile: null}));
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user profile:", error);
            setUserState(prev => ({...prev, profile: null}));
            setLoading(false);
          }
        );

        return () => unsubscribeProfile();

      } else {
        setUserState({ auth: null, profile: null });
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  const fullUser = userState.auth ? { ...userState.auth, profile: userState.profile } : null;

  return { user: fullUser, loading };
}
