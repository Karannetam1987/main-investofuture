
"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { LoginPopup } from './login-popup';
import { useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';


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
  const searchParams = useSearchParams();
  const auth = useAuth();
  
  const { user, loading } = useUser();

  const [loginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const [loginType, setLoginType] = React.useState<"User" | "Admin">("User");

  React.useEffect(() => {
    if (searchParams.get('login')) {
      handleLoginClick('User');
    }
  }, [searchParams]);

  const handleLoginClick = (type: "User" | "Admin") => {
    setLoginType(type);
    setLoginPopupOpen(true);
  };
  
  const handleLoginSuccess = (regId: string) => {
    toast({ title: `Logged in successfully as ${regId}`});
    if (loginType === 'Admin') {
        router.push('/admin/dashboard');
    } else {
        router.push('/dashboard');
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/');
  };

  const scrollTo = (id:string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
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
            ) : user ? (
               <nav className="hidden md:flex md:items-center md:gap-2">
                 <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">
                    <User className="mr-2" /> My Dashboard
                 </Button>
                 <Button variant="ghost" onClick={handleLogout} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">
                    <LogOut className="mr-2" /> Logout
                 </Button>
              </nav>
            ) : (
                <nav className="hidden md:flex md:items-center md:gap-2">
                    <Button variant="ghost" onClick={() => handleLoginClick('User')} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">User Login</Button>
                    <Button variant="ghost" onClick={() => handleLoginClick('Admin')} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Admin Login</Button>
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
                    {user ? (
                        <>
                        <button
                         onClick={() => { router.push('/dashboard'); setOpen(false); }}
                         className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                        >
                            My Dashboard
                        </button>
                         <button
                         onClick={() => { handleLogout(); setOpen(false); }}
                         className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                        >
                            Logout
                        </button>
                        </>
                    ) : (
                         <>
                        <button
                         onClick={() => { handleLoginClick('User'); setOpen(false); }}
                         className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                        >
                            User Login
                        </button>
                         <button
                         onClick={() => { handleLoginClick('Admin'); setOpen(false); }}
                         className="text-lg font-medium text-secondary-foreground hover:text-secondary-foreground/80 text-left"
                        >
                            Admin Login
                        </button>
                        </>
                    )}
                </nav>
                </SheetContent>
            </Sheet>
            </div>
        </div>

      </div>
    </header>
    <LoginPopup 
        open={loginPopupOpen} 
        onOpenChange={setLoginPopupOpen} 
        loginType={loginType}
        onLoginSuccess={handleLoginSuccess}
    />
    </>
  );
}
