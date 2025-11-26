

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
import Link from "next/link";

// Mock data, replace with your actual data fetching
const mockUsers: { [key: string]: UserProfile } = {
  "INF001": { id: "INF001", personalInfo: { fullName: "Karan Netam" } },
  "INF002": { id: "INF002", personalInfo: { fullName: "Jane Doe" } },
};

const mockGiftData: { [key: string]: JoiningGift } = {
    "INF001": {
        joiningDate: "2023-01-01T00:00:00.000Z",
        overallStatus: "Partial",
        description: "Standard joining gift package.",
        items: [
            { id: 1, name: "Gift Voucher", status: "Received", dateReceived: "2023-01-01T00:00:00.000Z" },
            { id: 2, name: "Company T-Shirt", status: "Pending", dateReceived: null }
        ]
    }
}

type UserProfile = {
  id: string; // Registration ID
  personalInfo: {
    fullName: string;
  };
};

type GiftItem = {
    id: number;
    name: string;
    status: "Received" | "Pending";
    dateReceived: string | null;
}

type JoiningGift = {
    joiningDate: string;
    overallStatus: "Received" | "Pending" | "Partial";
    description: string;
    items: GiftItem[];
}

const defaultGiftData: JoiningGift = {
    joiningDate: new Date().toISOString(),
    overallStatus: "Pending",
    description: "",
    items: [],
};


function GiftEditor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);
    const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [giftData, setGiftData] = useState<JoiningGift>(defaultGiftData);
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
            const data = mockGiftData[user.id] || defaultGiftData;
            setGiftData(data);
        } else {
            setFoundUser(null);
            setGiftData(defaultGiftData);
            toast({title: "User not found", variant: "destructive"});
        }
        setIsSearching(false);
        setLoadingData(false);
    };
    
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
    };

    const handleSaveChanges = async () => {
        if (!foundUser) {
            toast({ title: "No user selected", variant: "destructive"});
            return;
        }
        
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Saving data for", foundUser.id, giftData);
        // In a real app, you'd update your backend here.
        mockGiftData[foundUser.id] = giftData;

        setIsSaving(false);
        toast({
            title: "Changes Saved",
            description: `Joining gift data for ${foundUser.personalInfo.fullName} has been saved.`,
        });
    }
    
    const isLoading = isSearching || loadingData;

    return (
        <Card>
            <CardHeader>
            <CardTitle>Joining Gift Details</CardTitle>
            <CardDescription>
                Search for a user to manage their joining gift information.
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
                        Editing joining gift for: <span className="text-primary">{foundUser.personalInfo.fullName} ({foundUser.id})</span>
                    </h3>
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
                                    {giftData.joiningDate ? format(parseISO(giftData.joiningDate), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={parseISO(giftData.joiningDate)}
                                    onSelect={(date) => date && setGiftData(prev => ({...prev, joiningDate: date.toISOString()}))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overallStatus">Overall Status</Label>
                            <Select value={giftData.overallStatus} onValueChange={(value) => setGiftData(prev => ({...prev, overallStatus: value as any}))}>
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
                            {giftData.items.map((item) => (
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
                                            {item.dateReceived ? format(parseISO(item.dateReceived), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={item.dateReceived ? parseISO(item.dateReceived) : null}
                                            onSelect={(date) => handleItemChange(item.id, "dateReceived", date ? date.toISOString() : null)}
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
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            ))}
                            <Button variant="outline" onClick={handleAddItem} className="mt-4">
                                Add Item
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

export default function JoiningGiftPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manage Joining Gift</h2>
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
            <GiftEditor />
        </Suspense>
    </div>
  );
}
