
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, LoaderCircle } from "lucide-react";
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
import initialScholarshipData from "@/lib/data/scholarship.json";


export default function ScholarshipPage() {
  const [scholarshipData, setScholarshipData] = useState(initialScholarshipData);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

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
    setIsSaving(true);
    try {
        const response = await fetch('/api/update-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: 'scholarship.json', data: scholarshipData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save changes.');
        }

        toast({
            title: "Changes Saved",
            description: "Scholarship data has been updated successfully.",
        });
    } catch (error: any) {
        toast({
            title: "Error Saving Changes",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  }


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scholarship</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Scholarship</CardTitle>
          <CardDescription>
            View, add, or edit scholarship details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <p className="text-sm text-muted-foreground">Manage user's children for scholarship purposes.</p>
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
        </CardContent>
      </Card>
    </div>
  );
}

    