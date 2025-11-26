
"use client";

import { useState, useEffect, Suspense } from "react";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, LoaderCircle, User as UserIcon, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format, parseISO, isValid } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- TYPE DEFINITIONS ---
type PersonalInfo = {
    fullName: string; fatherName: string; motherName: string; dob: string; gender: string; maritalStatus: string; religion: string; caste: string; children: string; bloodGroup: string; identificationMark: string; pan: string; aadhaar: string;
};
type Address = { permanent: string; current: string; };
type BankDetails = { bankName: string; accountNumber: string; ifsc: string; upi: string; bankAddress: string; };
type NomineeDetails = { nomineeName: string; nomineeFatherName: string; relationship: string; nomineeMobile: string; nomineeDob: string; };

export type UserProfile = {
    id: string; 
    regId: string;
    email: string; 
    mobile: string; 
    photoURL: string; 
    status: "Active" | "Inactive";
    personal_info: PersonalInfo;
    address: Address;
    bank_details: BankDetails;
    nominee_details: NomineeDetails;
};

// MOCK DATA
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

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value || "N/A"}</p>
    </div>
);


function ProfileViewer() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isAdminView] = useState(!!searchParams.get("userId"));

  useEffect(() => {
    setProfileLoading(true);
    // Simulate fetching data
    setTimeout(() => {
        setProfile(mockProfile);
        setProfileLoading(false);
    }, 500);
  }, []);
  
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
                 <p className="text-muted-foreground mb-4">Could not find profile data.</p>
                 <Link href={isAdminView ? "/admin/user-dashboard" : "/dashboard"}>
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
          <div className="mb-6 flex justify-between items-center">
            <Link href={isAdminView ? "/admin/user-dashboard" : "/dashboard"}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {isAdminView ? "Admin" : "Dashboard"}
              </Button>
            </Link>
             {isAdminView && (
                 <Link href={`/admin/profile/edit?userId=${profile.regId}`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4"/>
                        Edit Profile
                    </Button>
                </Link>
             )}
          </div>
          <div className="space-y-8">
            <Card>
                <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
                    <Avatar className="w-24 h-24 text-lg">
                        <AvatarImage src={profile.photoURL} alt={profile.personal_info.fullName} />
                        <AvatarFallback>
                            <UserIcon className="w-10 h-10" />
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                        <CardTitle className="text-3xl">{profile.personal_info.fullName || "User Profile"}</CardTitle>
                        <CardDescription className="mt-1">
                           Registration ID: {profile.regId}
                        </CardDescription>
                    </div>
                </div>

                </CardHeader>
                <CardContent className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Full Name" value={profile.personal_info.fullName} />
                        <DetailItem label="Father's Name" value={profile.personal_info.fatherName} />
                        <DetailItem label="Mother's Name" value={profile.personal_info.motherName} />
                        <DetailItem label="Mobile Number" value={profile.mobile} />
                        <DetailItem label="Email" value={profile.email} />
                        <DetailItem label="Date of Birth" value={profile.personal_info.dob && isValid(parseISO(profile.personal_info.dob)) ? format(parseISO(profile.personal_info.dob), "PPP") : 'N/A'} />
                        <DetailItem label="Gender" value={profile.personal_info.gender} />
                        <DetailItem label="Marital Status" value={profile.personal_info.maritalStatus} />
                        <DetailItem label="Religion" value={profile.personal_info.religion} />
                        <DetailItem label="Caste" value={profile.personal_info.caste} />
                        <DetailItem label="Children" value={profile.personal_info.children} />
                        <DetailItem label="Blood Group" value={profile.personal_info.bloodGroup} />
                        <DetailItem label="Identification Mark" value={profile.personal_info.identificationMark} />
                        <DetailItem label="PAN Number" value={profile.personal_info.pan} />
                        <DetailItem label="Aadhaar Number" value={profile.personal_info.aadhaar} />
                    </div>
                </div>

                <Separator />

                {/* Address Details */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Address Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailItem label="Permanent Address" value={<p className="whitespace-pre-wrap">{profile.address.permanent}</p>} />
                        <DetailItem label="Current Address" value={<p className="whitespace-pre-wrap">{profile.address.current}</p>} />
                    </div>
                </div>

                <Separator />

                {/* Bank Details */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Bank Name" value={profile.bank_details.bankName} />
                        <DetailItem label="Account Number" value={profile.bank_details.accountNumber} />
                        <DetailItem label="IFSC Code" value={profile.bank_details.ifsc} />
                        <DetailItem label="UPI ID" value={profile.bank_details.upi} />
                        <DetailItem label="Bank Address" value={profile.bank_details.bankAddress} />
                    </div>
                </div>

                <Separator />

                 {/* Nominee Details */}
                <div>
                    <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Nominee Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DetailItem label="Nominee Name" value={profile.nominee_details.nomineeName} />
                        <DetailItem label="Nominee's Father Name" value={profile.nominee_details.nomineeFatherName} />
                        <DetailItem label="Relationship" value={profile.nominee_details.relationship} />
                        <DetailItem label="Nominee Mobile" value={profile.nominee_details.nomineeMobile} />
                        <DetailItem label="Nominee Date of Birth" value={profile.nominee_details.nomineeDob && isValid(parseISO(profile.nominee_details.nomineeDob)) ? format(parseISO(profile.nominee_details.nomineeDob), "PPP") : 'N/A'} />
                    </div>
                </div>
                </CardContent>
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
                <ProfileViewer />
            </Suspense>
            <AppFooter />
        </div>
    );
}
