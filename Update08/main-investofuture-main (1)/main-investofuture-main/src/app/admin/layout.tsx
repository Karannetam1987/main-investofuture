
"use client";

import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Admin Menu</h2>
          <nav className="flex flex-col gap-2">
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
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
      <AppFooter />
    </div>
  );
}
