
"use client";

import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./logo";
import { LoginPopup } from "./login-popup";
import { useUser, useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
];

export function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = React.useState(false);
  const [loginType, setLoginType] = React.useState<"User" | "Admin">("User");
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const handleLoginClick = (type: "User" | "Admin") => {
    setLoginType(type);
    setLoginPopupOpen(true);
    setOpen(false); // Close mobile menu if open
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    router.push('/');
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
                <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
                >
                {link.label}
                </Link>
            ))}
            </nav>

            {!loading && user && profile ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                             <Avatar>
                                <AvatarImage src={profile.photoURL} alt={profile.personalInfo.fullName} />
                                <AvatarFallback>
                                    <User className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile.personalInfo.fullName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {profile.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
                            Dashboard
                        </DropdownMenuItem>
                         <DropdownMenuItem onSelect={() => router.push('/dashboard/profile')}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <nav className="hidden md:flex md:items-center md:gap-2">
                    <Button variant="ghost" onClick={() => handleLoginClick("User")} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">User Login</Button>
                    <Button variant="ghost" onClick={() => handleLoginClick("Admin")} className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Admin Login</Button>
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
        </div>

      </div>
      <LoginPopup
        open={loginPopupOpen}
        onOpenChange={setLoginPopupOpen}
        loginType={loginType}
      />
    </header>
  );
}
