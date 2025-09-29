
"use client";

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

export default function UserDashboardPage() {
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
                <Input id="userId" placeholder="Enter User Registration ID (e.g., IF-12345)" className="max-w-xs" />
                <Button>View/Edit User</Button>
                </div>
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
