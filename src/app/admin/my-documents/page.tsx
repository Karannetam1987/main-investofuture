
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
import { Upload, Trash2, FileText, Search, Users, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useCollection } from "@/firebase/firestore/use-collection";
import type { UserProfile } from "@/firebase/firestore/users";
import { format } from "date-fns";


type Document = {
  uid?: string; // Firestore document ID
  name: string;
  url: string;
  path: string; // Storage path
  userId: string;
  createdAt: any;
};

export default function MyDocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();

    const documentsCollection = foundUser ? collection(firestore, `users/${foundUser.uid}/documents`) : null;
    const { data: userDocuments, loading: docsLoading, error } = useCollection<Document>(documentsCollection);


    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
        setIsSearching(true);
        setFoundUser(null);
        
        try {
            const usersRef = collection(firestore, "users");
            const q = query(usersRef, where("id", "==", searchTerm.trim().toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast({ title: "User Not Found", variant: "destructive" });
                setFoundUser(null);
            } else {
                const userDoc = querySnapshot.docs[0];
                const userData = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
                setFoundUser(userData);
                toast({ title: "User Found", description: `Managing documents for ${userData.personalInfo.fullName}.` });
            }
        } catch (error: any) {
            toast({ title: "Search Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSearching(false);
        }
    };

    const handleFileUpload = async () => {
        if (!fileToUpload || !foundUser || !documentsCollection) return;
        
        setIsUploading(true);
        const storage = getStorage();
        const filePath = `user_documents/${foundUser.uid}/${Date.now()}_${fileToUpload.name}`;
        const storageRef = ref(storage, filePath);

        try {
            const uploadResult = await uploadBytes(storageRef, fileToUpload);
            const downloadURL = await getDownloadURL(uploadResult.ref);
            
            await addDoc(documentsCollection, {
                name: fileToUpload.name,
                url: downloadURL,
                path: filePath,
                userId: foundUser.uid,
                createdAt: serverTimestamp(),
            });
            
            toast({ title: "Upload Successful", description: `${fileToUpload.name} has been uploaded for ${foundUser.personalInfo.fullName}.` });
            setFileToUpload(null);
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveDocument = async (docToDelete: Document) => {
        if (!foundUser || !docToDelete.uid || !docToDelete.path) return;
        
        const docRef = doc(firestore, `users/${foundUser.uid}/documents`, docToDelete.uid);
        const storage = getStorage();
        const storageRef = ref(storage, docToDelete.path);

        try {
            await deleteObject(storageRef);
            await deleteDoc(docRef);
            toast({ title: "Document Removed", variant: "destructive" });
        } catch (error: any) {
            toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
        }
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
                                            <TableCell>{doc.createdAt ? format(doc.createdAt.toDate(), "PPP") : "N/A"}</TableCell>
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

    