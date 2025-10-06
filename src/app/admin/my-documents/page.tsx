
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Trash2, FileText, Search, Users } from "lucide-react";
import Link from "next/link";
import usersData from "@/lib/data/user-data.json";
import documentsData from "@/lib/data/user-documents.json";

type Document = {
    id: number;
    name: string;
    date: string;
    userId: string;
};

type User = {
    id: string;
    email: string;
    personalInfo: {
        fullName: string;
    };
};

export default function MyDocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [userDocuments, setUserDocuments] = useState<Document[]>([]);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const { toast } = useToast();

    const handleSearchUser = () => {
        const user = usersData.find(u => u.id.toLowerCase() === searchTerm.toLowerCase() || u.email.toLowerCase() === searchTerm.toLowerCase()) || null;
        
        if (user) {
            setFoundUser(user);
            const docs = documentsData.filter(doc => doc.userId === user.id);
            setUserDocuments(docs);
            toast({ title: "User Found", description: `Managing documents for ${user.personalInfo.fullName}.` });
        } else {
            setFoundUser(null);
            setUserDocuments([]);
            toast({ title: "User Not Found", variant: "destructive" });
        }
    };

    const handleFileUpload = () => {
        if (!fileToUpload || !foundUser) return;
        
        const newDocument = {
            id: Date.now(),
            name: fileToUpload.name,
            date: new Date().toISOString().split('T')[0],
            userId: foundUser.id
        };

        // This is a simulation. In a real app, you'd send this to a backend to update the JSON file.
        setUserDocuments(prevDocs => [...prevDocs, newDocument]);
        
        toast({ title: "Upload Successful", description: `${fileToUpload.name} has been uploaded for ${foundUser.personalInfo.fullName}.` });
        setFileToUpload(null);
         // To make this permanent, you'd need a backend API to write to `user-documents.json`.
        console.log("New document (not saved to file):", newDocument);
    };

    const handleRemoveDocument = (docId: number) => {
        if (!foundUser) return;
        
        setUserDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
       
        toast({ title: "Document Removed", variant: "destructive" });
         // To make this permanent, you'd need a backend API to write to `user-documents.json`.
        console.log("Removed docId (not saved to file):", docId);
    };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Documents</h2>
        <Link href="/admin/manage-users">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                All Members List
            </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage User Documents</CardTitle>
          <CardDescription>
            Search for a user by ID or email to upload and manage their documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Input 
                    placeholder="Search by User ID or Email" 
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                />
                <Button onClick={handleSearchUser}><Search className="mr-2 h-4"/>Search User</Button>
            </div>

            {foundUser && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Managing Documents for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.email})</span>
                    </h3>
                    
                    {/* Upload Section */}
                    <Card className="bg-muted/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Upload New Document</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full">
                                <Label htmlFor="doc-upload" className="sr-only">Choose file</Label>
                                <Input 
                                    id="doc-upload" 
                                    type="file" 
                                    onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)}
                                    className="cursor-pointer"
                                />
                            </div>
                            <Button onClick={handleFileUpload} disabled={!fileToUpload}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Document
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Document Statement */}
                    <div className="space-y-2">
                        <h4 className="text-md font-semibold">Document Statement</h4>
                        <div className="border rounded-lg">
                           <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Upload Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDocuments.length > 0 ? (
                                    userDocuments.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                                {doc.name}
                                            </TableCell>
                                            <TableCell>{format(new Date(doc.date), "PPP")}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon" onClick={() => handleRemoveDocument(doc.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">No documents uploaded yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                           </Table>
                        </div>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
