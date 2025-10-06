
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, LoaderCircle, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from "@/firebase";
import { doc, setDoc, getDocFromServer, collection, query, where, getDocs } from "firebase/firestore";
import type { UserProfile } from "@/firebase/firestore/users";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';

type Statement = {
    id: number;
    amount: string;
    date: string;
    status: "Upcoming" | "Paid" | "Delayed";
};

type MaturityFund = {
    description: string;
    statements: Statement[];
};

const defaultFundData: MaturityFund = {
  description: "",
  statements: [],
};

function FundEditor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fundData, setFundData] = useState<MaturityFund>(defaultFundData);
    const [loadingData, setLoadingData] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            const fetchUserAndData = async () => {
                setIsSearching(true);
                const userDocRef = doc(firestore, "users", userId);
                const userDoc = await getDocFromServer(userDocRef);
                if (userDoc.exists()) {
                    const userData = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
                    setFoundUser(userData);
                    setSearchTerm(userData.id);
                    await loadFundData(userData.uid);
                } else {
                    toast({ title: "User not found with provided ID.", variant: "destructive" });
                }
                setIsSearching(false);
            };
            fetchUserAndData();
        }
    }, [searchParams, firestore, toast]);

    const loadFundData = async (userId: string) => {
        setLoadingData(true);
        const fundRef = doc(firestore, `users/${userId}/maturity-fund`, "details");
        const docSnap = await getDocFromServer(fundRef);
        if (docSnap.exists()) {
            setFundData(docSnap.data() as MaturityFund);
        } else {
            setFundData(defaultFundData);
        }
        setLoadingData(false);
    };

    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("id", "==", searchTerm.trim().toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ title: "User Not Found", variant: "destructive" });
            setFoundUser(null);
        } else {
            const userDoc = querySnapshot.docs[0];
            router.push(`/admin/maturity-fund?userId=${userDoc.id}`);
        }
    };

    const handleStatementChange = (id: number, field: string, value: any) => {
        setFundData((prevData) => ({
        ...prevData,
        statements: prevData.statements.map((stmt) =>
            stmt.id === id ? { ...stmt, [field]: value } : stmt
        ),
        }));
    };

    const handleAddStatement = () => {
        setFundData((prevData) => ({
        ...prevData,
        statements: [
            ...prevData.statements,
            {
            id: Date.now(),
            amount: "",
            date: new Date().toISOString(),
            status: "Upcoming",
            },
        ],
        }));
    };

    const handleRemoveStatement = (id: number) => {
        setFundData((prevData) => ({
        ...prevData,
        statements: prevData.statements.filter((stmt) => stmt.id !== id),
        }));
        toast({
        title: "Statement Removed",
        description: "The maturity fund statement has been removed.",
        variant: "destructive",
        });
    };
    
    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        try {
            const fundRef = doc(firestore, `users/${foundUser.uid}/maturity-fund`, "details");
            await setDoc(fundRef, fundData);
            toast({
                title: "Changes Saved",
                description: `Maturity Fund details for ${foundUser.personalInfo.fullName} have been updated.`
            });
        } catch (error: any) {
             toast({
                title: "Error Saving",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
            <CardTitle>Manage Maturity Fund</CardTitle>
            <CardDescription>
                Search for a user to view, add, or edit their maturity fund details.
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

                {(isSearching || loadingData) && (
                    <div className="flex items-center gap-2 justify-center py-8">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                        <p className="text-muted-foreground">{isSearching ? 'Searching for user...' : 'Loading fund data...'}</p>
                    </div>
                )}

                {foundUser && !loadingData && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Editing maturity fund for: <span className="text-primary">{foundUser.personalInfo.fullName}</span>
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            id="description" 
                            value={fundData.description} 
                            onChange={(e) => setFundData(prev => ({...prev, description: e.target.value}))}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-secondary font-headline">Statement of Maturity Fund</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            {fundData.statements.map((stmt) => (
                            <div key={stmt.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="space-y-2">
                                    <Label htmlFor={`stmt-amount-${stmt.id}`}>Maturity Amount (₹)</Label>
                                    <Input id={`stmt-amount-${stmt.id}`} value={stmt.amount} onChange={(e) => handleStatementChange(stmt.id, "amount", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !stmt.date && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {stmt.date ? format(parseISO(stmt.date), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={parseISO(stmt.date)} onSelect={(date) => handleStatementChange(stmt.id, "date", date!.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={stmt.status} onValueChange={(value) => handleStatementChange(stmt.id, "status", value)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Delayed">Delayed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Button variant="destructive" size="icon" onClick={() => handleRemoveStatement(stmt.id)} className="w-full md:w-auto">
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            ))}
                            <Button variant="outline" onClick={handleAddStatement} className="mt-4">
                                Add Statement
                            </Button>
                        </div>
                    </div>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            )}
            </CardContent>
        </Card>
    );
}


export default function MaturityFundPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Maturity Fund</h2>
         <Link href="/admin/manage-users">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                All Members List
            </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <FundEditor />
      </Suspense>
    </div>
  );
}
