
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
import { ArrowLeft, LoaderCircle, ShieldCheck, User as UserIcon, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { setUserProfile, UserProfile } from "@/firebase/firestore/users";
import { format, parseISO } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type EditableProfile = Omit<UserProfile, 'id' | 'email' | 'uid' | 'createdAt' | 'updatedAt' | 'status'>;

function ProfileEditor() {
  const { user, profile, loading, isAdminView, refreshProfile } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editableProfile, setEditableProfile] = useState<EditableProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditableProfile({
        photoURL: profile.photoURL,
        personalInfo: { ...profile.personalInfo, dob: profile.personalInfo.dob },
        address: { ...profile.address },
        bankDetails: { ...profile.bankDetails },
        nomineeDetails: { ...profile.nomineeDetails, nomineeDob: profile.nomineeDetails.nomineeDob },
      });
    }
  }, [profile]);


  const handleChange = (section: keyof EditableProfile, field: string, value: string) => {
    if (editableProfile) {
        setEditableProfile(prev => {
            if (!prev) return null;
            const sectionData = prev[section];
            return {
                ...prev,
                [section]: {
                    ...(sectionData as any),
                    [field]: value,
                }
            }
        });
    }
  }

  const handleDateChange = (section: keyof EditableProfile, field: string, value: string) => {
      if (editableProfile) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            handleChange(section, field, date.toISOString());
        }
      }
  }

  const handleSaveChanges = () => {
    const userToUpdateUid = profile?.uid;

    if (!firestore || !editableProfile || !userToUpdateUid) {
        toast({ title: "Error", description: "Data not available to save.", variant: "destructive"});
        return;
    };

    const updatedProfileData: UserProfile = {
        ...profile,
        ...editableProfile,
    };
    
    setUserProfile(firestore, userToUpdateUid, updatedProfileData);
    
    toast({
      title: "Success!",
      description: "Profile has been updated.",
    });
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const userToUpdateUid = profile?.uid;
    if (!file || !userToUpdateUid || !firestore) return;

    setIsUploading(true);
    const storage = getStorage();
    const filePath = `profile_pictures/${userToUpdateUid}/${file.name}`;
    const storageRef = ref(storage, filePath);

    try {
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);

        await setUserProfile(firestore, userToUpdateUid, { ...profile, photoURL: downloadURL });
        
        refreshProfile();

        toast({
            title: "Profile Picture Updated",
            description: "Your new profile picture has been saved."
        });
    } catch (error: any) {
         toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsUploading(false);
    }
  }

  if (loading || !editableProfile || !profile) {
    return (
        <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        </main>
    );
  }

  return (
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="mb-6">
            <Link href={isAdminView ? "/admin/manage-users" : "/dashboard"}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {isAdminView ? "Manage Users" : "Dashboard"}
              </Button>
            </Link>
          </div>
          <div className="space-y-8">
            <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                    <div className="relative group w-24 h-24">
                        <Avatar className="w-24 h-24 text-lg">
                            <AvatarImage src={profile.photoURL} alt={profile.personalInfo.fullName} />
                            <AvatarFallback>
                                <UserIcon className="w-10 h-10" />
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/80 group-hover:bg-background"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            <span className="sr-only">Upload picture</span>
                        </Button>
                        <Input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handlePictureUpload}
                        />
                    </div>
                    <div>
                        <CardTitle className="text-3xl">{isAdminView ? "Edit User Profile" : "Profile Details"}</CardTitle>
                        <CardDescription className="mt-1">
                            {isAdminView ? `You are editing the profile for ${profile.personalInfo.fullName}.` : "Manage your personal details."}
                        </CardDescription>
                    </div>
                </div>

                </CardHeader>
                <CardContent className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="regId">Registration ID</Label>
                        <Input id="regId" value={profile.id || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={editableProfile.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fatherName">Father's Name</Label>
                        <Input id="fatherName" value={editableProfile.personalInfo.fatherName} onChange={(e) => handleChange('personalInfo', 'fatherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="motherName">Mother's Name</Label>
                        <Input id="motherName" value={editableProfile.personalInfo.motherName} onChange={(e) => handleChange('personalInfo', 'motherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" value={editableProfile.personalInfo.mobile} onChange={(e) => handleChange('personalInfo', 'mobile', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile.email || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" value={format(parseISO(editableProfile.personalInfo.dob), "yyyy-MM-dd")} onChange={(e) => handleDateChange('personalInfo', 'dob', e.target.value)} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" value={editableProfile.personalInfo.gender} onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Input id="maritalStatus" value={editableProfile.personalInfo.maritalStatus} onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" value={editableProfile.personalInfo.religion} onChange={(e) => handleChange('personalInfo', 'religion', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caste">Caste</Label>
                        <Input id="caste" value={editableProfile.personalInfo.caste} onChange={(e) => handleChange('personalInfo', 'caste', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="children">Children</Label>
                        <Input id="children" value={editableProfile.personalInfo.children} onChange={(e) => handleChange('personalInfo', 'children', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" value={editableProfile.personalInfo.bloodGroup} onChange={(e) => handleChange('personalInfo', 'bloodGroup', e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="identificationMark">Identification Mark</Label>
                        <Input id="identificationMark" value={editableProfile.personalInfo.identificationMark} onChange={(e) => handleChange('personalInfo', 'identificationMark', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" value={editableProfile.personalInfo.pan} onChange={(e) => handleChange('personalInfo', 'pan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaar">Aadhaar Number</Label>
                        <Input id="aadhaar" value={editableProfile.personalInfo.aadhaar} onChange={(e) => handleChange('personalInfo', 'aadhaar', e.target.value)} />
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
                            <Textarea id="permanent" value={editableProfile.address.permanent} onChange={(e) => handleChange('address', 'permanent', e.target.value)} rows={3}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Address</Label>
                            <Textarea id="current" value={editableProfile.address.current} onChange={(e) => handleChange('address', 'current', e.target.value)} rows={3}/>
                        </div>
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>
          </div>
        </div>
      </main>
  );
}


export default function ProfilePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <AppHeader />
            <Suspense fallback={
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </main>
            }>
                <ProfileEditor />
            </Suspense>
            <AppFooter />
        </div>
    );
}
