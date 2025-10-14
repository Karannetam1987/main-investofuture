
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
import { ArrowLeft, IndianRupee, Calendar, Percent, Landmark, Wallet, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import initialFundData from "@/lib/data/interest-fund.json";
import { useState, useEffect } from "react";

type InterestFund = typeof initialFundData;

export default function InterestFundPage() {
  const [interestFundData, setInterestFundData] = useState<InterestFund | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setInterestFundData(initialFundData);
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
              <CardTitle>Interest Fund Details</CardTitle>
              <CardDescription>
                Details of your interest fund investment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !interestFundData ? (
                <div className="text-center py-12 text-muted-foreground">
                  No interest fund data found for your account.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Deposit Amount</h4>
                        <p className="font-medium">₹{interestFundData.depositAmount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Deposit Date</h4>
                        <p className="font-medium">{format(parseISO(interestFundData.depositDate), "PPP")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Percent className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Annual Interest (%)</h4>
                        <p className="font-medium">{interestFundData.annualInterest}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wallet className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Interest Return Mode</h4>
                        <p className="font-medium">{interestFundData.interestReturnMode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Landmark className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-muted-foreground">Payment Mode</h4>
                        <p className="font-medium">{interestFundData.paymentMode}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <h4 className="font-semibold text-muted-foreground">Description</h4>
                      <p>{interestFundData.description}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-secondary font-headline mb-4">Statement of Interest</h3>
                    <div className="space-y-4">
                      {interestFundData.statements.map((statement) => (
                        <Card key={statement.id} className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center text-sm">
                            <div>
                              <h4 className="font-semibold text-muted-foreground">4th Monthly Date</h4>
                              <p className="font-medium">{format(parseISO(statement.date), "PPP")}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Interest</h4>
                              <p className="font-medium">₹{statement.interest}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Amount</h4>
                              <p className="font-medium">₹{statement.amount}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Status</h4>
                              <Badge variant={statement.status === "Paid" ? "default" : "destructive"}>
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
  );
}
