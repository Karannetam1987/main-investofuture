
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore } from "@/firebase";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import type { UserProfile } from "@/firebase/firestore/users";

const USERS_PER_PAGE = 25;

export default function ManageUsersPage() {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, "users");
  const { data: users, loading } = useCollection<UserProfile>(usersCollection);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredUsers = users?.filter(
    (user) =>
      user.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredUsers?.length || 0) / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const usersToShow = filteredUsers?.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    if (!firestore) return;
    // This is a placeholder for the actual user document ID from auth.
    // In a real app, you would have the document ID, not the custom 'id' field.
    // For this example, we assume we can find the user doc by the custom ID.
    // This part of the code will need to be adjusted once you can query by the custom 'id' field.
    // For now, let's pretend we have a `docId` which is the same as `auth uid`.
    // We cannot proceed without a proper way to get the document ID.

    // Let's find the user in the fetched data to get the `uid` (which is the doc id)
    const userToUpdate = users?.find(u => u.id === userId);
    if (!userToUpdate || !userToUpdate.uid) {
         toast({
            title: "Update Failed",
            description: "Could not find the document ID for this user.",
            variant: "destructive",
        });
        return;
    }


    const userDocRef = doc(firestore, "users", userToUpdate.uid);
    try {
      await updateDoc(userDocRef, {
        status: newStatus ? "Active" : "Inactive",
      });
      toast({
        title: "Status Updated",
        description: `User ${userId} has been set to ${
          newStatus ? "Active" : "Inactive"
        }.`,
      });
    } catch (error: any) {
       toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!firestore) return;
    const userToDelete = users?.find(u => u.id === userId);
     if (!userToDelete || !userToDelete.uid) {
         toast({
            title: "Deletion Failed",
            description: "Could not find the document ID for this user.",
            variant: "destructive",
        });
        return;
    }

    const userDocRef = doc(firestore, "users", userToDelete.uid);
    try {
        await deleteDoc(userDocRef);
        toast({
            title: "User Deleted",
            description: `User ${userId} has been removed.`,
            variant: "destructive"
        });
    } catch(error: any) {
        toast({
            title: "Deletion Failed",
            description: error.message,
            variant: "destructive",
        });
    }
  }
  
  if (loading) {
    return (
         <div className="flex-1 space-y-8 p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading users from database...</p>
            </div>
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by ID, name, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

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
            {usersToShow && usersToShow.length > 0 ? usersToShow.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.personalInfo.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.personalInfo.mobile}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`status-${user.id}`}
                      checked={user.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(user.id, checked)
                      }
                      disabled={true} // Re-enable once doc ID logic is solid
                    />
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : "destructive"
                      }
                      className={
                        user.status === "Active"
                          ? "bg-primary"
                          : "bg-destructive"
                      }
                    >
                      {user.status || "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/profile?userId=${user.uid}`}>
                    <Button variant="ghost" size="icon" title="View User Dashboard">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/user-dashboard?userId=${user.id}`}>
                     <Button variant="ghost" size="icon" title="Edit User">
                        <Pencil className="h-4 w-4" />
                     </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete User"
                    disabled={true} // Re-enable once doc ID logic is solid
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
