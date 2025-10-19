
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
import { useRouter, useSearchParams } from 'next/navigation';
import initialUserData from '@/lib/data/user-data.json';
import initialInterestFundData from '@/lib/data/interest-fund.json';

// Mock UserProfile type
type UserProfile = typeof initialUserData[0];

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

function FundEditorInternal() {
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [fundData, setFundData] = useState<InterestFund>(defaultFundData);
    const [loadingData, setLoadingData] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

     useEffect(() => {
        const userId = searchParams.get('userId')
        if (userId) {
          const fetchUserAndData = async () => {
            setIsSearching(true);
            const user = initialUserData.find(u => u.id === userId);

            if (user) {
                setFoundUser(user);
                setSearchTerm(user.id);
                await loadFundData(user.id);
            } else {
                toast({ title: "User not found with provided ID.", variant: "destructive" });
            }
            setIsSearching(false);
          }
          fetchUserAndData();
        }
      }, [searchParams, toast])


    const loadFundData = async (userId: string) => {
        setLoadingData(true);
        // Simulate loading data
        setTimeout(() => {
            setFundData(initialInterestFundData);
            setLoadingData(false);
        }, 500);
    }

    const handleSearchUser = async () => {
        if (!searchTerm.trim()) {
            toast({ title: "Search term required", variant: "destructive" });
            return;
        }
         const user = initialUserData.find(u => u.id === searchTerm.trim().toUpperCase());

         if (!user) {
            toast({ title: "User Not Found", variant: "destructive" });
            setFoundUser(null);
         } else {
             router.push(`/admin/interest-fund?userId=${user.id}`);
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
        toast({
        title: "Statement Removed",
        description: "The interest statement has been removed.",
        variant: "destructive",
        });
    };
    
    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        toast({
            title: "Changes Saved (Simulated)",
            description: `Interest Fund details for ${foundUser.personalInfo.fullName} have been updated. This is not persisted on static export.`
        });
        console.log("Saving data:", fundData);
    }

    return (
        <Card>
            <CardHeader>
            <CardTitle>Manage Interest Fund</CardTitle>
            <CardDescription>
                Search for a user by Registration ID to manage their interest fund.
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
                        Editing interest fund for: <span className="text-primary">{foundUser.personalInfo.fullName}</span>
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
                                    <Calendar mode="single" selected={parseISO(fundData.depositDate)} onSelect={(date) => setFundData(prev => ({...prev, depositDate: date!.toISOString()}))} initialFocus />
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
                                            <Calendar mode="single" selected={parseISO(stmt.date)} onSelect={(date) => handleStatementChange(stmt.id, "date", date!.toISOString())} initialFocus />
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
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            )}
        </CardContent>
      </Card>
    );
}

function FundEditor() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FundEditorInternal />
        </Suspense>
    )
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
      <FundEditor />
    </div>
  );
}
