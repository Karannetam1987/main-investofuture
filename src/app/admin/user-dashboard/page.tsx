
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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


export default function UserDashboardPage() {
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleViewUser = () => {
    if (userId.trim() === "") {
      toast({
        title: "Invalid ID",
        description: "Please enter a User Registration ID.",
        variant: "destructive",
      });
      return;
    }
    // In a real application, you would fetch the user and navigate
    // to a dynamic route like `/admin/user/${userId}`.
    // For now, we'll navigate to the example profile page.
    toast({
        title: "Redirecting...",
        description: `Showing dashboard for user ${userId}.`,
    });
    router.push("/dashboard/profile");
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
                Enter a user's Registration ID to view their full dashboard and manage their details.
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
                />
                <Button onClick={handleViewUser}>View/Edit User</Button>
                </div>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
