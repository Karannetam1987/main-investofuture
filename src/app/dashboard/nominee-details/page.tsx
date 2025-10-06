
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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import userData from "@/lib/data/user-data.json";

export default function NomineeDetailsPage() {
    const [nomineeDetails, setNomineeDetails] = useState(userData[0].nomineeDetails);
    const { toast } = useToast();

    const handleSaveChanges = () => {
        // In a real app, you'd call an API to save this.
        console.log("Saving nominee details:", nomineeDetails);
        toast({
            title: "Success!",
            description: "Your nominee details have been updated.",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNomineeDetails(prev => ({...prev, [id]: value}));
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
                  <Input id="nomineeDob" value={nomineeDetails.nomineeDob} onChange={handleChange} />
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
