
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MyDocumentsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Documents</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage User Documents</CardTitle>
          <CardDescription>
            View and manage documents uploaded by users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Document management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
