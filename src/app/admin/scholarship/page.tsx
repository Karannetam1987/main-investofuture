
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ScholarshipPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scholarship</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Scholarships</CardTitle>
          <CardDescription>
            View, add, or edit scholarship details for users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Scholarship management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
