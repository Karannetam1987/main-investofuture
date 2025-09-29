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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function BankDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);

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
              <CardTitle>Bank Details</CardTitle>
              <CardDescription>
                Manage your bank account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" defaultValue="State Bank of India" readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" defaultValue="************1234" readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" defaultValue="SBIN0001234" readOnly={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input id="upi" defaultValue="karan.sidar@upi" readOnly={!isEditing} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea defaultValue="Main Branch, New Delhi, India" readOnly={!isEditing} />
                </div>
              </div>
              <div className="flex justify-end pt-4 gap-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="lg" onClick={() => setIsEditing(false)}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
