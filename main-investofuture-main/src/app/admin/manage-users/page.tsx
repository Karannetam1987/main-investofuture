

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
import { useCollection } from "@/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase/provider";

type User = {
  id: string; // This is the Firestore document ID (same as auth UID)
  regId: string;
  personal_info: {
    fullName: string;
  };
  email: string;
  mobile: string;
  status: "Active" | "Inactive";
};

const USERS_PER_PAGE = 15;

export default function ManageUsersPage() {
  const firestore = useFirestore();
  const { data: users, loading: loadingUsers } = useCollection<User>("users");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      setUserList(users);
    }
  }, [users]);


  const filteredUsers = useMemo(() => {
    if (!userList) return [];
    return userList.filter(user =>
      user.personal_info.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.regId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userList, searchTerm]);
  
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const handleStatusChange = async (userId: string, newStatus: "Active" | "Inactive") => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, { status: newStatus });
      toast({
          title: "Status Updated",
          description: `User's status has been changed to ${newStatus}.`,
      });
    } catch (error: any) {
       toast({
          title: "Error updating status",
          description: error.message,
          variant: "destructive"
      });
    }
  };
  
  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteAlertOpen(true);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // In a real app, you would also delete the user from Firebase Auth
      await deleteDoc(doc(firestore, "users", userToDelete.id));
      toast({
          title: "User Deleted",
          description: `User ${userToDelete.personal_info.fullName} (${userToDelete.regId}) has been removed.`,
          variant: "destructive"
      });
    } catch (error: any) {
        toast({
          title: "Error deleting user",
          description: error.message,
          variant: "destructive"
      });
    } finally {
        setDeleteAlertOpen(false);
        setUserToDelete(null);
    }
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
                    <TableCell className="font-medium">{user.regId}</TableCell>
                    <TableCell>{user.personal_info.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile || "N/A"}</TableCell>
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
                            <Link href={`/dashboard/profile?userId=${user.regId}`}>
                                <Pencil className="mr-2 h-4 w-4"/> View Profile
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
              for <span className="font-bold">{userToDelete?.personal_info.fullName}</span> and remove their data from our servers.
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
