
"use client";

import { useState, useEffect, Suspense } from "react";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import initialUserData from "@/lib/data/user-data.json";

type UserProfile = typeof initialUserData[0];
type BankDetails = UserProfile['bankDetails'];

function BankDetailsEditor() {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
        const user = initialUserData[0]; // Get the first user as a mock
        setProfile(user);
        setBankDetails(user.bankDetails);
        setLoading(false);
    }, 500);
  }, []);


  const handleSaveChanges = () => {
    if (!profile || !bankDetails) {
        toast({ title: "Error", description: "Data not available.", variant: "destructive"});
        return;
    };
    
    toast({
      title: "Success!",
      description: "Bank details have been updated (Simulated).",
    });
    console.log("Saving bank details:", bankDetails);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setBankDetails(prev => prev ? {...prev, [id]: value} : null);
  }

  if (loading || !bankDetails || !profile) {
    return (
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading bank details...</p>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="mb-6">
             <Link href={"/dashboard"}>
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
                  <Input id="bankName" value={bankDetails.bankName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" value={bankDetails.accountNumber} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" value={bankDetails.ifsc} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input id="upi" value={bankDetails.upi || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea id="bankAddress" value={bankDetails.bankAddress} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
  );
}

export default function BankDetailsPage() {
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
                <BankDetailsEditor />
            </Suspense>
            <AppFooter />
        </div>
    )
}
