
"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface LoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginType: "User" | "Admin";
  onLoginSuccess: () => void;
}

const ADMIN_EMAIL = "karannetam4@gmail.com";
const ADMIN_PASSWORD = "admin";

export function LoginPopup({
  open,
  onOpenChange,
  loginType,
  onLoginSuccess,
}: LoginPopupProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  useEffect(() => {
    if (open) {
      setEmailOrId("");
      setPassword("");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    }
  }, [open, loginType]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
      if (loginType === "Admin") {
        if (emailOrId.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
           toast({ title: "Admin Login Successful", description: "Redirecting to dashboard..." });
           router.push("/admin/dashboard");
           onOpenChange(false);
           return;
        } else {
            toast({
              title: "Admin Login Failed",
              description: "Invalid credentials for administrator.",
              variant: "destructive",
            });
            return;
        }
      }
      
      // Simulate user login
      toast({ title: "Login Successful", description: "Redirecting..." });
      onLoginSuccess(); // Notify header to update UI
      router.push("/dashboard");
      onOpenChange(false);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordEmail(emailOrId);
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
    // Simulate sending email
    toast({
        title: "Password Reset Email Sent",
        description: `If an account exists for ${forgotPasswordEmail}, a password reset link has been sent.`
    });
    setShowForgotPassword(false);
  }
  
  const isPasswordDisabled = false;
  const isForgotPassDisabled = loginType === 'Admin' && forgotPasswordEmail.toLowerCase() !== ADMIN_EMAIL && forgotPasswordEmail !== "";

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
                    disabled={isForgotPassDisabled}
                 >
                    Send Reset Link
                </Button>
                <div className="text-center text-sm">
                    <button onClick={() => setShowForgotPassword(false)} className="text-primary hover:underline">
                        Back to Login
                    </button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <Label htmlFor="emailOrId">
                    {loginType === "Admin" ? "Admin Email" : "Email"}
                  </Label>
                  <Input
                    id="emailOrId"
                    type="email"
                    placeholder={loginType === 'Admin' ? "Enter your email" : "Enter your email"}
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
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
                    disabled={isPasswordDisabled}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPasswordDisabled}>
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-primary hover:underline"
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
