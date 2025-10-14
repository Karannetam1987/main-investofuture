
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
import { ArrowLeft, User, Users, IndianRupee, Calendar, Hash, LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import initialScholarshipData from "@/lib/data/scholarship.json";
import { useState, useEffect } from "react";

type Scholarship = typeof initialScholarshipData;

export default function ScholarshipPage() {
  const [scholarshipData, setScholarshipData] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setScholarshipData(initialScholarshipData);
      setLoading(false);
    }, 500);
  }, []);

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
              <CardTitle>Scholarship Details</CardTitle>
              <CardDescription>
                Details of your scholarship benefits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                 <div className="flex items-center justify-center py-12">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : !scholarshipData ? (
                 <div className="text-center py-12 text-muted-foreground">
                    No scholarship data found for your account.
                 </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
                    <div className="flex items-center gap-3">
                        <User className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Register Name</h4>
                            <p className="font-medium">{scholarshipData.registerName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">No. of Children</h4>
                            <p className="font-medium">{scholarshipData.childrenCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <IndianRupee className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Scholarship Amount</h4>
                            <p className="font-medium">₹{scholarshipData.scholarshipAmount}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Hash className="h-6 w-6 text-primary"/>
                        <div>
                            <h4 className="font-semibold text-muted-foreground">Years</h4>
                            <p className="font-medium">{scholarshipData.years}</p>
                        </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-secondary font-headline mb-4">Children Details</h3>
                    <div className="space-y-6">
                      {scholarshipData.children.map((child) => (
                        <Card key={child.id} className="p-4 md:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                                <div>
                                    <h4 className="font-semibold text-muted-foreground">Child's Name</h4>
                                    <p className="font-medium">{child.childName}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-muted-foreground">Father's Name</h4>
                                    <p className="font-medium">{child.fatherName}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-muted-foreground">Mother's Name</h4>
                                    <p className="font-medium">{child.motherName}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-muted-foreground">Gender</h4>
                                    <p className="font-medium capitalize">{child.gender}</p>
                                </div>
                                <div className="flex items-start gap-3 md:col-span-2">
                                    <Calendar className="h-5 w-5 text-primary mt-1"/>
                                    <div>
                                        <h4 className="font-semibold text-muted-foreground">Date of Birth</h4>
                                        <p className="font-medium">{format(parseISO(child.dob), "PPP")}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-md font-semibold">Payment Statements</h4>
                                <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Payment Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {child.paymentStatements.map(stmt => (
                                            <TableRow key={stmt.id}>
                                                <TableCell className="font-medium">{stmt.year}</TableCell>
                                                <TableCell>₹{stmt.amount}</TableCell>
                                                <TableCell>{stmt.paymentDate ? format(parseISO(stmt.paymentDate), "PPP") : 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Badge variant={stmt.status === "Paid" ? "default" : "destructive"}>
                                                        {stmt.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
  );
}
