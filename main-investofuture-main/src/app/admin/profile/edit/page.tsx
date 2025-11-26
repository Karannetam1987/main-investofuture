
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import type { UserProfile } from "@/app/dashboard/profile/page";

const mockProfile: UserProfile = {
    id: "mock-user-id",
    regId: "INF001",
    email: "karan@example.com",
    mobile: "+91-9876543210",
    photoURL: "",
    status: "Active",
    personal_info: {
        fullName: "Karan Netam",
        fatherName: "Ramesh Netam",
        motherName: "Sita Netam",
        dob: "1990-05-15T00:00:00.000Z",
        gender: "Male",
        maritalStatus: "Married",
        religion: "Hindu",
        caste: "Gond",
        children: "2",
        bloodGroup: "O+",
        identificationMark: "Mole on right cheek",
        pan: "ABCDE1234F",
        aadhaar: "1234 5678 9012"
    },
    address: {
        permanent: "123, Main Street, Raipur, Chhattisgarh",
        current: "456, Park Avenue, Raipur, Chhattisgarh"
    },
    bank_details: {
        bankName: "State Bank of India",
        accountNumber: "12345678901",
        ifsc: "SBIN0000123",
        upi: "karan@upi",
        bankAddress: "Main Branch, Raipur"
    },
    nominee_details: {
        nomineeName: "Sunita Netam",
        nomineeFatherName: "Ganesh Prasad",
        relationship: "Wife",
        nomineeMobile: "+91-9876543211",
        nomineeDob: "1992-08-20T00:00:00.000Z"
    }
};


function ProfileEditor() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [targetRegId, setTargetRegId] = useState<string | null>(null);

  useEffect(() => {
    const adminViewingRegId = searchParams.get("userId");
    
    setProfileLoading(true);
    if (!adminViewingRegId) {
      toast({ title: "No user ID provided.", variant: "destructive" });
      router.push('/admin/user-dashboard');
      return;
    }
    setTargetRegId(adminViewingRegId);

    // Simulate API call
    setTimeout(() => {
        setProfile(mockProfile); // Use mock data
        setProfileLoading(false);
    }, 500);

  }, [searchParams, toast, router]);
  
  const handleChange = (section: keyof UserProfile | 'personal_info' | 'address' | 'bank_details' | 'nominee_details', field: string, value: string) => {
    setProfile(prev => {
        if (!prev) return null;
        if (['personal_info', 'address', 'bank_details', 'nominee_details'].includes(section)) {
             return { ...prev, [section]: { ...(prev[section as keyof UserProfile] as any), [field]: value }};
        }
        const topLevelField = field as keyof UserProfile;
        return { ...prev, [topLevelField]: value };
    });
  }

  const handleDateChange = (section: 'personal_info' | 'nominee_details', field: string, value: string) => {
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
    // Simulate API call
    await new Promise(res => setTimeout(res, 1000));
    console.log("Saving profile:", profile);

    setIsSaving(false);
    toast({
        title: "Changes Saved",
        description: `User's profile has been updated.`,
    });
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setIsUploading(true);
    // Simulate API call for upload
    await new Promise(res => setTimeout(res, 1500));
    const publicUrl = URL.createObjectURL(file); // Simulate URL
    
    setProfile({ ...profile, photoURL: publicUrl });

    setIsUploading(false);
    toast({
        title: "Profile Picture Updated (Simulated)",
        description: "New profile picture has been saved.",
    });
  }

  if (profileLoading) {
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
                 <p className="text-muted-foreground mb-4">Could not find profile for user ID: {targetRegId}</p>
                 <Link href={"/admin/user-dashboard"}>
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
            <Link href={`/dashboard/profile?userId=${profile.regId}`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to View Profile
              </Button>
            </Link>
          </div>
          <div className="space-y-8">
            <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                    <div className="relative group w-24 h-24">
                        <Avatar className="w-24 h-24 text-lg">
                            <AvatarImage src={profile.photoURL} alt={profile.personal_info.fullName} />
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
                        <CardTitle className="text-3xl">Edit User Profile</CardTitle>
                        <CardDescription className="mt-1">
                            You are editing the profile for {profile.personal_info.fullName} ({profile.regId}).
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
                        <Input id="regId" value={profile.regId || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" value={profile.personal_info.fullName} onChange={(e) => handleChange('personal_info', 'fullName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fatherName">Father's Name</Label>
                        <Input id="fatherName" value={profile.personal_info.fatherName} onChange={(e) => handleChange('personal_info', 'fatherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="motherName">Mother's Name</Label>
                        <Input id="motherName" value={profile.personal_info.motherName} onChange={(e) => handleChange('personal_info', 'motherName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input id="mobile" value={profile.mobile} onChange={(e) => handleChange('mobile', 'mobile', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile.email || ''} readOnly/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" value={profile.personal_info.dob && isValid(parseISO(profile.personal_info.dob)) ? format(parseISO(profile.personal_info.dob), "yyyy-MM-dd") : ''} onChange={(e) => handleDateChange('personal_info', 'dob', e.target.value)} type="date" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" value={profile.personal_info.gender} onChange={(e) => handleChange('personal_info', 'gender', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Input id="maritalStatus" value={profile.personal_info.maritalStatus} onChange={(e) => handleChange('personal_info', 'maritalStatus', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="religion">Religion</Label>
                        <Input id="religion" value={profile.personal_info.religion} onChange={(e) => handleChange('personal_info', 'religion', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="caste">Caste</Label>
                        <Input id="caste" value={profile.personal_info.caste} onChange={(e) => handleChange('personal_info', 'caste', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="children">Children</Label>
                        <Input id="children" value={profile.personal_info.children} onChange={(e) => handleChange('personal_info', 'children', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" value={profile.personal_info.bloodGroup} onChange={(e) => handleChange('personal_info', 'bloodGroup', e.target.value)} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="identificationMark">Identification Mark</Label>
                        <Input id="identificationMark" value={profile.personal_info.identificationMark} onChange={(e) => handleChange('personal_info', 'identificationMark', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" value={profile.personal_info.pan} onChange={(e) => handleChange('personal_info', 'pan', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="aadhaar">Aadhaar Number</Label>
                        <Input id="aadhaar" value={profile.personal_info.aadhaar} onChange={(e) => handleChange('personal_info', 'aadhaar', e.target.value)} />
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

                <Separator />

                {/* Bank Details */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" value={profile.bank_details.bankName} onChange={(e) => handleChange('bank_details', 'bankName', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" value={profile.bank_details.accountNumber} onChange={(e) => handleChange('bank_details', 'accountNumber', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input id="ifsc" value={profile.bank_details.ifsc} onChange={(e) => handleChange('bank_details', 'ifsc', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="upi">UPI ID (Optional)</Label>
                            <Input id="upi" value={profile.bank_details.upi} onChange={(e) => handleChange('bank_details', 'upi', e.target.value)} />
                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <Label htmlFor="bankAddress">Bank Address</Label>
                            <Input id="bankAddress" value={profile.bank_details.bankAddress} onChange={(e) => handleChange('bank_details', 'bankAddress', e.target.value)} />
                        </div>
                    </div>
                </div>

                <Separator />

                 {/* Nominee Details */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Nominee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="nomineeName">Nominee Name</Label>
                            <Input id="nomineeName" value={profile.nominee_details.nomineeName} onChange={(e) => handleChange('nominee_details', 'nomineeName', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nomineeFatherName">Nominee's Father Name</Label>
                            <Input id="nomineeFatherName" value={profile.nominee_details.nomineeFatherName} onChange={(e) => handleChange('nominee_details', 'nomineeFatherName', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Input id="relationship" value={profile.nominee_details.relationship} onChange={(e) => handleChange('nominee_details', 'relationship', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nomineeMobile">Nominee Mobile</Label>
                            <Input id="nomineeMobile" value={profile.nominee_details.nomineeMobile} onChange={(e) => handleChange('nominee_details', 'nomineeMobile', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="nomineeDob">Nominee Date of Birth</Label>
                            <Input id="nomineeDob" value={profile.nominee_details.nomineeDob && isValid(parseISO(profile.nominee_details.nomineeDob)) ? format(parseISO(profile.nominee_details.nomineeDob), "yyyy-MM-dd") : ''} onChange={(e) => handleDateChange('nominee_details', 'nomineeDob', e.target.value)} type="date" />
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

export default function EditProfilePage() {
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
                <ProfileEditor />
            </Suspense>
            <AppFooter />
        </div>
    );
}
