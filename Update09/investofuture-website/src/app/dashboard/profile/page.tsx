
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
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
import { ArrowLeft, LoaderCircle, Upload, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import initialUserData from "@/lib/data/user-data.json";
import { useSearchParams } from "next/navigation";


type UserProfile = typeof initialUserData[0];
const ALL_USERS_STORAGE_KEY = "all_users_data_list"; // Key for the list of all users
const USER_PROFILE_STORAGE_KEY_PREFIX = "user_profile_"; // Prefix for individual user profiles

function ProfileEditor() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const adminViewingUserId = searchParams.get("userId");
  const isAdminView = !!adminViewingUserId;
  // Default to first user if not in admin view, otherwise use the admin-provided ID
  const currentUserId = adminViewingUserId || initialUserData[0]?.id;

  useEffect(() => {
    if (!currentUserId) {
        setLoading(false);
        toast({title: "No user ID specified.", variant: "destructive"});
        return;
    }
    setLoading(true);
    
    let userToLoad: UserProfile | null = null;
    try {
        const userStorageKey = `${USER_PROFILE_STORAGE_KEY_PREFIX}${currentUserId}`;
        const storedProfile = localStorage.getItem(userStorageKey);
        
        if (storedProfile) {
            userToLoad = JSON.parse(storedProfile);
        } else {
            // Fallback to the initial JSON data if not in localStorage
            const userFromInitialData = initialUserData.find(u => u.id === currentUserId);
            if (userFromInitialData) {
                userToLoad = userFromInitialData;
                // Save this initial data to localStorage for future edits
                localStorage.setItem(userStorageKey, JSON.stringify(userFromInitialData));
            }
        }

        if (userToLoad) {
            setProfile(userToLoad);
        } else {
            toast({ title: "User not found", variant: "destructive" });
        }
    } catch (error) {
        console.error("Failed to load user profile", error);
        toast({ title: "Error loading profile", variant: "destructive" });
    }
    
    setLoading(false);
  }, [currentUserId, toast]);


  const handleChange = (section: keyof UserProfile, field: string, value: string) => {
    if (profile) {
        setProfile(prev => {
            if (!prev) return null;
            const sectionData = prev[section];
            // Handle top-level fields like 'email', 'mobile'
            if (typeof sectionData !== 'object') {
                 return { ...prev, [section]: value };
            }
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

  const handleDateChange = (section: keyof UserProfile, field: string, value: string) => {
      if (profile) {
        try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                handleChange(section, field, date.toISOString());
            }
        } catch(e) {/* ignore invalid date string */}
      }
  }

  const handleSaveChanges = async () => {
    if (!profile) {
        toast({ title: "Error", description: "Data not available to save.", variant: "destructive"});
        return;
    };
    
    setIsSaving(true);
    try {
        const userStorageKey = `${USER_PROFILE_STORAGE_KEY_PREFIX}${profile.id}`;
        localStorage.setItem(userStorageKey, JSON.stringify(profile));
        
        // Also update the master user list if it exists
        const allUsers = localStorage.getItem(ALL_USERS_STORAGE_KEY);
        if (allUsers) {
            const usersList: UserProfile[] = JSON.parse(allUsers);
            const updatedUsersList = usersList.map(u => 
                u.id === profile.id ? { ...u, name: profile.personalInfo.fullName, email: profile.email, mobile: profile.mobile, status: u.status } : u
            );
            localStorage.setItem(ALL_USERS_STORAGE_KEY, JSON.stringify(updatedUsersList));
        }

        toast({
            title: "Changes Saved",
            description: "Your profile has been saved permanently in this browser.",
        });
    } catch (error) {
        toast({ title: "Error Saving", description: "Could not save profile changes.", variant: "destructive"});
    } finally {
        setIsSaving(false);
    }
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
        const newPhotoURL = e.target?.result as string;
        setProfile(prev => prev ? {...prev, photoURL: newPhotoURL} : null);
        toast({
            title: "Profile Picture Updated",
            description: "Click 'Save Changes' to make it permanent."
        });
        setIsUploading(false);
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
        <main className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        </main>
    );
  }
  
  if (!profile) {
     return (
        <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
                 <p className="text-muted-foreground mb-4">Could not find profile for user ID: {currentUserId}</p>
                 <Link href={isAdminView ? "/admin/manage-users" : "/dashboard"}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </Link>
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
                        <Input id="fullName" value={profile.personalInfo.fullName} onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fatherName">Father's Name</Label>
                        <Input id="fatherName" value={profile.personalInfo.fatherName} onChange={(e) => handleChange('personalInfo', 'fatherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="motherName">Mother's Name</Label>
                        <Input id="motherName" value={profile.personalInfo.motherName} onChange={(e) => handleChange('personalInfo', 'motherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" value={profile.mobile} onChange={(e) => handleChange('mobile', '', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile.email || ''} onChange={(e) => handleChange('email', '', e.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" value={profile.personalInfo.dob && isValid(parseISO(profile.personalInfo.dob)) ? format(parseISO(profile.personalInfo.dob), "yyyy-MM-dd") : ''} onChange={(e) => handleDateChange('personalInfo', 'dob', e.target.value)} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" value={profile.personalInfo.gender} onChange={(e) => handleChange('personalInfo', 'gender', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Input id="maritalStatus" value={profile.personalInfo.maritalStatus} onChange={(e) => handleChange('personalInfo', 'maritalStatus', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" value={profile.personalInfo.religion} onChange={(e) => handleChange('personalInfo', 'religion', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caste">Caste</Label>
                        <Input id="caste" value={profile.personalInfo.caste} onChange={(e) => handleChange('personalInfo', 'caste', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="children">Children</Label>
                        <Input id="children" value={profile.personalInfo.children} onChange={(e) => handleChange('personalInfo', 'children', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" value={profile.personalInfo.bloodGroup} onChange={(e) => handleChange('personalInfo', 'bloodGroup', e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="identificationMark">Identification Mark</Label>
                        <Input id="identificationMark" value={profile.personalInfo.identificationMark} onChange={(e) => handleChange('personalInfo', 'identificationMark', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" value={profile.personalInfo.pan} onChange={(e) => handleChange('personalInfo', 'pan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaar">Aadhaar Number</Label>
                        <Input id="aadhaar" value={profile.personalInfo.aadhaar} onChange={(e) => handleChange('personalInfo', 'aadhaar', e.target.value)} />
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
                            <Textarea id="permanent" value={profile.address.permanent} onChange={(e) => handleChange('address', 'permanent', e.target.value)} rows={3}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="current">Current Address</Label>
                            <Textarea id="current" value={profile.address.current} onChange={(e) => handleChange('address', 'current', e.target.value)} rows={3}/>
                        </div>
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

    