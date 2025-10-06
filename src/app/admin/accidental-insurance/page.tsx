
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
import { useUser, useFirestore } from "@/firebase";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc, setDoc, getDocFromServer, collection, query, where, getDocs } from "firebase/firestore";
import type { UserProfile } from "@/firebase/firestore/users";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation'

type Statement = {
    id: number;
    name: string;
    openingDate: string;
    expiryDate: string;
    years: number;
    status: "Active" | "Inactive" | "Expired";
}

type AccidentalInsurance = {
    policyNumber: string;
    openDate: string;
    expiryDate: string;
    deathCover: string;
    handicapCover: string;
    description: string;
    statements: Statement[];
}

const defaultInsuranceData: AccidentalInsurance = {
  policyNumber: "",
  openDate: new Date().toISOString(),
  expiryDate: new Date().toISOString(),
  deathCover: "",
  handicapCover: "",
  description: "",
  statements: [],
};


function InsuranceEditor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [insuranceData, setInsuranceData] = useState<AccidentalInsurance>(defaultInsuranceData);
    const [loadingData, setLoadingData] = useState(false);
    const { toast } = useToast();
    const firestore = useFirestore();
    const router = useRouter()
    const searchParams = useSearchParams()
 
    useEffect(() => {
        const userId = searchParams.get('userId')
        if (userId) {
          const fetchUser = async () => {
            setIsSearching(true);
            const userDocRef = doc(firestore, "users", userId);
            const userDoc = await getDocFromServer(userDocRef);
            if (userDoc.exists()) {
                const userData = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
                setFoundUser(userData);
                setSearchTerm(userData.id);
                loadInsuranceData(userData.uid);
            } else {
                toast({ title: "User not found", variant: "destructive" });
            }
            setIsSearching(false);
          }
          fetchUser();
        }
      }, [searchParams, firestore, toast])


    const loadInsuranceData = async (userId: string) => {
        setLoadingData(true);
        const insuranceRef = doc(firestore, `users/${userId}/accidental-insurance`, "details");
        const docSnap = await getDocFromServer(insuranceRef);
        if (docSnap.exists()) {
            setInsuranceData(docSnap.data() as AccidentalInsurance);
        } else {
            setInsuranceData(defaultInsuranceData);
        }
        setLoadingData(false);
    }

    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
        setIsSearching(true);
        setFoundUser(null);
        router.push(`/admin/accidental-insurance?userId=${encodeURIComponent(searchTerm.trim().toUpperCase())}`)
    };

    const handleStatementChange = (id: number, field: string, value: any) => {
        setInsuranceData((prevData) => ({
        ...prevData,
        statements: prevData.statements.map((stmt) =>
            stmt.id === id ? { ...stmt, [field]: value } : stmt
        ),
        }));
    };

    const handleAddStatement = () => {
        setInsuranceData((prevData) => ({
        ...prevData,
        statements: [
            ...prevData.statements,
            {
            id: Date.now(),
            name: "",
            openingDate: new Date().toISOString(),
            expiryDate: new Date().toISOString(),
            years: 0,
            status: "Active",
            },
        ],
        }));
    };

    const handleRemoveStatement = (id: number) => {
        setInsuranceData((prevData) => ({
        ...prevData,
        statements: prevData.statements.filter((stmt) => stmt.id !== id),
        }));
        toast({
        title: "Statement Removed",
        description: "The policy statement has been removed.",
        variant: "destructive",
        });
    };
    
    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        try {
            const insuranceRef = doc(firestore, `users/${foundUser.uid}/accidental-insurance`, "details");
            await setDoc(insuranceRef, insuranceData);
            toast({
                title: "Changes Saved",
                description: `Accidental Insurance details for ${foundUser.personalInfo.fullName} have been updated.`
            });
        } catch (error: any) {
             toast({
                title: "Error Saving",
                description: error.message,
                variant: "destructive",
            });
        }
    }

    return (
         <Card>
            <CardHeader>
            <CardTitle>Manage Accidental Insurance</CardTitle>
            <CardDescription>
                Search for a user by Registration ID to manage their accidental insurance policies.
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
                        <p className="text-muted-foreground">{isSearching ? 'Searching for user...' : 'Loading insurance data...'}</p>
                    </div>
                )}

                {foundUser && !loadingData && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Editing insurance for: <span className="text-primary">{foundUser.personalInfo.fullName}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="policyNumber">Policy Reg. Number</Label>
                            <Input id="policyNumber" value={insuranceData.policyNumber} onChange={(e) => setInsuranceData(prev => ({...prev, policyNumber: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Policy Open Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !insuranceData.openDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {insuranceData.openDate ? format(parseISO(insuranceData.openDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={parseISO(insuranceData.openDate)} onSelect={(date) => setInsuranceData(prev => ({...prev, openDate: date!.toISOString()}))} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !insuranceData.expiryDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {insuranceData.expiryDate ? format(parseISO(insuranceData.expiryDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={parseISO(insuranceData.expiryDate)} onSelect={(date) => setInsuranceData(prev => ({...prev, expiryDate: date!.toISOString()}))} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deathCover">Accident Death Cover</Label>
                            <Input id="deathCover" value={insuranceData.deathCover} onChange={(e) => setInsuranceData(prev => ({...prev, deathCover: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="handicapCover">Handicap Cover</Label>
                            <Input id="handicapCover" value={insuranceData.handicapCover} onChange={(e) => setInsuranceData(prev => ({...prev, handicapCover: e.target.value}))}/>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={insuranceData.description} onChange={(e) => setInsuranceData(prev => ({...prev, description: e.target.value}))}/>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-secondary font-headline">Statement of Accidental Policy</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            {insuranceData.statements.map((stmt) => (
                            <div key={stmt.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor={`stmt-name-${stmt.id}`}>Policy Name</Label>
                                    <Input id={`stmt-name-${stmt.id}`} value={stmt.name} onChange={(e) => handleStatementChange(stmt.id, "name", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Opening Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !stmt.openingDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {stmt.openingDate ? format(parseISO(stmt.openingDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={parseISO(stmt.openingDate)} onSelect={(date) => handleStatementChange(stmt.id, "openingDate", date!.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiry Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !stmt.expiryDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {stmt.expiryDate ? format(parseISO(stmt.expiryDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={parseISO(stmt.expiryDate)} onSelect={(date) => handleStatementChange(stmt.id, "expiryDate", date!.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stmt-years-${stmt.id}`}>Years</Label>
                                    <Input id={`stmt-years-${stmt.id}`} type="number" value={stmt.years} onChange={(e) => handleStatementChange(stmt.id, "years", parseInt(e.target.value))}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={stmt.status} onValueChange={(value) => handleStatementChange(stmt.id, "status", value)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Expired">Expired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-start-6">
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
    )
}


export default function AccidentalInsurancePage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accidental Insurance</h2>
         <Link href="/admin/manage-users">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                All Members List
            </Button>
        </Link>
      </div>
       <Suspense fallback={<div>Loading...</div>}>
            <InsuranceEditor />
        </Suspense>
    </div>
  );
}
