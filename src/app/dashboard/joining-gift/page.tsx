
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
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const giftData = {
  joiningDate: "October 1st, 2023",
  overallStatus: "Received",
  description: "Standard joining package for new members.",
  items: [
    {
      id: 1,
      name: "Smart Watch",
      status: "Received",
      dateReceived: "October 26th, 2023",
    },
    {
      id: 2,
      name: "Bag",
      status: "Received",
      dateReceived: "October 26th, 2023",
    },
    {
      id: 3,
      name: "Agreement Document",
      status: "Pending",
      dateReceived: null,
    },
  ],
};

export default function JoiningGiftPage() {
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
              <CardTitle>Joining Gift Details</CardTitle>
              <CardDescription>
                General information and the list of items for your joining gift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-muted-foreground">Joining Date</h4>
                  <p className="font-medium">{giftData.joiningDate}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground">Overall Status</h4>
                  <Badge variant={giftData.overallStatus === "Received" ? "default" : "destructive"}>
                    {giftData.overallStatus}
                  </Badge>
                </div>
                <div className="md:col-span-3">
                  <h4 className="font-semibold text-muted-foreground">Description</h4>
                  <p>{giftData.description}</p>
                </div>
              </div>
              
              <Separator />

              <div>
                <h3 className="text-xl font-semibold text-secondary font-headline mb-4">Joining Gift Items</h3>
                <div className="space-y-4">
                  {giftData.items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="font-semibold">{item.name}</div>
                        <div>
                           <Badge variant={item.status === "Received" ? "default" : "outline"} className="flex items-center w-fit">
                            {item.status === "Received" ? (
                               <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                                <Clock className="mr-2 h-4 w-4" />
                            )}
                            {item.status}
                           </Badge>
                        </div>
                        <div>
                          {item.dateReceived ? (
                            <p className="text-sm text-muted-foreground">
                              Received on: {item.dateReceived}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Not yet received
                            </p>
                          )}
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
