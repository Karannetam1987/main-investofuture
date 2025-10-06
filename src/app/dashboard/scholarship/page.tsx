
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
import { ArrowLeft, User, Users, IndianRupee, Calendar, Hash } from "lucide-react";
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

const scholarshipData = {
  registerName: "Karan Singh Sidar",
  childrenCount: 1,
  scholarshipAmount: "5,000",
  years: 1,
  children: [
    {
      id: 1,
      childName: "Aarav Singh",
      fatherName: "Karan Singh Sidar",
      motherName: "Priya Sidar",
      gender: "Male",
      dob: "October 6th, 2025",
      paymentStatements: [
        {
          id: 101,
          year: "2024",
          amount: "2,500",
          status: "Paid",
          paymentDate: "July 15th, 2024",
        },
        {
          id: 102,
          year: "2025",
          amount: "2,500",
          status: "Pending",
          paymentDate: null,
        },
      ],
    },
  ],
};

export default function ScholarshipPage() {
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
                                <p className="font-medium">{child.gender}</p>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <Calendar className="h-5 w-5 text-primary mt-1"/>
                                <div>
                                    <h4 className="font-semibold text-muted-foreground">Date of Birth</h4>
                                    <p className="font-medium">{child.dob}</p>
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
                                            <TableCell>{stmt.paymentDate ?? 'N/A'}</TableCell>
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
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
