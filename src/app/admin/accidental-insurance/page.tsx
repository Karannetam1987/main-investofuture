
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
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const initialInsuranceData = {
  policyNumber: "POL12345",
  openDate: new Date("2023-01-15"),
  expiryDate: new Date("2025-01-14"),
  deathCover: "10,00,000",
  handicapCover: "5,00,000",
  description: "This is a comprehensive accidental insurance policy covering various scenarios. It is provided as part of the premium membership.",
  statements: [
    {
      id: 1,
      name: "Basic Cover",
      openingDate: new Date("2023-01-15"),
      expiryDate: new Date("2025-01-14"),
      years: 2,
      status: "Active",
    },
  ],
};


export default function AccidentalInsurancePage() {
  const [insuranceData, setInsuranceData] = useState(initialInsuranceData);
  const { toast } = useToast();

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
          openingDate: new Date(),
          expiryDate: new Date(),
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
  
  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved",
        description: "Accidental Insurance details have been successfully updated."
    })
    console.log("Saving data:", insuranceData);
  }


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Accidental Insurance</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Accidental Insurance</CardTitle>
          <CardDescription>
            View, add, or edit accidental insurance policies for users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                            {insuranceData.openDate ? format(insuranceData.openDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={insuranceData.openDate} onSelect={(date) => setInsuranceData(prev => ({...prev, openDate: date!}))} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !insuranceData.expiryDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {insuranceData.expiryDate ? format(insuranceData.expiryDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={insuranceData.expiryDate} onSelect={(date) => setInsuranceData(prev => ({...prev, expiryDate: date!}))} initialFocus />
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
                                    {stmt.openingDate ? format(stmt.openingDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={stmt.openingDate} onSelect={(date) => handleStatementChange(stmt.id, "openingDate", date!)} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !stmt.expiryDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {stmt.expiryDate ? format(stmt.expiryDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={stmt.expiryDate} onSelect={(date) => handleStatementChange(stmt.id, "expiryDate", date!)} initialFocus />
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
        </CardContent>
      </Card>
    </div>
  );
}
