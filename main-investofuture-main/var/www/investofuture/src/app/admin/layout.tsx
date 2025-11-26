
"use client";

import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserSearch,
  Gift,
  ShieldAlert,
  Handshake,
  PiggyBank,
  HeartHandshake,
  Library,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as React from "react";
import { Logo } from "@/components/logo";

const adminNavItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/manage-users",
    label: "Manage Users",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/user-dashboard",
    label: "View/Edit User",
    icon: <UserSearch className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/joining-gift",
    label: "Joining Gift",
    icon: <Gift className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/accidental-insurance",
    label: "Accidental Insurance",
    icon: <ShieldAlert className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/scholarship",
    label: "Scholarship",
    icon: <Handshake className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/interest-fund",
    label: "Interest Fund",
    icon: <PiggyBank className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/maturity-fund",
    label: "Maturity Fund",
    icon: <HeartHandshake className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/my-documents",
    label: "My Documents",
    icon: <Library className="mr-2 h-4 w-4" />,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
];

function AdminSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, you'd clear the user's session/token
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out from the admin panel.",
    });
    router.push("/");
  };

  return (
     <div className="flex h-full flex-col">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Admin Menu</h2>
        <nav className="flex flex-col gap-2 flex-1">
        {adminNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
            <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start"
            >
                {item.icon}
                {item.label}
            </Button>
            </Link>
        ))}
        </nav>
        <Button
            variant="destructive"
            className="w-full justify-start mt-4"
            onClick={handleLogout}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
     </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <div className="flex items-center gap-2 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col pt-16">
                   <AdminSidebarContent />
                </SheetContent>
            </Sheet>
             <div className="md:hidden">
                <Logo />
            </div>
        </div>
         <div className="hidden md:block">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-card p-6 md:flex">
          <AdminSidebarContent />
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
