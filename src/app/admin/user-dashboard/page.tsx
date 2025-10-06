
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
import allUsers from "@/lib/data/users.json";

export default function UserDashboardPage() {
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const userIdFromQuery = searchParams.get("userId");
    if (userIdFromQuery) {
      const userExists = allUsers.some(user => user.id === userIdFromQuery);
      if (userExists) {
        setUserId(userIdFromQuery);
        // Automatically redirect if a valid user ID is in the query
        toast({
            title: "Loading User Dashboard...",
            description: `Showing editable dashboard for user ${userIdFromQuery}.`,
        });
        router.push("/dashboard/profile"); // You'd likely go to an edit page like /admin/user/edit/${userIdFromQuery}
      } else {
         toast({
            title: "User Not Found",
            description: `No user found with ID ${userIdFromQuery}.`,
            variant: "destructive",
        });
      }
    }
  }, [searchParams, router, toast]);

  const handleViewUser = () => {
    if (userId.trim() === "") {
      toast({
        title: "Invalid ID",
        description: "Please enter a User Registration ID.",
        variant: "destructive",
      });
      return;
    }
    const userExists = allUsers.some(user => user.id.toLowerCase() === userId.trim().toLowerCase());

    if (userExists) {
        toast({
            title: "Redirecting...",
            description: `Showing dashboard for user ${userId}.`,
        });
        router.push(`/dashboard/profile`); // In a real app, you'd fetch this user's data
    } else {
        toast({
            title: "User Not Found",
            description: `No user found with ID ${userId}.`,
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
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
