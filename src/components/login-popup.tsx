"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loginType: "User" | "Admin";
}

export function LoginPopup({
  open,
  onOpenChange,
  loginType,
}: LoginPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {loginType} Login
          </DialogTitle>
          <DialogDescription className="text-center">
            Access your {loginType.toLowerCase()} account.
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrId">Email or Registration ID</Label>
                <Input
                  id="emailOrId"
                  placeholder="Enter your email or ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="text-center text-sm">
                <Link href="#" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
