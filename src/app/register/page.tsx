"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function RegisterPage() {
  const [dob, setDob] = useState<Date>();
  const [nomineeDob, setNomineeDob] = useState<Date>();
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <Card className="max-w-4xl mx-auto card-within-page">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold font-headline text-secondary">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary font-headline">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father&apos;s Name</Label>
                    <Input id="fatherName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother&apos;s Name</Label>
                    <Input id="motherName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" placeholder="123-456-7890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-card",
                            !dob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dob}
                          onSelect={setDob}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup defaultValue="male" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                     <RadioGroup defaultValue="single" className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single">Single</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="married" id="married" />
                        <Label htmlFor="married">Married</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="divorced" id="divorced" />
                        <Label htmlFor="divorced">Divorced</Label>
                      </div>
                       <div className="flex items-center space-x-2">
                        <RadioGroupItem value="widowed" id="widowed" />
                        <Label htmlFor="widowed">Widowed</Label>
                      </div>
                    </RadioGroup>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caste">Caste</Label>
                    <Input id="caste" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="children">Children (Optional)</Label>
                    <Input id="children" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
                    <Input id="bloodGroup" />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="identificationMark">Identification Mark (Optional)</Label>
                    <Input id="identificationMark" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input id="pan" placeholder="ABCDE1234F" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" placeholder="1234 5678 9012" />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-secondary font-headline">Address Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <Label className="text-md font-medium">Permanent Address</Label>
                        <div className="space-y-2">
                            <Label htmlFor="address1">Address Line 1</Label>
                            <Input id="address1" placeholder="1234 Main St" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                            <Input id="address2" placeholder="Apartment, studio, or floor" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Anytown" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" placeholder="State" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input id="pincode" placeholder="123456" />
                            </div>
                        </div>
                    </div>
                     <div className="md:col-span-2 flex items-center space-x-2">
                        <Checkbox id="sameAsPermanent" checked={sameAsPermanent} onCheckedChange={(checked) => setSameAsPermanent(checked as boolean)} />
                        <Label htmlFor="sameAsPermanent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Current address is the same as permanent address
                        </Label>
                    </div>

                    {!sameAsPermanent && (
                         <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="currentAddress">Full Current Address</Label>
                            <Textarea id="currentAddress" placeholder="Enter your full current address" />
                        </div>
                    )}
                </div>
              </div>

               {/* Bank Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary font-headline">Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi">UPI ID (Optional)</Label>
                    <Input id="upi" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bankAddress">Bank Address</Label>
                     <Textarea id="bankAddress" />
                  </div>
                </div>
                 <p className="text-sm text-muted-foreground">Other details like Joining Gifts, Insurance, Funds, and Children can be managed from the Admin Panel after registration.</p>
              </div>

              {/* Nominee Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary font-headline">Nominee Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <Label htmlFor="nomineeName">Nominee Name</Label>
                    <Input id="nomineeName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeFatherName">Nominee&apos;s Father Name</Label>
                    <Input id="nomineeFatherName" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomineeMobile">Nominee Mobile Number</Label>
                    <Input id="nomineeMobile" />
                  </div>
                   <div className="space-y-2">
                    <Label>Nominee&apos;s Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-card",
                            !nomineeDob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {nomineeDob ? format(nomineeDob, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={nomineeDob}
                          onSelect={setNomineeDob}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                 </div>
              </div>
              
              {/* Set Password */}
               <div className="space-y-4">
                <h3 className="text-xl font-semibold text-secondary font-headline">Set Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" />
                    </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the Terms and Conditions
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create an account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
