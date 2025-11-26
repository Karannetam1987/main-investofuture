
"use client";

import { useState, Suspense } from "react";
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
import { LoaderCircle, Search } from "lucide-react";

// Mock data of user IDs that exist
const mockUserIds = ["INF001", "INF002"];

function UserDashboardInternal() {
  const [regIdInput, setRegIdInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleViewUser = async () => {
    const searchId = regIdInput.trim().toUpperCase();
    if (searchId === "") {
      toast({
        title: "Invalid ID",
        description: "Please enter a User Registration ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate checking if user exists
    await new Promise(resolve => setTimeout(resolve, 500));
    const userExists = mockUserIds.includes(searchId);
    
    setLoading(false);
    
    if (userExists) {
        toast({
          title: "Redirecting...",
          description: `Showing profile for user ${searchId}.`,
        });
        router.push(`/dashboard/profile?userId=${searchId}`);
      } else {
        toast({
          title: "User Not Found",
          description: `No user found with Registration ID ${searchId}.`,
          variant: "destructive",
        });
      }
  };

  return (
     <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">View/Edit User Profile</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Find User</CardTitle>
                <CardDescription>
                Enter a user's Registration ID to view and edit their full profile.
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
                  value={regIdInput}
                  onChange={(e) => setRegIdInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewUser()}
                />
                <Button onClick={handleViewUser} disabled={loading}>
                  {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                  {loading ? "Verifying..." : "View/Edit Profile"}
                </Button>
                </div>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}

export default function UserDashboardPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-12">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
           </div>}>
            <UserDashboardInternal />
        </Suspense>
    )
}
