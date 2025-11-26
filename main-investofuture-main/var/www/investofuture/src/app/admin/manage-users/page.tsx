

"use client";

import { useState, useMemo, useEffect } from "react";
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
import { MoreHorizontal, Pencil, Trash2, LoaderCircle } from "lucide-react";
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

// Mock data - replace with your actual data fetching logic
const mockUsers: User[] = [
  { id: 'INF001', personalInfo: { fullName: 'Karan Netam' }, email: 'karan@example.com', mobile: '123-456-7890', status: 'Active' },
  { id: 'INF002', personalInfo: { fullName: 'Jane Doe' }, email: 'jane@example.com', mobile: '098-765-4321', status: 'Inactive' },
];

type User = {
  id: string; // Registration ID
  personalInfo: {
    fullName: string;
  };
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

const USERS_PER_PAGE = 15;

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setUsers(mockUsers);
      setLoadingUsers(false);
    }, 1000);
  }, []);


  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const handleStatusChange = async (userId: string, newStatus: "Active" | "Inactive") => {
    // Simulate API call
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast({
        title: "Status Updated",
        description: `User ${userId}'s status has been changed to ${newStatus}.`,
    });
  };
  
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    // Simulate API call
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));

    toast({
        title: "User Deleted",
        description: `User ${userToDelete.personalInfo.fullName} (${userToDelete.id}) has been removed.`,
        variant: "destructive"
    });

    setDeleteAlertOpen(false);
    setUserToDelete(null);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
              <span>A list of all users in the system. Found {filteredUsers.length} users.</span>
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
              {loadingUsers ? (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary"/>
                    </TableCell>
                </TableRow>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.personalInfo.fullName}</TableCell>
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
                            <Link href={`/admin/profile/edit?userId=${user.id}`}>
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
           <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </CardContent>
      </Card>
      
       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <span className="font-bold">{userToDelete?.personalInfo.fullName}</span> and remove their data from our servers.
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

    