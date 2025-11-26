
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, LoaderCircle, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";


// Mock data, replace with your actual data fetching
const mockUsers: { [key: string]: UserProfile } = {
  "INF001": { id: "INF001", personalInfo: { fullName: "Karan Netam" } },
  "INF002": { id: "INF002", personalInfo: { fullName: "Jane Doe" } },
};

const mockScholarshipData: { [key: string]: Scholarship } = {
    "INF001": {
        registerName: "Karan Netam",
        childrenCount: 1,
        scholarshipAmount: "10000",
        years: 5,
        children: [{
            id: 1,
            childName: "Rohan Netam",
            fatherName: "Karan Netam",
            motherName: "Sunita Netam",
            gender: "male",
            dob: "2015-05-20T00:00:00.000Z",
            paymentStatements: [
                { id: 1, year: "2023", amount: "10000", status: "Paid", paymentDate: "2023-06-01T00:00:00.000Z" }
            ]
        }]
    }
}

type UserProfile = {
  id: string; // Registration ID
  personalInfo: {
    fullName: string;
  };
};

type ScholarshipChild = {
  id: number;
  childName: string;
  fatherName: string;
  motherName: string;
  gender: 'male' | 'female';
  dob: string;
  paymentStatements: ScholarshipPaymentStatement[];
};

type ScholarshipPaymentStatement = {
  id: number;
  year: string;
  amount: string;
  status: 'Paid' | 'Pending';
  paymentDate: string;
};

type Scholarship = {
  registerName: string;
  childrenCount: number;
  scholarshipAmount: string;
  years: number;
  children: ScholarshipChild[];
};

const defaultScholarshipData: Scholarship = {
  registerName: "",
  childrenCount: 0,
  scholarshipAmount: "",
  years: 0,
  children: [],
};

function ScholarshipEditor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [scholarshipData, setScholarshipData] = useState<Scholarship>(defaultScholarshipData);
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
        const data = mockScholarshipData[user.id] || {
          ...defaultScholarshipData,
          registerName: user.personalInfo.fullName
        };
        setScholarshipData(data);
    } else {
        setFoundUser(null);
        setScholarshipData(defaultScholarshipData);
        toast({title: "User not found", variant: "destructive"});
    }
    setIsSearching(false);
    setLoadingData(false);
  };
  
  const handleChildChange = (id: number, field: string, value: any) => {
    setScholarshipData((prevData) => ({
      ...prevData,
      children: prevData.children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      ),
    }));
  };

  const handleAddChild = () => {
    setScholarshipData((prevData) => ({
      ...prevData,
      children: [
        ...prevData.children,
        {
          id: Date.now(),
          childName: "",
          fatherName: prevData.registerName,
          motherName: "",
          gender: "male",
          dob: new Date().toISOString(),
          paymentStatements: [],
        },
      ],
      childrenCount: prevData.children.length + 1,
    }));
  };

  const handleRemoveChild = (id: number) => {
    setScholarshipData((prevData) => ({
      ...prevData,
      children: prevData.children.filter((child) => child.id !== id),
      childrenCount: prevData.children.length - 1,
    }));
  };

  const handleStatementChange = (childId: number, stmtId: number, field: string, value: any) => {
    setScholarshipData(prevData => ({
        ...prevData,
        children: prevData.children.map(child => {
            if (child.id === childId) {
                return {
                    ...child,
                    paymentStatements: child.paymentStatements.map(stmt => 
                        stmt.id === stmtId ? { ...stmt, [field]: value } : stmt
                    )
                };
            }
            return child;
        })
    }));
  };

  const handleAddStatement = (childId: number) => {
      setScholarshipData(prevData => ({
        ...prevData,
        children: prevData.children.map(child => {
            if (child.id === childId) {
                const newStatement = {
                    id: Date.now(),
                    year: new Date().getFullYear().toString(),
                    amount: "",
                    status: "Pending",
                    paymentDate: new Date().toISOString(),
                };
                return {
                    ...child,
                    paymentStatements: [...child.paymentStatements, newStatement]
                };
            }
            return child;
        })
    }));
  };

  const handleRemoveStatement = (childId: number, stmtId: number) => {
     setScholarshipData(prevData => ({
        ...prevData,
        children: prevData.children.map(child => {
            if (child.id === childId) {
                return {
                    ...child,
                    paymentStatements: child.paymentStatements.filter(stmt => stmt.id !== stmtId)
                };
            }
            return child;
        })
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
    console.log("Saving scholarship data for", foundUser.id, scholarshipData);
    // In a real app, you'd update your backend here.
    mockScholarshipData[foundUser.id] = scholarshipData;

    setIsSaving(false);
    toast({
        title: "Changes Saved",
        description: "Scholarship data has been saved.",
    });
  }

  const isLoading = isSearching || loadingData;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scholarship</h2>
         <Link href="/admin/manage-users">
            <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                All Members List
            </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Scholarship</CardTitle>
          <CardDescription>
            Search for a user by Registration ID to manage their scholarship details.
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
            <>
            <div className="space-y-6 pt-4 border-t">
                 <h3 className="text-xl font-semibold text-secondary font-headline">
                    Editing scholarship for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.id})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="registerName">Register Name</Label>
                        <Input id="registerName" value={scholarshipData.registerName} onChange={(e) => setScholarshipData(prev => ({...prev, registerName: e.target.value}))}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="childrenCount">No. of Children</Label>
                        <Input id="childrenCount" type="number" value={scholarshipData.childrenCount} readOnly/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="scholarshipAmount">Scholarship Amount</Label>
                        <Input id="scholarshipAmount" value={scholarshipData.scholarshipAmount} onChange={(e) => setScholarshipData(prev => ({...prev, scholarshipAmount: e.target.value}))}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="years">Years</Label>
                        <Input id="years" type="number" value={scholarshipData.years} onChange={(e) => setScholarshipData(prev => ({...prev, years: Number(e.target.value)}))}/>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-secondary font-headline">Children Details</h3>
                    <p className="text-sm text-muted-foreground">Manage children for scholarship purposes.</p>
                    <div className="space-y-6">
                        {scholarshipData.children.map((child) => (
                        <div key={child.id} className="rounded-lg border p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            <div className="space-y-2">
                                    <Label htmlFor={`child-name-${child.id}`}>Child's Name</Label>
                                    <Input id={`child-name-${child.id}`} value={child.childName} onChange={(e) => handleChildChange(child.id, "childName", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`father-name-${child.id}`}>Father's Name</Label>
                                    <Input id={`father-name-${child.id}`} value={child.fatherName} onChange={(e) => handleChildChange(child.id, "fatherName", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`mother-name-${child.id}`}>Mother's Name</Label>
                                    <Input id={`mother-name-${child.id}`} value={child.motherName} onChange={(e) => handleChildChange(child.id, "motherName", e.target.value)}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <RadioGroup value={child.gender} onValueChange={(value) => handleChildChange(child.id, "gender", value)} className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id={`male-${child.id}`} />
                                        <Label htmlFor={`male-${child.id}`}>Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id={`female-${child.id}`} />
                                        <Label htmlFor={`female-${child.id}`}>Female</Label>
                                    </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !child.dob && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {child.dob ? format(new Date(child.dob), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={new Date(child.dob)} onSelect={(date) => date && handleChildChange(child.id, "dob", date.toISOString())} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex justify-end items-end">
                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveChild(child.id)}>
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        Remove Child
                                    </Button>
                                </div>
                            </div>

                            {/* Payment Statements */}
                            <div className="space-y-2">
                                <h4 className="text-md font-semibold">Payment Statements</h4>
                                <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Amount (₹)</TableHead>
                                            <TableHead>Payment Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {child.paymentStatements.map(stmt => (
                                            <TableRow key={stmt.id}>
                                                <TableCell>
                                                    <Input value={stmt.year} onChange={(e) => handleStatementChange(child.id, stmt.id, "year", e.target.value)} className="h-8"/>
                                                </TableCell>
                                                <TableCell>
                                                    <Input value={stmt.amount} onChange={(e) => handleStatementChange(child.id, stmt.id, "amount", e.target.value)} className="h-8"/>
                                                </TableCell>
                                                <TableCell>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant={"outline"} size="sm" className={cn("w-[150px] justify-start text-left font-normal h-8", !stmt.paymentDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {stmt.paymentDate ? format(parseISO(stmt.paymentDate), "PPP") : <span>Pick a date</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar mode="single" selected={stmt.paymentDate ? new Date(stmt.paymentDate): null} onSelect={(date) => date && handleStatementChange(child.id, stmt.id, "paymentDate", date.toISOString())} initialFocus />
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={stmt.status} onValueChange={(value) => handleStatementChange(child.id, stmt.id, "status", value)}>
                                                        <SelectTrigger className="h-8 w-[120px]"><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Paid">Paid</SelectItem>
                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveStatement(child.id, stmt.id)}>
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => handleAddStatement(child.id)} className="mt-2">
                                    Add Statement
                                </Button>
                            </div>
                        </div>
                        ))}
                        <Button variant="outline" onClick={handleAddChild} className="mt-4">
                            Add Child
                        </Button>
                    </div>
                </div>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving && <LoaderCircle className="mr-2 h-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
            </>
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

export default function ScholarshipPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-12">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
           </div>}>
            <ScholarshipEditor />
        </Suspense>
    )
}
