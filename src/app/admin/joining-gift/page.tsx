
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function JoiningGiftPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Joining Gift</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Joining Gifts</CardTitle>
          <CardDescription>
            View, add, or edit joining gifts for users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Joining gift management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
