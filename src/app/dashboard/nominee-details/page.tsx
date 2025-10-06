
"use client";

import { useState, useEffect } from "react";
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
import { useUser, useFirestore } from "@/firebase";
import { setUserProfile, UserProfile } from "@/firebase/firestore/users";
import { format, parseISO } from 'date-fns';


type NomineeDetails = UserProfile['nomineeDetails'];

export default function NomineeDetailsPage() {
    const { user, profile, loading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [nomineeDetails, setNomineeDetails] = useState<NomineeDetails | null>(null);

    useEffect(() => {
        if (profile) {
            setNomineeDetails(profile.nomineeDetails);
        }
    }, [profile]);

    const handleSaveChanges = () => {
        if (!user || !firestore || !profile || !nomineeDetails) {
            toast({ title: "Error", description: "User not logged in or data not available.", variant: "destructive"});
            return;
        };

        const updatedProfileData: UserProfile = {
            ...profile,
            nomineeDetails: nomineeDetails,
        };
        
        setUserProfile(firestore, user.uid, updatedProfileData);
        
        toast({
            title: "Success!",
            description: "Your nominee details have been updated.",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNomineeDetails(prev => prev ? {...prev, [id]: value} : null);
    }
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
       setNomineeDetails(prev => prev ? {...prev, [id]: new Date(value).toISOString()} : null);
    }

  if (loading || !nomineeDetails) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading nominee details...</p>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

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
                    value={format(parseISO(nomineeDetails.nomineeDob), 'yyyy-MM-dd')} 
                    onChange={handleDateChange} 
                  />
                </div>
              </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
