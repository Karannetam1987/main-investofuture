
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

const initialGiftData = {
  joiningDate: new Date("2023-10-01"),
  overallStatus: "Received",
  description: "Standard joining package for new members.",
  items: [
    {
      id: 1,
      name: "Smart Watch",
      status: "Received",
      dateReceived: new Date("2023-10-26"),
    },
    {
      id: 2,
      name: "Bag",
      status: "Received",
      dateReceived: new Date("2023-10-26"),
    },
    {
      id: 3,
      name: "Agreement Document",
      status: "Pending",
      dateReceived: null,
    },
  ],
};

export default function JoiningGiftPage() {
  const [giftData, setGiftData] = useState(initialGiftData);
  const { toast } = useToast();

  const handleItemChange = (id: number, field: string, value: any) => {
    setGiftData((prevData) => ({
      ...prevData,
      items: prevData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddItem = () => {
    setGiftData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        {
          id: Date.now(),
          name: "",
          status: "Pending",
          dateReceived: null,
        },
      ],
    }));
  };

  const handleRemoveItem = (id: number) => {
    setGiftData((prevData) => ({
      ...prevData,
      items: prevData.items.filter((item) => item.id !== id),
    }));
     toast({
      title: "Item Removed",
      description: "The gift item has been removed from the list.",
      variant: "destructive",
    });
  };

  const handleSaveChanges = () => {
    toast({
        title: "Changes Saved",
        description: "Joining gift details have been successfully updated."
    })
    console.log("Saving data:", giftData);
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Joining Gift</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Joining Gift Details</CardTitle>
          <CardDescription>
            Manage general information and the list of items for the joining gift.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <Label>Joining Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !giftData.joiningDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {giftData.joiningDate ? format(giftData.joiningDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={giftData.joiningDate}
                        onSelect={(date) => setGiftData(prev => ({...prev, joiningDate: date!}))}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
                <Label htmlFor="overallStatus">Overall Status</Label>
                <Select value={giftData.overallStatus} onValueChange={(value) => setGiftData(prev => ({...prev, overallStatus: value}))}>
                    <SelectTrigger id="overallStatus">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2 md:col-span-3">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={giftData.description} onChange={(e) => setGiftData(prev => ({...prev, description: e.target.value}))}/>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-secondary font-headline">Joining Gift Items</h3>
             <p className="text-sm text-muted-foreground">
                Add or remove items given as part of the joining gift.
            </p>
            <div className="space-y-4 rounded-lg border p-4">
                {giftData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="space-y-2">
                        <Label htmlFor={`itemName-${item.id}`}>Item Name</Label>
                        <Input
                            id={`itemName-${item.id}`}
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`itemStatus-${item.id}`}>Status</Label>
                         <Select
                            value={item.status}
                            onValueChange={(value) => handleItemChange(item.id, "status", value)}
                        >
                            <SelectTrigger id={`itemStatus-${item.id}`}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Received">Received</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Date Received</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !item.dateReceived && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {item.dateReceived ? format(item.dateReceived, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={item.dateReceived}
                                onSelect={(date) => handleItemChange(item.id, "dateReceived", date)}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                         <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-full md:w-auto"
                            >
                            <Trash2 className="h-4 w-4 mr-2 md:mr-0"/>
                           <span className="md:hidden">Remove Item</span>
                        </Button>
                    </div>
                </div>
                ))}
                 <Button variant="outline" onClick={handleAddItem} className="mt-4">
                    Add Item
                </Button>
            </div>
          </div>
           <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
