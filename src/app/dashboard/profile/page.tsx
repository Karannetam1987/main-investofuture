
"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { ArrowLeft, LoaderCircle, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { setUserProfile, UserProfile } from "@/firebase/firestore/users";
import { format, parseISO } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

type EditableProfile = Omit<UserProfile, 'id' | 'email' | 'uid' | 'createdAt' | 'updatedAt' | 'status'>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});


function ProfileEditor() {
  const { user, profile, loading, isAdminView } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [editableProfile, setEditableProfile] = useState<EditableProfile | null>(null);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      setEditableProfile({
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

  const handlePasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to change your password.", variant: "destructive"});
        return;
    }

    const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);

    try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, values.newPassword);
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully."
        });
        passwordForm.reset();
    } catch (error: any) {
        let errorMessage = "An unknown error occurred.";
        if (error.code === 'auth/wrong-password') {
            errorMessage = "The current password you entered is incorrect.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "The new password is too weak. It must be at least 6 characters long.";
        } else {
            errorMessage = error.message;
        }
         toast({
            title: "Error Changing Password",
            description: errorMessage,
            variant: "destructive",
        });
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
                <CardTitle>{isAdminView ? "Edit User Profile" : "Profile Details"}</CardTitle>
                <CardDescription>
                    {isAdminView ? `You are editing the profile for ${profile.personalInfo.fullName}.` : "Manage your personal details."}
                </CardDescription>
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

            {!isAdminView && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                            For security, you will be required to enter your current password.
                        </CardDescription>
                    </CardHeader>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                    {passwordForm.formState.isSubmitting ? (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                    ) : (
                                        <ShieldCheck className="mr-2 h-4 w-4"/>
                                    )}
                                    {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                 </Card>
            )}
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

    