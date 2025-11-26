

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

const mockFundData: { [key: string]: InterestFund } = {
    "INF001": {
        depositAmount: "100000",
        depositDate: "2023-02-01T00:00:00.000Z",
        annualInterest: "8",
        interestReturnMode: "Quarterly",
        paymentMode: "Bank Transfer",
        description: "Initial investment fund for Karan Netam.",
        statements: [
            { id: 1, date: "2023-05-01T00:00:00.000Z", interest: "2000", amount: "2000", status: "Paid" }
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
    date: string;
    interest: string;
    amount: string;
    status: "Paid" | "Pending";
};

type InterestFund = {
    depositAmount: string;
    depositDate: string;
    annualInterest: string;
    interestReturnMode: string;
    paymentMode: string;
    description: string;
    statements: Statement[];
};

const defaultFundData: InterestFund = {
  depositAmount: "",
  depositDate: new Date().toISOString(),
  annualInterest: "",
  interestReturnMode: "",
  paymentMode: "",
  description: "",
  statements: [],
};

function FundEditor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fundData, setFundData] = useState<InterestFund>(defaultFundData);
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
            const data = mockFundData[user.id] || defaultFundData;
            setFundData(data);
        } else {
            setFoundUser(null);
            setFundData(defaultFundData);
            toast({title: "User not found", variant: "destructive"});
        }
        setIsSearching(false);
        setLoadingData(false);
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
            date: new Date().toISOString(),
            interest: "",
            amount: "",
            status: "Pending",
            },
        ],
        }));
    };

    const handleRemoveStatement = (id: number) => {
        setFundData((prevData) => ({
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
        console.log("Saving data for", foundUser.id, fundData);
        // In a real app, you'd update your backend here.
        mockFundData[foundUser.id] = fundData;

        setIsSaving(false);
        toast({
            title: "Changes Saved",
            description: `Interest fund data for ${foundUser.personalInfo.fullName} has been saved.`,
        });
    }

    const isLoading = isSearching || loadingData;

    return (
        <Card>
            <CardHeader>
            <CardTitle>Manage Interest Fund</CardTitle>
            <CardDescription>
                Search for a user to manage their interest fund.
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
                        Editing interest fund for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.id})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="depositAmount">Deposit Amount (₹)</Label>
                            <Input id="depositAmount" value={fundData.depositAmount} onChange={(e) => setFundData(prev => ({...prev, depositAmount: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Deposit Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fundData.depositDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fundData.depositDate ? format(parseISO(fundData.depositDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={parseISO(fundData.depositDate)} onSelect={(date) => date && setFundData(prev => ({...prev, depositDate: date.toISOString()}))} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="annualInterest">Annual Interest (%)</Label>
                            <Input id="annualInterest" type="number" value={fundData.annualInterest} onChange={(e) => setFundData(prev => ({...prev, annualInterest: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interestReturnMode">Interest Return Mode</Label>
                            <Input id="interestReturnMode" value={fundData.interestReturnMode} onChange={(e) => setFundData(prev => ({...prev, interestReturnMode: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Input id="paymentMode" value={fundData.paymentMode} onChange={(e) => setFundData(prev => ({...prev, paymentMode: e.target.value}))}/>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={fundData.description} onChange={(e) => setFundData(prev => ({...prev, description: e.target.value}))}/>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-secondary font-headline">Statement of Interest</h3>
                        <div className="space-y-4 rounded-lg border p-4">
                            {fundData.statements.map((stmt) => (
                            <div key={stmt.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="space-y-2">
                                    <Label>4th Monthly Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !stmt.date && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {stmt.date ? format(parseISO(stmt.date), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={parseISO(stmt.date)} onSelect={(date) => date && handleStatementChange(stmt.id, "date", date.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stmt-interest-${stmt.id}`}>Interest (₹)</Label>
                                    <Input id={`stmt-interest-${stmt.id}`} value={stmt.interest} onChange={(e) => handleStatementChange(stmt.id, "interest", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`stmt-amount-${stmt.id}`}>Amount (₹)</Label>
                                    <Input id={`stmt-amount-${stmt.id}`} value={stmt.amount} onChange={(e) => handleStatementChange(stmt.id, "amount", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={stmt.status} onValueChange={(value) => handleStatementChange(stmt.id, "status", value)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
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
    );
}

export default function InterestFundPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Interest Fund</h2>
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
          <FundEditor />
      </Suspense>
    </div>
  );
}
