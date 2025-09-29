
"use client";

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
import { Eye, Pencil, Trash2, Users, Banknote, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


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

const chartData = [
  { name: 'Jan', users: 30 },
  { name: 'Feb', users: 45 },
  { name: 'Mar', users: 60 },
  { name: 'Apr', users: 50 },
  { name: 'May', users: 70 },
  { name: 'Jun', users: 90 },
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
            <CardContent className="space-y-10">
              {/* Stats Cards */}
              <div>
                <h2 className="text-2xl font-semibold text-secondary font-headline mb-4">Overview</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹5,231,890</div>
                      <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">982</div>
                      <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                      <UserX className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">252</div>
                      <p className="text-xs text-muted-foreground">+19% from last month</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

               {/* Chart */}
              <div>
                <h2 className="text-2xl font-semibold text-secondary font-headline mb-4">User Registrations</h2>
                 <Card>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* View & Edit User Dashboard */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-secondary font-headline">View & Edit User Dashboard</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-muted-foreground">
                      Enter a user's Registration ID to view their full dashboard and manage their details.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="userId">User Registration ID</Label>
                      <div className="flex gap-4">
                        <Input id="userId" placeholder="Enter User Registration ID (e.g., IF-12345)" className="max-w-xs" />
                        <Button>View/Edit User</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>


              {/* Manage Users Table */}
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
