
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Your personal details as provided during registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="regId">Registration ID</Label>
                    <Input id="regId" defaultValue="IF-12345" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Karan Singh Sidar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input id="fatherName" defaultValue="Father's Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input id="motherName" defaultValue="Mother's Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Input id="email" type="email" defaultValue="karan.sidar@example.com" />
                      <Button variant="outline">Verify</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" defaultValue="+91-9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input id="pan" defaultValue="ABCDE1234F" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" defaultValue="xxxx-xxxx-1234" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      defaultValue="123, ABC Street, New Delhi, India - 110001"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Edit Personal Information</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
