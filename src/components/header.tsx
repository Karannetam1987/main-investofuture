"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import * as React from 'react';
import { usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { LoginPopup } from "./login-popup";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
];

export function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const [loginType, setLoginType] = React.useState<"User" | "Admin">("User");

  const handleLoginClick = (type: "User" | "Admin") => {
    setLoginType(type);
    setLoginPopupOpen(true);
    setOpen(false); // Close mobile menu if open
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-secondary-foreground border-secondary-foreground/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-secondary text-secondary-foreground">
              <div className="px-4 pt-6">
                <Logo />
              </div>
              <nav className="flex flex-col gap-6 p-4 pt-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => handleLoginClick("User")}
                  className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                >
                  User Login
                </button>
                <button
                  onClick={() => handleLoginClick("Admin")}
                  className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                >
                  Admin Login
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="ghost" onClick={() => handleLoginClick("User")} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">User Login</Button>
          <Button variant="ghost" onClick={() => handleLoginClick("Admin")} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Admin Login</Button>
        </nav>

      </div>
      <LoginPopup
        open={loginPopupOpen}
        onOpenChange={setLoginPopupOpen}
        loginType={loginType}
      />
    </header>
  );
}
