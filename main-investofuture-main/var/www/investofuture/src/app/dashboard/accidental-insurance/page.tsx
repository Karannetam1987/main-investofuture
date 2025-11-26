
"use client";

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
import { ArrowLeft, ShieldCheck, Calendar, IndianRupee, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import React, { Suspense, useEffect, useState } from "react";

// Mock data, replace with your actual data fetching logic
const mockInsuranceData: AccidentalInsurance = {
    policyNumber: "POL98765",
    openDate: "2023-01-15T00:00:00.000Z",
    expiryDate: "2028-01-14T00:00:00.000Z",
    deathCover: "500000",
    handicapCover: "250000",
    description: "Comprehensive accidental coverage for Karan Netam.",
    statements: [
        { id: 1, name: "Annual Policy 2023", openingDate: "2023-01-15T00:00:00.000Z", expiryDate: "2024-01-14T00:00:00.000Z", years: 1, status: "Active" }
    ]
};

type Statement = {
    id: number;
    name: string;
    openingDate: string;
    expiryDate: string;
    years: number;
    status: "Active" | "Inactive" | "Expired";
}

type AccidentalInsurance = {
  policyNumber: string;
  openDate: string;
  expiryDate: string;
  deathCover: string;
  handicapCover: string;
  description: string;
  statements: Statement[];
};


function AccidentalInsuranceContent() {
  const [insuranceData, setInsuranceData] = useState<AccidentalInsurance | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  useEffect(() => {
    setDataLoading(true);
    // Simulate API call to fetch data
    setTimeout(() => {
      setInsuranceData(mockInsuranceData);
      setDataLoading(false);
    }, 500);
  }, []);
  
  const isLoading = dataLoading;

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
                <CardTitle>Accidental Insurance</CardTitle>
                <CardDescription>
                Details of your accidental insurance policy.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
                ) : !insuranceData ? (
                <div className="text-center py-12 text-muted-foreground">
                    No accidental insurance data found for this account.
                </div>
                ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Policy Reg. Number</h4>
                            <p className="font-medium">{insuranceData.policyNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Policy Open Date</h4>
                            <p className="font-medium">{format(parseISO(insuranceData.openDate), "PPP")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-destructive"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Expiry Date</h4>
                            <p className="font-medium">{format(parseISO(insuranceData.expiryDate), "PPP")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <IndianRupee className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Accident Death Cover</h4>
                            <p className="font-medium">₹{insuranceData.deathCover}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <IndianRupee className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Handicap Cover</h4>
                            <p className="font-medium">₹{insuranceData.handicapCover}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                        <h4 className="font-semibold text-muted-foreground">Description</h4>
                        <p>{insuranceData.description}</p>
                    </div>
                    </div>

                    <Separator />

                    <div>
                    <h3 className="text-xl font-semibold text-secondary font-headline mb-4">Statement of Accidental Policy</h3>
                    <div className="space-y-4">
                        {insuranceData.statements.map((statement) => (
                        <Card key={statement.id} className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-sm">
                            <div>
                                <h4 className="font-semibold text-muted-foreground">Policy Name</h4>
                                <p className="font-medium">{statement.name}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-muted-foreground">Opening Date</h4>
                                <p className="font-medium">{format(parseISO(statement.openingDate), "PPP")}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-muted-foreground">Expiry Date</h4>
                                <p className="font-medium">{format(parseISO(statement.expiryDate), "PPP")}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-muted-foreground">Years</h4>
                                <p className="font-medium">{statement.years}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-muted-foreground">Status</h4>
                                <Badge variant={statement.status === "Active" ? "default" : "destructive"}>
                                    {statement.status}
                                </Badge>
                            </div>
                            </div>
                        </Card>
                        ))}
                    </div>
                    </div>
                </>
                )}
            </CardContent>
            </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default function AccidentalInsurancePage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>}>
            <AccidentalInsuranceContent />
        </Suspense>
    )
}
