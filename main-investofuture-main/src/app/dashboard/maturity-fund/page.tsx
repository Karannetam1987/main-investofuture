
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
import { Suspense, useState, useEffect } from "react";

// Mock data, replace with your actual data fetching logic
const mockMaturityFundData: MaturityFund = {
    description: "Standard maturity fund for Karan Netam.",
    statements: [
        { id: 1, amount: "50000", date: "2025-01-01T00:00:00.000Z", status: "Upcoming" },
        { id: 2, amount: "50000", date: "2026-01-01T00:00:00.000Z", status: "Upcoming" }
    ]
};

type Statement = {
    id: number;
    amount: string;
    date: string;
    status: "Upcoming" | "Paid" | "Delayed";
};

type MaturityFund = {
    description: string;
    statements: Statement[];
};


function MaturityFundContent() {
    const [maturityFundData, setMaturityFundData] = useState<MaturityFund | null>(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        setDataLoading(true);
        // Simulate API call
        setTimeout(() => {
            setMaturityFundData(mockMaturityFundData);
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
                <CardTitle>Maturity Fund Details</CardTitle>
                <CardDescription>
                    Details of your maturity fund investment.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : !maturityFundData ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No maturity fund data found for this account.
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

export default function MaturityFundPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>}>
            <MaturityFundContent />
        </Suspense>
    )
}
