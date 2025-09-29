
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
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
                Your personal details as provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="regId">Registration ID</Label>
                    <Input id="regId" defaultValue="INF001" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Karan Singh Sidar" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" defaultValue="Father's Name" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input id="motherName" defaultValue="Mother's Name" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" defaultValue="+91-9876543210" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="karan.sidar@example.com" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" defaultValue="01/01/1990" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" defaultValue="Male" readOnly />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Input id="maritalStatus" defaultValue="Single" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" defaultValue="Hindu" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input id="caste" defaultValue="General" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Children</Label>
                    <Input id="children" defaultValue="0" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input id="bloodGroup" defaultValue="O+" readOnly />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="identificationMark">Identification Mark</Label>
                    <Input id="identificationMark" defaultValue="A mole on the right cheek" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input id="pan" defaultValue="ABCDE1234F" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" defaultValue="xxxx-xxxx-1234" readOnly />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Details */}
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 font-headline">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Permanent Address</Label>
                        <Textarea defaultValue="123, ABC Street, New Delhi, India - 110001" rows={3} readOnly/>
                    </div>
                     <div className="space-y-2">
                        <Label>Current Address</Label>
                        <Textarea defaultValue="123, ABC Street, New Delhi, India - 110001" rows={3} readOnly/>
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
                    <Input id="bankName" defaultValue="State Bank of India" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" defaultValue="************1234" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" defaultValue="SBIN0001234" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" defaultValue="karan.sidar@upi" readOnly />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bankAddress">Bank Address</Label>
                     <Textarea defaultValue="Main Branch, New Delhi, India" readOnly/>
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
                    <Input id="nomineeName" defaultValue="Nominee Name" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeFatherName">Nominee's Father Name</Label>
                    <Input id="nomineeFatherName" defaultValue="Nominee Father's Name" readOnly />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" defaultValue="Spouse" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeMobile">Nominee Mobile Number</Label>
                    <Input id="nomineeMobile" defaultValue="+91-9876543211" readOnly />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="nomineeDob">Nominee's Date of Birth</Label>
                    <Input id="nomineeDob" defaultValue="01/01/1992" readOnly />
                  </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
