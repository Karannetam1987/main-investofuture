
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import initialUsersData from '@/lib/data/users.json';


type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};


export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);


  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleStatusChange = (userId: string, newStatus: "Active" | "Inactive") => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    toast({
        title: "Status Updated (Simulated)",
        description: `User ${userId}'s status has been changed to ${newStatus} in the browser.`,
    });
  };
  
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    toast({
        title: "User Deleted (Simulated)",
        description: `User ${userToDelete.name} (${userToDelete.id}) has been removed from the browser.`,
        variant: "destructive"
    });

    setDeleteAlertOpen(false);
    setUserToDelete(null);
  };


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">
            View, edit, and manage all registered users.
          </p>
        </div>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
           <CardDescription>
            <div className="flex justify-between items-center">
              <span>A list of all users in the system.</span>
              <Input
                placeholder="Filter by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/profile?userId=${user.id}`}>
                                <Pencil className="mr-2 h-4 w-4"/> Edit Profile
                            </Link>
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           {user.status === 'Active' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Inactive")}>
                                Mark as Inactive
                            </DropdownMenuItem>
                           ) : (
                             <DropdownMenuItem onClick={() => handleStatusChange(user.id, "Active")}>
                                Mark as Active
                            </DropdownMenuItem>
                           )}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => confirmDeleteUser(user)}>
                             <Trash2 className="mr-2 h-4 w-4"/> Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <span className="font-bold">{userToDelete?.name}</span> and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

    