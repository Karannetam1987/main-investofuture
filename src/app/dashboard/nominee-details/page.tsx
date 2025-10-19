
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
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import initialUserData from "@/lib/data/user-data.json";

type UserProfile = typeof initialUserData[0];
type NomineeDetails = UserProfile['nomineeDetails'];

function NomineeDetailsEditor() {
    const { toast } = useToast();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [nomineeDetails, setNomineeDetails] = useState<NomineeDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Simulate fetching user data
        setTimeout(() => {
            const user = initialUserData[0]; // Use first user as mock
            setProfile(user);
            setNomineeDetails(user.nomineeDetails);
            setLoading(false);
        }, 500);
    }, []);

    const handleSaveChanges = async () => {
        if (!profile || !nomineeDetails) {
            toast({ title: "Error", description: "Data not available.", variant: "destructive"});
            return;
        };

        setIsSaving(true);
        const updatedProfile = { ...profile, nomineeDetails: nomineeDetails };

        try {
            const response = await fetch('/api/update-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                 // Note: This saves the entire user-data file again.
                // In a real database, you'd only update the specific user.
                // For this JSON-based approach, we find the user and replace them.
                body: JSON.stringify({ 
                    file: 'user-data.json', 
                    data: initialUserData.map(u => u.id === profile.id ? updatedProfile : u)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save changes.');
            }

            toast({
                title: "Changes Saved",
                description: "Your nominee details have been updated successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error Saving Changes",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNomineeDetails(prev => prev ? {...prev, [id]: value} : null);
    }
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
       setNomineeDetails(prev => {
          if (!prev) return null;
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return {...prev, [id]: date.toISOString()};
            }
          } catch(e) { /* ignore invalid date */ }
          return {...prev, [id]: value}; // keep raw value if invalid
       });
    }

  if (loading || !nomineeDetails || !profile) {
    return (
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading nominee details...</p>
          </div>
        </main>
    );
  }

  const formattedNomineeDob = nomineeDetails.nomineeDob ? format(new Date(nomineeDetails.nomineeDob), 'yyyy-MM-dd') : '';

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
              <CardTitle>Nominee Details</CardTitle>
              <CardDescription>
                Manage your nominee information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomineeName">Nominee Name</Label>
                  <Input id="nomineeName" value={nomineeDetails.nomineeName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeFatherName">Nominee's Father Name</Label>
                  <Input id="nomineeFatherName" value={nomineeDetails.nomineeFatherName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input id="relationship" value={nomineeDetails.relationship} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeMobile">Nominee Mobile Number</Label>
                  <Input id="nomineeMobile" value={nomineeDetails.nomineeMobile} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomineeDob">Nominee's Date of Birth</Label>
                  <Input 
                    id="nomineeDob" 
                    type="date" 
                    value={formattedNomineeDob}
                    onChange={handleDateChange} 
                  />
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving && <LoaderCircle className="mr-2 h-4 animate-spin" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
  );
}

export default function NomineeDetailsPage() {
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
                <NomineeDetailsEditor />
            </Suspense>
            <AppFooter />
        </div>
    )
}

    
