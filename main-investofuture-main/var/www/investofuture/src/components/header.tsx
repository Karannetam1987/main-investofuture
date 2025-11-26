
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User, LogOut, LoaderCircle } from "lucide-react";
import * as React from 'react';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [loading] = React.useState(false);
  // User is hardcoded to null as auth is removed
  const user = null;

  const scrollTo = (id:string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-secondary-foreground border-secondary-foreground/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center mr-4">
          <Logo />
        </div>
        
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex md:items-center md:gap-4">
            {navLinks.map((link) => (
                <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
                >
                {link.label}
                </button>
            ))}
            </nav>

            {loading ? (
              <LoaderCircle className="h-6 w-6 animate-spin" />
            ) : (
                <nav className="hidden md:flex md:items-center md:gap-2">
                    <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Admin Login</Button>
                </nav>
            )}

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
                    <button
                        key={link.href}
                        onClick={() => { scrollTo(link.href); setOpen(false); }}
                        className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                    >
                        {link.label}
                    </button>
                    ))}
                    <button
                      onClick={() => { router.push('/admin/dashboard'); setOpen(false); }}
                      className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                    >
                      Admin Login
                    </button>
                </nav>
                </SheetContent>
            </Sheet>
            </div>
        </div>

      </div>
    </header>
  );
}
