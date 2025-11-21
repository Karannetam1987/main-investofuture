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
import { format, parseISO, isValid } from 'date-fns';
import initialUserData from "@/lib/data/user-data.json";

type UserProfile = typeof initialUserData[0];
type NomineeDetails = UserProfile['nomineeDetails'];

const USER_PROFILE_STORAGE_KEY_PREFIX = "user_profile_"; // To keep keys consistent

function NomineeDetailsEditor() {
    const { toast } = useToast();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [nomineeDetails, setNomineeDetails] = useState<NomineeDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // For this page, we assume we are always editing the first user 'INF001'
    const userId = initialUserData[0].id;

    useEffect(() => {
        setLoading(true);
        try {
            const userStorageKey = `${USER_PROFILE_STORAGE_KEY_PREFIX}${userId}`;
            const storedProfile = localStorage.getItem(userStorageKey);
            let userProfile: UserProfile;
            
            if (storedProfile) {
                userProfile = JSON.parse(storedProfile);
            } else {
                // If no profile, use initial and save it
                userProfile = initialUserData[0];
                localStorage.setItem(userStorageKey, JSON.stringify(userProfile));
            }
            setProfile(userProfile);
            setNomineeDetails(userProfile.nomineeDetails);

        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
            const userProfile = initialUserData[0];
            setProfile(userProfile);
            setNomineeDetails(userProfile.nomineeDetails);
        }
        setLoading(false);
    }, [userId]);

    const handleSaveChanges = async () => {
        if (!profile || !nomineeDetails) {
            toast({ title: "Error", description: "Data not available.", variant: "destructive"});
            return;
        };

        setIsSaving(true);
        const updatedProfile = { ...profile, nomineeDetails };
        
        try {
            const userStorageKey = `${USER_PROFILE_STORAGE_KEY_PREFIX}${userId}`;
            localStorage.setItem(userStorageKey, JSON.stringify(updatedProfile));
            setProfile(updatedProfile); // Update local state
            setIsSaving(false);
            toast({
                title: "Changes Saved",
                description: "Your nominee details have been updated permanently in this browser.",
            });
        } catch(error) {
            console.error("Failed to save data", error);
            setIsSaving(false);
            toast({ title: "Error Saving", variant: "destructive" });
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

  const formattedNomineeDob = nomineeDetails.nomineeDob && isValid(parseISO(nomineeDetails.nomineeDob)) 
    ? format(parseISO(nomineeDetails.nomineeDob), 'yyyy-MM-dd') 
    : '';

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