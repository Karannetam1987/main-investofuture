

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
import Link from "next/link";

// Mock data, replace with your actual data fetching
const mockUsers: { [key: string]: UserProfile } = {
  "INF001": { id: "INF001", personalInfo: { fullName: "Karan Netam" } },
  "INF002": { id: "INF002", personalInfo: { fullName: "Jane Doe" } },
};

const mockInsuranceData: { [key: string]: AccidentalInsurance } = {
    "INF001": {
        policyNumber: "POL98765",
        openDate: "2023-01-15T00:00:00.000Z",
        expiryDate: "2028-01-14T00:00:00.000Z",
        deathCover: "500000",
        handicapCover: "250000",
        description: "Comprehensive accidental coverage for Karan Netam.",
        statements: [
            { id: 1, name: "Annual Policy 2023", openingDate: "2023-01-15T00:00:00.000Z", expiryDate: "2024-01-14T00:00:00.000Z", years: 1, status: "Active" }
        ]
    }
}


type UserProfile = {
  id: string; // Registration ID
  personalInfo: {
    fullName: string;
  };
};

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
};

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
    const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [insuranceData, setInsuranceData] = useState<AccidentalInsurance>(defaultInsuranceData);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const { toast } = useToast();
    
    const handleSearchUser = async () => {
        const userId = searchTerm.trim().toUpperCase();
        if (!userId) {
            return;
        }
        setUserIdToFetch(userId);
        setIsSearching(true);
        setLoadingData(true);
        setFoundUser(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const user = mockUsers[userId];
        if (user) {
            setFoundUser(user);
            const data = mockInsuranceData[user.id] || defaultInsuranceData;
            setInsuranceData(data);
        } else {
            setFoundUser(null);
            setInsuranceData(defaultInsuranceData);
            toast({title: "User not found", variant: "destructive"});
        }
        setIsSearching(false);
        setLoadingData(false);
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
    };
    
    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        setIsSaving(true);
         // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Saving data for", foundUser.id, insuranceData);
        // In a real app, you'd update your backend here.
        mockInsuranceData[foundUser.id] = insuranceData;
        
        setIsSaving(false);
        toast({
            title: "Changes Saved",
            description: `Accidental insurance data for ${foundUser.personalInfo.fullName} has been saved.`,
        });
    }

    const isLoading = isSearching || loadingData;

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

                {isLoading && (
                    <div className="flex items-center gap-2 justify-center py-8">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary"/>
                        <p className="text-muted-foreground">Loading data...</p>
                    </div>
                )}

                {foundUser && !isLoading && (
                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold text-secondary font-headline">
                        Editing insurance for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.id})</span>
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
                                    <Calendar mode="single" selected={parseISO(insuranceData.openDate)} onSelect={(date) => date && setInsuranceData(prev => ({...prev, openDate: date.toISOString()}))} initialFocus />
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
                                    <Calendar mode="single" selected={parseISO(insuranceData.expiryDate)} onSelect={(date) => date && setInsuranceData(prev => ({...prev, expiryDate: date.toISOString()}))} initialFocus />
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
                                            <Calendar mode="single" selected={parseISO(stmt.openingDate)} onSelect={(date) => date && handleStatementChange(stmt.id, "openingDate", date.toISOString())} initialFocus />
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
                                            <Calendar mode="single" selected={parseISO(stmt.expiryDate)} onSelect={(date) => date && handleStatementChange(stmt.id, "expiryDate", date.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stmt-years-${stmt.id}`}>Years</Label>
                                    <Input id={`stmt-years-${stmt.id}`} type="number" value={stmt.years} onChange={(e) => handleStatementChange(stmt.id, "years", parseInt(e.target.value) || 0)}/>
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
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving && <LoaderCircle className="mr-2 h-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            )}
            {userIdToFetch && !isLoading && !foundUser && (
                <div className="text-center py-8 text-muted-foreground">
                    User with ID "{userIdToFetch}" not found.
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
       <Suspense fallback={<div className="flex items-center justify-center py-12">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
           </div>}>
            <InsuranceEditor />
        </Suspense>
    </div>
  );
}
