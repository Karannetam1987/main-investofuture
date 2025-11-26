
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";


interface LoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginType: "User" | "Admin";
  onLoginSuccess: (regId: string) => void;
}

export function LoginPopup({
  open,
  onOpenChange,
  loginType,
  onLoginSuccess,
}: LoginPopupProps) {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      setIsSubmitting(false);
    }
  }, [open, loginType]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
        });
    } else {
        // Find regId to pass to onLoginSuccess
        const { data: profile } = await supabase
            .from('profiles')
            .select('regId')
            .eq('email', email)
            .single();

        onLoginSuccess(profile?.regId || '');
    }

    setIsSubmitting(false);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordEmail(email.includes('@') ? email : '');
    setShowForgotPassword(true);
  };
  
  const handleSendOtp = async () => {
    if (!forgotPasswordEmail) {
       toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/`,
    });
     
    if (error) {
         toast({
            title: "Error Sending Reset Link",
            description: error.message,
            variant: "destructive"
        });
    } else {
        toast({
            title: "Password Reset Email Sent",
            description: `If an account exists for ${forgotPasswordEmail}, a password reset link has been sent.`
        });
    }
    
    setIsSubmitting(false);
    setShowForgotPassword(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {showForgotPassword ? "Forgot Password" : `${loginType} Login`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {showForgotPassword
              ? `Enter your account's email address to receive a password reset link.`
              : `Access your ${loginType.toLowerCase()} account.`}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="pt-6">
            {showForgotPassword ? (
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                </div>
                 <Button 
                    onClick={handleSendOtp} 
                    className="w-full"
                    disabled={isSubmitting}
                 >
                    {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                </Button>
                <div className="text-center text-sm">
                    <button onClick={() => setShowForgotPassword(false)} className="text-primary hover:underline" disabled={isSubmitting}>
                        Back to Login
                    </button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type={'email'}
                    placeholder={"Enter your Email"}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-primary hover:underline"
                    disabled={isSubmitting}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            )}

            {!showForgotPassword && loginType === "User" && (
              <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
