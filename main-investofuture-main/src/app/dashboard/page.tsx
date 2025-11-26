

"use client";

import {
  Banknote,
  Gift,
  Handshake,
  HeartHandshake,
  Library,
  PiggyBank,
  ShieldAlert,
  User as UserIcon,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
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
import { useUser } from "@/firebase";
import type { UserProfile } from "./profile/page";

const dashboardItems = [
  {
    icon: <UserIcon className="w-8 h-8 text-primary" />,
    title: "Profile",
    description: "Manage your personal, nominee, and bank details.",
    href: "/dashboard/profile",
  },
  {
    icon: <Gift className="w-8 h-8 text-primary" />,
    title: "Joining Gift",
    description: "View your joining gift items and details.",
    href: "/dashboard/joining-gift",
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-primary" />,
    title: "Accidental Insurance",
    description: "View your accidental insurance policy details.",
    href: "/dashboard/accidental-insurance",
  },
  {
    icon: <Handshake className="w-8 h-8 text-primary" />,
    title: "Scholarship",
    description: "View scholarship details for your children.",
    href: "/dashboard/scholarship",
  },
  {
    icon: <PiggyBank className="w-8 h-8 text-primary" />,
    title: "Interest Fund",
    description: "View your interest fund deposits and statements.",
    href: "/dashboard/interest-fund",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-primary" />,
    title: "Maturity Fund",
    description: "View your maturity fund deposits and statements.",
    href: "/dashboard/maturity-fund",
  },
  {
    icon: <Library className="w-8 h-8 text-primary" />,
    title: "My Documents",
    description: "View and download your credential documents.",
    href: "/dashboard/my-documents",
  },
];


export default function DashboardPage() {
  const { user, loading } = useUser();
  const profile = user?.profile as UserProfile | null;

  if (loading) {
      return (
          <div className="flex min-h-screen flex-col bg-background">
            <AppHeader />
             <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
            <AppFooter />
        </div>
      )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary font-headline">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {profile?.personal_info?.fullName || "User"}! Here's a summary of your
              account.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboardItems.map((item) => (
              <Card key={item.title} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  {item.icon}
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex items-end">
                  <Link href={item.href} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
