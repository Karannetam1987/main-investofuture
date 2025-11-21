
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
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import initialMaturityFundData from "@/lib/data/maturity-fund.json";

type MaturityFund = typeof initialMaturityFundData;

export default function MaturityFundPage() {
  const [maturityFundData, setMaturityFundData] = useState<MaturityFund | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setMaturityFundData(initialMaturityFundData);
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
              <CardTitle>Maturity Fund Details</CardTitle>
              <CardDescription>
                Details of your maturity fund investment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !maturityFundData ? (
                 <div className="text-center py-12 text-muted-foreground">
                    No maturity fund data found for your account.
                 </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-muted-foreground">Description</h4>
                    <p className="whitespace-pre-line">{maturityFundData.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-semibold text-secondary font-headline mb-4">Statement of Maturity Fund</h3>
                    <div className="space-y-4">
                      {maturityFundData.statements.map((statement) => (
                        <Card key={statement.id} className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center text-sm">
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Maturity Amount</h4>
                              <p className="font-medium">₹{statement.amount}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Date</h4>
                              <p className="font-medium">{format(parseISO(statement.date), "PPP")}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-muted-foreground">Status</h4>
                              <Badge variant={statement.status === "Paid" ? "default" : "secondary"}>
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
