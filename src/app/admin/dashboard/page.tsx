import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-secondary font-headline">
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Welcome to the admin panel. Here you can manage users, view registrations, and configure application settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  User management and customization features will be available here soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
