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
}

const ADMIN_EMAIL = "karannetam4@gmail.com";
const ADMIN_PASSWORD = "randompassword123"; // This should be in an env file in a real app

export function LoginPopup({
  open,
  onOpenChange,
  loginType,
}: LoginPopupProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [canSendOtp, setCanSendOtp] = useState(false);

  useEffect(() => {
    if (loginType === "Admin") {
      setIsPasswordDisabled(emailOrId.toLowerCase() !== ADMIN_EMAIL);
    } else {
      setIsPasswordDisabled(false);
    }
  }, [emailOrId, loginType]);
  
  useEffect(() => {
    // Reset state when dialog opens or login type changes
    if (open) {
      setEmailOrId("");
      setPassword("");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      setCanSendOtp(false);
       if (loginType === 'User') {
        setIsPasswordDisabled(false);
      } else {
        setIsPasswordDisabled(true);
      }
    }
  }, [open, loginType]);


  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === "User") {
      // In a real app, you would verify user credentials here
      toast({ title: "Login Successful", description: "Redirecting to your dashboard..." });
      router.push("/dashboard");
      onOpenChange(false);
    } else if (loginType === "Admin") {
      if (emailOrId.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        toast({ title: "Admin Login Successful" });
        router.push('/admin/dashboard'); 
        onOpenChange(false);
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordEmail(loginType === 'Admin' ? emailOrId : '');
    setShowForgotPassword(true);
  };
  
  const handleForgotPasswordEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setForgotPasswordEmail(email);
    // Enable OTP button only if it's the admin email (for this demo)
    setCanSendOtp(loginType === 'Admin' && email.toLowerCase() === ADMIN_EMAIL);
  }

  const handleSendOtp = () => {
    // In a real app, this would trigger a backend API call to send an email.
    // For now, we simulate the action.
    toast({
        title: "OTP Sent",
        description: `If an account exists for ${forgotPasswordEmail}, an OTP has been sent.`
    });
    // Reset to login form after "sending"
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
              ? `Enter your account's email address to receive an OTP.`
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
                      onChange={handleForgotPasswordEmailChange}
                      required
                    />
                </div>
                 <Button 
                    onClick={handleSendOtp} 
                    className="w-full"
                    disabled={loginType === 'Admin' && !canSendOtp}
                 >
                    Send OTP
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
                    {loginType === "Admin" ? "Admin Email" : "Email or Registration ID"}
                  </Label>
                  <Input
                    id="emailOrId"
                    placeholder={loginType === 'Admin' ? "Enter your email" : "Enter your email or ID"}
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
                    disabled={loginType === 'Admin' && isPasswordDisabled}
                  />
                </div>
                <Button type="submit" className="w-full">
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
