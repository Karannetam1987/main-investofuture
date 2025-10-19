
"use client";

import { useState, useEffect } from "react";
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
import initialUsers from "@/lib/data/users.json";

const USERS_PER_PAGE = 25;

type User = {
    id: string;
    name: string;
    email: string;
    mobile: string;
    status: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setUsers(initialUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    // In a real app, this would be an API call.
    // For now, we update the local state.
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? {...u, status: newStatus ? "Active" : "Inactive"} : u));
    toast({
        title: "Status Updated",
        description: `User ${userId} has been set to ${
          newStatus ? "Active" : "Inactive"
        }. Note: This is not persisted.`,
      });
  };

  const handleDeleteUser = async (userId: string) => {
    // In a real app, this would be an API call.
    // For now, we update the local state.
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    toast({
        title: "User Deleted",
        description: `User ${userId} has been removed. Note: This is not persisted.`,
        variant: "destructive"
    });
  }
  
  if (loading) {
    return (
         <div className="flex-1 space-y-8 p-4 md:p-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading users...</p>
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
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`status-${user.id}`}
                      checked={user.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(user.id, checked)
                      }
                    />
                    <Badge
                      variant={
                        user.status === "Active" ? "default" : "destructive"
                      }
                    >
                      {user.status || "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/profile?userId=${user.id}`}>
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
