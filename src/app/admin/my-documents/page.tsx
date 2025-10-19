
"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import initialUsers from "@/lib/data/user-data.json";
import initialDocs from "@/lib/data/user-documents.json";

type UserProfile = typeof initialUsers[0];
type Document = typeof initialDocs[0] & { uid?: string };

export default function MyDocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const [userDocuments, setUserDocuments] = useState<Document[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);


    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
        setIsSearching(true);
        setFoundUser(null);
        
        try {
            const user = initialUsers.find(u => u.id === searchTerm.trim().toUpperCase());

            if (!user) {
                toast({ title: "User Not Found", variant: "destructive" });
                setFoundUser(null);
                setUserDocuments([]);
            } else {
                setFoundUser(user);
                toast({ title: "User Found", description: `Managing documents for ${user.personalInfo.fullName}.` });
                setDocsLoading(true);
                // NOTE: In a real app, you would fetch docs for the specific user.
                // Here we filter the shared doc file.
                setTimeout(() => {
                    const docsForUser = initialDocs.filter(d => d.userId === user.id);
                    setUserDocuments(docsForUser.map(d => ({...d, uid: String(d.id)})));
                    setDocsLoading(false);
                }, 500);
            }
        } catch (error: any) {
            toast({ title: "Search Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSearching(false);
        }
    };
    
    const saveDocuments = async (updatedDocs: Document[]) => {
        if (!foundUser) return;
        
        // This is tricky for a shared file. We'll replace docs for the current user.
        const otherUsersDocs = initialDocs.filter(d => d.userId !== foundUser.id);
        const newFullDocList = [...otherUsersDocs, ...updatedDocs.map(({uid, ...d}) => d)];

        try {
            const response = await fetch('/api/update-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: 'user-documents.json', data: newFullDocList }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save documents.');
            }
            
            setUserDocuments(updatedDocs);
            toast({ title: "Documents Updated Successfully" });

        } catch (error: any) {
            toast({
                title: "Error Saving Documents",
                description: error.message,
                variant: "destructive",
            });
        }
    };


    const handleFileUpload = async () => {
        if (!fileToUpload || !foundUser) return;
        
        setIsUploading(true);
        // Simulate upload and create a placeholder document
        const newDoc: Document = {
            id: Date.now(),
            uid: String(Date.now()),
            name: fileToUpload.name,
            url: "#", // In a real app, this would be the URL from blob storage
            userId: foundUser.id,
            date: new Date().toISOString(),
        };

        const updatedDocs = [...userDocuments, newDoc];
        // In a real app, you'd upload the file to storage first, get the URL, then save.
        // Here we just save the metadata to the JSON file.
        await saveDocuments(updatedDocs);
        
        setIsUploading(false);
        setFileToUpload(null);
    };

    const handleRemoveDocument = async (docToDelete: Document) => {
        if (!foundUser || !docToDelete.uid) return;
        const updatedDocs = userDocuments.filter(d => d.uid !== docToDelete.uid);
        await saveDocuments(updatedDocs);
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

            {foundUser && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Managing Documents for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.email})</span>
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
                                        <TableRow key={doc.uid}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                                {doc.name}
                                            </TableCell>
                                            <TableCell>{doc.date ? format(new Date(doc.date), "PPP") : "N/A"}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                 <a href={doc.url} download target="_blank" rel="noopener noreferrer">
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
        </CardContent>
      </Card>
    </div>
  );
}

    