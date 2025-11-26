
"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Upload, Trash2, FileText, Search, Users, LoaderCircle, Download } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";

// Mock data, replace with your actual data fetching
const mockUsers: { [key: string]: UserProfile } = {
  "INF001": { id: "INF001", personalInfo: { fullName: "Karan Netam" }, email: "karan@example.com" },
  "INF002": { id: "INF002", personalInfo: { fullName: "Jane Doe" }, email: "jane@example.com" },
};

const mockDocuments: { [key: string]: Document[] } = {
    "INF001": [
        { id: "1", name: "PAN_Card.pdf", url: "#", userId: "INF001", date: new Date().toISOString(), storagePath: "/docs/PAN_Card.pdf" },
        { id: "2", name: "Aadhaar_Card.pdf", url: "#", userId: "INF001", date: new Date().toISOString(), storagePath: "/docs/Aadhaar_Card.pdf" }
    ]
}

type UserProfile = {
    id: string; // Registration ID
    personalInfo: {
        fullName: string;
    }
    email: string;
};

type Document = { 
    id: string;
    name: string;
    url: string;
    userId: string;
    date: string;
    storagePath: string;
};

function MyDocumentsContent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [userDocuments, setUserDocuments] = useState<Document[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const { toast } = useToast();

    const handleSearchUser = async () => {
        const userId = searchTerm.trim().toUpperCase();
        if (!userId) {
            return;
        }
        setUserIdToFetch(userId);
        setIsSearching(true);
        setDocsLoading(true);
        setFoundUser(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = mockUsers[userId];
        if (user) {
            setFoundUser(user);
            setUserDocuments(mockDocuments[user.id] || []);
        } else {
            setFoundUser(null);
            setUserDocuments([]);
            toast({title: "User not found", variant: "destructive"});
        }
        setIsSearching(false);
        setDocsLoading(false);
    };

    const handleFileUpload = async () => {
        if (!fileToUpload || !foundUser) return;
        
        setIsUploading(true);
         // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newDoc: Document = {
            id: Date.now().toString(),
            name: fileToUpload.name,
            url: "#", // In real app, this would be the download URL
            userId: foundUser.id,
            date: new Date().toISOString(),
            storagePath: `user-documents/${foundUser.id}/${Date.now()}-${fileToUpload.name}`
        };

        setUserDocuments(prev => [...prev, newDoc]);
        if (!mockDocuments[foundUser.id]) {
            mockDocuments[foundUser.id] = [];
        }
        mockDocuments[foundUser.id].push(newDoc);
        
        setIsUploading(false);
        toast({ title: "Upload successful", description: `${fileToUpload.name} has been uploaded.` });
        setFileToUpload(null);
        const fileInput = document.getElementById('doc-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const handleRemoveDocument = async (docToRemove: Document) => {
        if (!foundUser || !docToRemove.id) return;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        setUserDocuments(prev => prev.filter(d => d.id !== docToRemove.id));
        if (mockDocuments[foundUser.id]) {
            mockDocuments[foundUser.id] = mockDocuments[foundUser.id].filter(d => d.id !== docToRemove.id);
        }

        toast({ title: "Document Removed", description: `${docToRemove.name} has been deleted.` });
    };

  const isLoading = isSearching;

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
            Search for a user by Registration ID to upload and manage their documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <Input 
                    placeholder="Search by User Reg. ID (e.g. INF001)" 
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                />
                <Button onClick={handleSearchUser} disabled={isSearching}>
                    {isSearching ? <LoaderCircle className="mr-2 h-4 animate-spin"/> : <Search className="mr-2 h-4"/>}
                    Search User
                </Button>
            </div>

            {isLoading && (
                 <div className="flex items-center gap-2 justify-center py-8">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                    <p className="text-muted-foreground">Searching for user...</p>
                </div>
            )}

            {foundUser && !isLoading && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Managing Documents for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.id})</span>
                    </h3>
                    
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
                            <Button onClick={handleFileUpload} disabled={!fileToUpload || isUploading}>
                                {isUploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                                {isUploading ? 'Uploading...' : 'Upload Document'}
                            </Button>
                        </CardContent>
                    </Card>

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
                                {docsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary"/>
                                        </TableCell>
                                    </TableRow>
                                ) : userDocuments && userDocuments.length > 0 ? (
                                    userDocuments.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                                {doc.name}
                                            </TableCell>
                                            <TableCell>{doc.date ? format(parseISO(doc.date), "PPP") : "N/A"}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                 <a href={doc.url} download={doc.name} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="icon">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                 </a>
                                                <Button variant="destructive" size="icon" onClick={() => handleRemoveDocument(doc)}>
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
             {userIdToFetch && !isLoading && !foundUser && (
                <div className="text-center py-8 text-muted-foreground">
                    User with ID "{userIdToFetch}" not found.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyDocumentsPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center py-12">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <MyDocumentsContent />
      </Suspense>
    )
}
