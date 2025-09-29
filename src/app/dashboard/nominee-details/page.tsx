"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function NomineeDetailsPage() {

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
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
          <Card>
            <CardHeader>
              <CardTitle>Nominee Details</CardTitle>
              <CardDescription>
                Your nominee information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomineeName">Nominee Name</Label>
                  <Input id="nomineeName" defaultValue="Nominee Name" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeFatherName">Nominee's Father Name</Label>
                  <Input id="nomineeFatherName" defaultValue="Nominee Father's Name" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input id="relationship" defaultValue="Spouse" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeMobile">Nominee Mobile Number</Label>
                  <Input id="nomineeMobile" defaultValue="+91-9876543211" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeDob">Nominee's Date of Birth</Label>
                  <Input id="nomineeDob" defaultValue="01/01/1992" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
