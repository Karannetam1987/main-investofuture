
"use client";

import { useState, Suspense, useEffect } from "react";
import { AppHeader } from "@/components/header";
import { AppFooter } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Upload, Trash2, LoaderCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data, replace with your actual data fetching logic
const mockDocuments: Document[] = [
    { id: "1", name: "PAN_Card.pdf", url: "#", userId: "INF001", date: new Date().toISOString(), storagePath: "/docs/PAN_Card.pdf" },
    { id: "2", name: "Aadhaar_Card.pdf", url: "#", userId: "INF001", date: new Date().toISOString(), storagePath: "/docs/Aadhaar_Card.pdf" }
];

type Document = {
  id: string;
  name: string;
  url: string;
  userId: string;
  date: string;
  storagePath: string;
};

function MyDocumentsContent() {
    const { toast } = useToast();
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const [documents, setDocuments] = useState<Document[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);

    useEffect(() => {
        setDocsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setDocuments(mockDocuments);
            setDocsLoading(false);
        }, 500);
    }, []);
    
    const isLoading = docsLoading;

    const handleFileUpload = async () => {
        if (!fileToUpload) return;
        setIsUploading(true);

        // Simulate API call for upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newDoc: Document = {
            id: Date.now().toString(),
            name: fileToUpload.name,
            url: "#",
            userId: "INF001", // Mock user
            date: new Date().toISOString(),
            storagePath: `user-documents/INF001/${Date.now()}-${fileToUpload.name}`
        };

        setDocuments(prev => [...prev, newDoc]);
        mockDocuments.push(newDoc); // Update mock data store

        setIsUploading(false);
        toast({ title: "Upload successful", description: `${fileToUpload.name} has been uploaded.` });

        const fileInput = document.getElementById('doc-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFileToUpload(null);
    };

    const handleRemoveDocument = async (docToDelete: Document) => {
        // Simulate API call for deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocuments(prev => prev.filter(d => d.id !== docToDelete.id));
        const index = mockDocuments.findIndex(d => d.id === docToDelete.id);
        if (index > -1) {
            mockDocuments.splice(index, 1);
        }
        
        toast({ title: "Document Removed", description: `${docToDelete.name} has been deleted.` });
    };
  
    return (
        <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1 py-12 md:py-16">
            <div className="container">
            <div className="mb-6">
                <Link href="/dashboard">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>
                    View and manage documents related to your account.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                            {isUploading ? "Uploading..." : "Upload Document"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="border rounded-lg overflow-hidden">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                            <div className="flex justify-center items-center gap-2">
                                <LoaderCircle className="h-6 w-6 animate-spin text-primary"/>
                                <p className="text-muted-foreground">Loading documents...</p>
                            </div>
                            </TableCell>
                        </TableRow>
                        ) : documents && documents.length > 0 ? (
                        documents.map((doc) => (
                            <TableRow key={doc.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground"/>
                                {doc.name}
                            </TableCell>
                            <TableCell>{doc.date ? format(parseISO(doc.date), "PPP") : "N/A"}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                </a>
                                <Button variant="destructive" size="sm" onClick={() => handleRemoveDocument(doc)}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Delete
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                            No documents have been uploaded yet.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
            </div>
        </main>
        <AppFooter />
        </div>
    );
}

export default function MyDocumentsPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>}>
            <MyDocumentsContent />
        </Suspense>
    )
}
