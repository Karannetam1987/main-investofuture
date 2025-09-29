import {
  Banknote,
  BookUser,
  Gift,
  Handshake,
  HeartHandshake,
  LayoutGrid,
  Library,
  PiggyBank,
  ShieldAlert,
  User,
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

const dashboardItems = [
  {
    icon: <User className="w-8 h-8 text-primary" />,
    title: "Profile",
    description: "Manage your personal information.",
    href: "/dashboard/profile",
  },
  {
    icon: <BookUser className="w-8 h-8 text-primary" />,
    title: "Nominee Details",
    description: "View your nominee details.",
    href: "#",
  },
  {
    icon: <Banknote className="w-8 h-8 text-primary" />,
    title: "Bank Details",
    description: "View your bank account information.",
    href: "#",
  },
  {
    icon: <Gift className="w-8 h-8 text-primary" />,
    title: "Joining Gift",
    description: "View your joining gift items and details.",
    href: "#",
  },
  {
    icon: <ShieldAlert className="w-8 h-8 text-primary" />,
    title: "Accidental Insurance",
    description: "View your accidental insurance policy details.",
    href: "#",
  },
  {
    icon: <Handshake className="w-8 h-8 text-primary" />,
    title: "Scholarship",
    description: "View scholarship details for your children.",
    href: "#",
  },
  {
    icon: <PiggyBank className="w-8 h-8 text-primary" />,
    title: "Interest Fund",
    description: "View your interest fund deposits and statements.",
    href: "#",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-primary" />,
    title: "Maturity Fund",
    description: "View your maturity fund deposits and statements.",
    href: "#",
  },
  {
    icon: <Library className="w-8 h-8 text-primary" />,
    title: "My Documents",
    description: "View and download your credential documents.",
    href: "#",
  },
];

export default function DashboardPage() {
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
              Welcome back, karan Singh Sidar! Here's a summary of your
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
