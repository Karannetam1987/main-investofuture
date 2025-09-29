import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    id: "IF-12345",
    name: "Karan Singh Sidar",
    email: "karan.sidar@example.com",
    mobile: "+91-9876543210",
    status: "Active",
  },
  {
    id: "IF-12346",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "+91-9876543211",
    status: "Active",
  },
  {
    id: "IF-12347",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    mobile: "+91-9876543212",
    status: "Inactive",
  },
  {
    id: "IF-12348",
    name: "Rohan Kumar",
    email: "rohan.kumar@example.com",
    mobile: "+91-9876543213",
    status: "Active",
  },
];


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
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-secondary font-headline">Manage Users</h2>
                 <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reg. ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.mobile}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-primary' : 'bg-destructive'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
