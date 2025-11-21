"use client";

import { Suspense } from "react";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

function SettingsEditor() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);


  if (loading) {
    return (
        <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading settings...</p>
            </div>
        </main>
    );
  }

  return (
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                        Manage your account settings. More options will be available in the future.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">There are no configurable settings at the moment. Password can be reset via the 'Forgot Password' link on the login screen.</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
  );
}


export default function SettingsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <AppHeader />
            <Suspense fallback={
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </main>
            }>
                <SettingsEditor />
            </Suspense>
            <AppFooter />
        </div>
    );
}
