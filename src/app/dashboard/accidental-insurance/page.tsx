
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
import { ArrowLeft, ShieldCheck, Calendar, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import insuranceData from "@/lib/data/accidental-insurance.json";
import { format } from "date-fns";

export default function AccidentalInsurancePage() {
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
                        <p className="font-medium">{format(new Date(insuranceData.openDate), "PPP")}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-destructive"/>
                    <div>
                        <h4 className="font-semibold text-muted-foreground">Expiry Date</h4>
                        <p className="font-medium">{format(new Date(insuranceData.expiryDate), "PPP")}</p>
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
                            <p className="font-medium">{format(new Date(statement.openingDate), "PPP")}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Expiry Date</h4>
                            <p className="font-medium">{format(new Date(statement.expiryDate), "PPP")}</p>
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
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
