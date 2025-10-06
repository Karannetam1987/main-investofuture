
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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { setUserProfile, UserProfile } from "@/firebase/firestore/users";

type EditableProfile = Omit<UserProfile, 'id' | 'email'>;

export default function ProfilePage() {
  const { user, profile, loading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [editableProfile, setEditableProfile] = useState<EditableProfile | null>(null);

  useEffect(() => {
    if (profile) {
      // Create a new object for editing to avoid directly mutating the hook's state
      setEditableProfile({
        personalInfo: { ...profile.personalInfo },
        address: { ...profile.address },
        bankDetails: { ...profile.bankDetails },
        nomineeDetails: { ...profile.nomineeDetails },
      });
    }
  }, [profile]);


  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      if (editableProfile) {
        setEditableProfile(prev => ({
            ...prev!,
            personalInfo: {
                ...prev!.personalInfo,
                [id]: value
            }
        }));
      }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      if (editableProfile) {
        setEditableProfile(prev => ({
            ...prev!,
            address: {
                ...prev!.address,
                [id]: value
            }
        }));
      }
  }

  const handleSaveChanges = () => {
    if (!user || !firestore || !editableProfile) {
        toast({ title: "Error", description: "User not logged in or database not available.", variant: "destructive"});
        return;
    };

    const updatedProfileData: UserProfile = {
        ...profile!,
        ...editableProfile,
    };
    
    setUserProfile(firestore, user.uid, updatedProfileData);
    
    toast({
      title: "Success!",
      description: "Your profile has been updated.",
    });
  };

  if (loading || !editableProfile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading profile...</p>
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
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Manage your personal details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="regId">Registration ID</Label>
                    <Input id="regId" value={profile?.id || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={editableProfile.personalInfo.fullName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" value={editableProfile.personalInfo.fatherName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input id="motherName" value={editableProfile.personalInfo.motherName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" value={editableProfile.personalInfo.mobile} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile?.email || ''} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" value={format(new Date(editableProfile.personalInfo.dob), "yyyy-MM-dd")} onChange={handleProfileChange} type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value={editableProfile.personalInfo.gender} onChange={handleProfileChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Input id="maritalStatus" value={editableProfile.personalInfo.maritalStatus} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" value={editableProfile.personalInfo.religion} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input id="caste" value={editableProfile.personalInfo.caste} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" value={editableProfile.personalInfo.children} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input id="bloodGroup" value={editableProfile.personalInfo.bloodGroup} onChange={handleProfileChange} />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="identificationMark">Identification Mark</Label>
                    <Input id="identificationMark" value={editableProfile.personalInfo.identificationMark} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input id="pan" value={editableProfile.personalInfo.pan} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" value={editableProfile.personalInfo.aadhaar} onChange={handleProfileChange} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Details */}
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="permanent">Permanent Address</Label>
                        <Textarea id="permanent" value={editableProfile.address.permanent} onChange={handleAddressChange} rows={3}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="current">Current Address</Label>
                        <Textarea id="current" value={editableProfile.address.current} onChange={handleAddressChange} rows={3}/>
                    </div>
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
