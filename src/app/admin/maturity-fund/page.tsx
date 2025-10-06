
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
import initialMaturityFundData from "@/lib/data/maturity-fund.json";


export default function MaturityFundPage() {
  const [fundData, setFundData] = useState(initialMaturityFundData);
  const { toast } = useToast();

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
  
  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved",
        description: "Maturity Fund details have been successfully updated."
    })
    console.log("Saving data:", fundData);
  }


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Maturity Fund</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Maturity Fund</CardTitle>
          <CardDescription>
            View, add, or edit maturity fund details for users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                                    {stmt.date ? format(new Date(stmt.date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={new Date(stmt.date)} onSelect={(date) => handleStatementChange(stmt.id, "date", date!.toISOString())} initialFocus />
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
        </CardContent>
      </Card>
    </div>
  );
}
