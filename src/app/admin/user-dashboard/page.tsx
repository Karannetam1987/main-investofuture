
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { UserProfile } from "@/firebase/firestore/users";

export default function UserDashboardPage() {
  const [userIdInput, setUserIdInput] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    const userIdFromQuery = searchParams.get("userId");
    if (userIdFromQuery) {
        // When coming from manage-users, we have the UID, not the custom ID.
        // We redirect directly to the profile page which will handle fetching by UID.
        toast({
            title: "Loading User Dashboard...",
            description: `Showing editable dashboard for user.`,
        });
        router.push(`/dashboard/profile?userId=${userIdFromQuery}`);
    }
  }, [searchParams, router, toast]);

  const handleViewUser = async () => {
    if (userIdInput.trim() === "") {
      toast({
        title: "Invalid ID",
        description: "Please enter a User Registration ID.",
        variant: "destructive",
      });
      return;
    }

    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", userIdInput.trim().toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
             toast({
                title: "User Not Found",
                description: `No user found with ID ${userIdInput}.`,
                variant: "destructive",
            });
        } else {
            const userDoc = querySnapshot.docs[0];
            toast({
                title: "Redirecting...",
                description: `Showing dashboard for user ${userIdInput}.`,
            });
            // Redirect using the document ID (which is the UID)
            router.push(`/dashboard/profile?userId=${userDoc.id}`);
        }
    } catch (error: any) {
         toast({
            title: "Error Finding User",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        });
    }
  };

  return (
     <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">View/Edit User Dashboard</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Find User</CardTitle>
                <CardDescription>
                Enter a user's Registration ID to view and manage their full dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="userId">User Registration ID</Label>
                <div className="flex gap-4">
                <Input 
                  id="userId" 
                  placeholder="Enter User Registration ID (e.g., INF001)" 
                  className="max-w-xs" 
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewUser()}
                />
                <Button onClick={handleViewUser}>View/Edit User</Button>
                </div>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}

    