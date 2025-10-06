
"use client";

import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import userData from "@/lib/data/user-data.json";

export default function ProfilePage() {
  const [profile, setProfile] = useState(userData[0].personalInfo);
  const [address, setAddress] = useState(userData[0].address);
  const { toast } = useToast();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setProfile(prev => ({...prev, [id]: value}));
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setAddress(prev => ({...prev, [id]: value}));
  }

  const handleSaveChanges = () => {
    // In a real app, you'd call an API to save this.
    console.log("Saving changes:", { personalInfo: profile, address });
    toast({
      title: "Success!",
      description: "Your profile has been updated.",
    });
  };

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
                    <Input id="regId" value={userData[0].id} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={profile.fullName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" value={profile.fatherName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input id="motherName" value={profile.motherName} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" value={userData[0].mobile} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userData[0].email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" value={profile.dob} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value={profile.gender} onChange={handleProfileChange} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Input id="maritalStatus" value={profile.maritalStatus} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" value={profile.religion} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input id="caste" value={profile.caste} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" value={profile.children} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input id="bloodGroup" value={profile.bloodGroup} onChange={handleProfileChange} />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="identificationMark">Identification Mark</Label>
                    <Input id="identificationMark" value={profile.identificationMark} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input id="pan" value={profile.pan} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" value={profile.aadhaar} onChange={handleProfileChange} />
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
                        <Textarea id="permanent" value={address.permanent} onChange={handleAddressChange} rows={3}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="current">Current Address</Label>
                        <Textarea id="current" value={address.current} onChange={handleAddressChange} rows={3}/>
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
